import { DateTime, Duration } from "luxon";
import { loggerCreator } from "./logger";

const moduleLogger = loggerCreator("__filename");

export class TimeConfig {
  readonly fromDate: DateTime;
  readonly toDate: DateTime;
  readonly binInterval: Duration;

  // this function returns the suggested binInterval for a given duration, performance-wise for the client and the server.
  // for example, for 24 hours, the suggested binInterval is **5 minutes** but for a week, it is **15 minutes**.
  // if `minInterval` is given, then no interval below it will be returned.
  private static getBinIntervalForDuration = (duration: Duration): Duration => {
    const durationMs = duration.valueOf();

    let binInterval: Duration;

    if (durationMs <= +Duration.fromObject({ hours: 12 })) {
      binInterval = Duration.fromObject({ minutes: 1 });
    } else if (durationMs <= +Duration.fromObject({ days: 2 })) {
      binInterval = Duration.fromObject({ minutes: 5 });
    } else if (durationMs <= +Duration.fromObject({ weeks: 1 })) {
      binInterval = Duration.fromObject({ minutes: 15 });
    } else if (durationMs <= +Duration.fromObject({ weeks: 2 })) {
      binInterval = Duration.fromObject({ minutes: 30 });
    } else if (durationMs <= +Duration.fromObject({ months: 2 })) {
      binInterval = Duration.fromObject({ hours: 2 });
    } else if (durationMs <= +Duration.fromObject({ years: 1 })) {
      binInterval = Duration.fromObject({ day: 1 });
    } else {
      binInterval = Duration.fromObject({ day: 5 });
    }

    return binInterval;
  };

  // NOTE:
  // binInterval - Optional - If not provided, it is calculated automatically based on the suggested for the duration.
  constructor(fromDate: DateTime, toDate: DateTime = DateTime.local(), binInterval?: Duration) {
    if (binInterval && binInterval.valueOf() === 0) throw new Error(`minBinInterval must be above 0`);

    if (!binInterval) {
      const duration = toDate.diff(fromDate);
      binInterval = TimeConfig.getBinIntervalForDuration(duration);
    }

    this.toDate = toDate;
    this.fromDate = fromDate;
    this.binInterval = binInterval;
  }

  static fromDuration(duration: Duration, toDate: DateTime = DateTime.local(), binInterval?: Duration) {
    if (duration.valueOf() === 0) throw new Error(`duration must be above 0`);

    const fromDate = toDate.minus(duration);
    return new TimeConfig(fromDate, toDate, binInterval);
  }

  static fromDurationWithMinimumInterval(
    duration: Duration,
    toDate: DateTime = DateTime.local(),
    binInterval: Duration
  ) {
    const defaultTimeConfig = TimeConfig.fromDuration(duration, toDate);
    if (defaultTimeConfig.binInterval.valueOf() < binInterval.valueOf()) {
      return TimeConfig.fromDuration(duration, toDate, binInterval);
    }
    return defaultTimeConfig;
  }

  static getMockHourConfiguration = () =>
    TimeConfig.fromDuration(Duration.fromObject({ hour: 1 }), DateTime.fromISO("2018-10-08T21:00:00.000+03:00"));

  static getMockDayConfiguration = () =>
    TimeConfig.fromDuration(Duration.fromObject({ day: 1 }), DateTime.fromISO("2018-10-08T22:00:00.000+03:00"));

  static getMockWeekConfiguration = () =>
    TimeConfig.fromDuration(Duration.fromObject({ day: 7 }), DateTime.fromISO("2018-10-08T22:00:00.000+03:00"));

  static getMockMonthConfiguration = () =>
    TimeConfig.fromDuration(Duration.fromObject({ month: 1 }), DateTime.fromISO("2018-10-08T21:00:00.000+03:00"));

  static adjustTimeConfig(
    requestedTimeConfig: TimeConfig,
    minimumBinInterval: Duration = Duration.fromObject({ minutes: 1 })
  ): TimeConfig {
    let wasAdjusted = false;

    const originalDuration = requestedTimeConfig.toDate.diff(requestedTimeConfig.fromDate);
    const originalToDate = requestedTimeConfig.toDate;
    const originalBinInterval = requestedTimeConfig.binInterval;

    let duration = Duration.fromMillis(originalDuration.as("millisecond"));

    // Take into account the minimum binInterval for each series, including downsampling
    const binInterval = Duration.fromMillis(Math.max(+requestedTimeConfig.binInterval, +minimumBinInterval));
    if (+binInterval !== +originalBinInterval) {
      const prettyOriginal = this.prettyDuration(originalBinInterval);
      const prettyNew = this.prettyDuration(binInterval);
      moduleLogger.debug(`ADJUSTING: binInterval - ${prettyOriginal} -> ${prettyNew}`);

      wasAdjusted = true;
    }

    // adjustment should be done to the minimum of 300 seconds interval
    // to be consistent with the interval measured peak is based on
    const minIntervalForAdjustment = Duration.fromObject({ seconds: Math.max(minimumBinInterval.as("seconds"), 300) });

    // Per Niri: It is important that the `date % minimumBinInterval === 0` - Otherwise we might get data from a bin that isn't full
    const toDate = this.adjustForCompleteBin(originalToDate, minIntervalForAdjustment);
    if (+toDate !== +originalToDate) {
      const prettyMinBinInterval = this.prettyDuration(minimumBinInterval);
      moduleLogger.debug(`ADJUSTING: toDate - ${originalToDate.toFormat("FF")} -> ${toDate.toFormat("FF")}`);
      moduleLogger.debug(`WHY: origin date % minBinInterval (${prettyMinBinInterval}) must be equal 0`);

      wasAdjusted = true;
    }

    duration = this.adjustForCompleteDuration(duration, binInterval);
    if (+duration !== +originalDuration) {
      const prettyBinInterval = this.prettyDuration(binInterval);
      const prettyOriginal = `${this.prettyDuration(originalDuration)}`;
      const prettyDuration = this.prettyDuration(duration);
      moduleLogger.debug(`ADJUSTING: duration -  ${prettyOriginal} -> ${prettyDuration}`);
      moduleLogger.debug(`WHY: must match bin interval (${prettyBinInterval})`);

      wasAdjusted = true;
    }

    const adjustedTimeConfig = TimeConfig.fromDuration(duration, toDate, binInterval);
    if (wasAdjusted) {
      moduleLogger.debug(`Time config after adjustment: \n${this.prettyTimeConfig(adjustedTimeConfig)}`);
    }

    if (!adjustedTimeConfig.toDate.isValid) {
      throw new Error(`invalid adjusted toDate`);
    }

    if (!adjustedTimeConfig.fromDate.isValid) {
      throw new Error(`invalid adjusted fromDate`);
    }

    return adjustedTimeConfig;
  }

  static prettyTimeConfig(timeConfig: TimeConfig) {
    return `\tFrom - ${timeConfig.fromDate.toFormat("FF")}
    To - ${timeConfig.toDate.toFormat("FF")}
    BinInterval - ${this.prettyDuration(timeConfig.binInterval)}`;
  }

  static prettyDuration(duration: Duration) {
    return duration.toFormat("h'h':m'm':s's'");
  }

  private static adjustForCompleteBin(date: DateTime, binInterval: Duration) {
    const diff = date.valueOf() % binInterval.valueOf();
    return DateTime.fromMillis(date.valueOf() - diff.valueOf());
  }

  private static adjustForCompleteDuration(duration: Duration, binInterval: Duration) {
    const binDurationMs = binInterval.valueOf();
    const durationMs = duration.valueOf();

    const diff = durationMs % binDurationMs;
    let newDurationMs = durationMs - diff;
    if (newDurationMs < binDurationMs) {
      newDurationMs = binDurationMs;
    }

    return Duration.fromMillis(newDurationMs);
  }
}
