import * as _ from "lodash";
import { Ajax, AjaxMetadata } from "../../../utils/ajax";
import { UrlParams } from "../../_utils/urlParams";
import {
  AnalyticsGeneralParamsEnum,
  AnalyticsHistogramStatsEnum,
  AnalyticsParams,
  AnalyticsReportTypeEnum,
  ApiAggregationGroupType,
  ApiAggregationType,
  ApiHistogramBin,
  ApiHistogramBinCommon,
  ApiHistogramGroupType,
  ApiHistogramStatsList,
  ApiHistogramType,
  ApiMinimumBinIntervals,
  ApiPercentileType,
  ApiReportType,
  ApiSeries,
  ErrorStatusApiType,
} from "../mediaAnalyticsTypes";
import { TimeConfig } from "../../../utils/timeConfig";
import { getOriginForApi } from "../../backendOrigin";
import { MediaAnalyticsSeries } from "../mediaAnalyticsSeries";
import { DateTime, Duration } from "luxon";
import { loggerCreator } from "../../../utils/logger";
import { devToolsStore } from "../../../components/devTools/_stores/devToolsStore";
import { MediaAnalyticsApiMock } from "../../mediaAnalytics";
import { Notifier } from "../../../utils/notifications/notifier";

const moduleLogger = loggerCreator("__filename");

export class MediaAnalyticsApi {
  protected readonly originUrl = getOriginForApi("media-analytics");

  public static readonly TRANSPARENT_SITE = "all-transparent-sites";

  private getPath = async (path: string, params: UrlParams, metadata?: AjaxMetadata) => {
    const url = new URL(`${this.originUrl}/${path}/${params.stringified}`);
    const json = (await Ajax.getJson(url.href, metadata)) as ErrorStatusApiType;
    if (json.error) {
      throw new Error(`${json.status}: ${json.message}`);
    }
    return json;
  };

  private getSeriesGranularities = async (metadata: AjaxMetadata = new AjaxMetadata(true)) => {
    const path = "api/1.0/reports/series";
    const params = new UrlParams({
      _sourceFunction: "_getMinimumBinInterval",
      api: true,
    });
    return (await this.getPath(path, params, metadata)) as ApiMinimumBinIntervals;
  };

  private restrictQns(restrictedQns: string[], systemIds: string[]) {
    if (systemIds.length > 0) {
      // if user made a request that already limits the systemIds, use it, but restrict by allowed
      systemIds = _.intersection(restrictedQns, systemIds);
    } else {
      // we don't want with nothing, as it would remove all the systemIds
      systemIds = restrictedQns;
    }

    return systemIds;
  }

  private getReport = async (
    reportType: AnalyticsReportTypeEnum,
    timeConfig: TimeConfig,
    additionalParams?: AnalyticsParams,
    metadata: AjaxMetadata = new AjaxMetadata()
  ): Promise<ApiReportType> => {
    const path = `api/1.0/reports/overtime/${reportType}`;
    const params = new UrlParams({
      from: Math.floor(timeConfig.fromDate.toSeconds()),
      to: Math.floor(timeConfig.toDate.toSeconds()),
      debug: true,
      ...additionalParams,
    });

    return (await this.getPath(path, params, metadata)) as ApiReportType;
  };

  // this function returns the suggested binInterval for a given duration, performance-wise for the client and the server.
  // for example, for 24 hours, the suggested binInterval is **5 minutes** but for a week, it is **15 minutes**.
  // if `minInterval` is given, then no interval below it will be returned.
  private suggestedBinIntervalForDuration = (duration: Duration, minInterval?: Duration): Duration => {
    const durationMs = duration.valueOf();

    let binInterval: Duration;

    if (durationMs <= +Duration.fromObject({ hours: 12 })) {
      binInterval = Duration.fromObject({ minutes: 1 });
    } else if (durationMs <= +Duration.fromObject({ days: 1 })) {
      binInterval = Duration.fromObject({ minutes: 5 });
    } else if (durationMs <= +Duration.fromObject({ weeks: 1 })) {
      binInterval = Duration.fromObject({ minutes: 15 });
    } else if (durationMs <= +Duration.fromObject({ weeks: 2 })) {
      binInterval = Duration.fromObject({ minutes: 30 });
    } else if (durationMs <= +Duration.fromObject({ months: 1 })) {
      binInterval = Duration.fromObject({ hours: 1 });
    } else if (durationMs <= +Duration.fromObject({ years: 1 })) {
      binInterval = Duration.fromObject({ hours: 2 });
    } else {
      binInterval = Duration.fromObject({ hours: 6 });
    }

    if (!minInterval || +binInterval > +minInterval) {
      return binInterval;
    } else {
      return minInterval;
    }
  };

  private adjustForCompleteBin(date: DateTime, binInterval: Duration) {
    const diff = date.valueOf() % binInterval.valueOf();
    return DateTime.fromMillis(date.valueOf() - diff.valueOf());
  }

  private adjustForCompleteDuration(duration: Duration, binInterval: Duration) {
    const binDurationMs = binInterval.valueOf();
    const durationMs = duration.valueOf();

    const diff = durationMs % binDurationMs;
    let newDurationMs = durationMs - diff;
    if (newDurationMs < binDurationMs) {
      newDurationMs = binDurationMs;
    }

    return Duration.fromMillis(newDurationMs);
  }

  prettyTimeConfig(timeConfig: TimeConfig) {
    return `\tFrom - ${timeConfig.fromDate.toFormat("FF")}
    To - ${timeConfig.toDate.toFormat("FF")}
    BinInterval - ${this.prettyDuration(timeConfig.binInterval)}`;
  }

  prettyDuration(duration: Duration) {
    return duration.toFormat("h'h':m'm':s's'");
  }

  async getAdjustedTimeConfig(requestedTimeConfig: TimeConfig, series: MediaAnalyticsSeries[]): Promise<TimeConfig> {
    const originalDuration = requestedTimeConfig.toDate.diff(requestedTimeConfig.fromDate);
    const originalToDate = requestedTimeConfig.toDate;

    const duration = Duration.fromMillis(originalDuration.as("millisecond"));
    const minimumBinInterval = await this.getMinimumBinIntervalForSeries(series, originalToDate, duration);
    return TimeConfig.adjustTimeConfig(requestedTimeConfig, minimumBinInterval);
  }

  getHistogram = async (
    requestedTimeConfig: TimeConfig,
    series: MediaAnalyticsSeries[],
    additionalParams: AnalyticsParams = {},
    metadata: AjaxMetadata = new AjaxMetadata(true)
  ): Promise<{ timeConfig: TimeConfig; report: ApiHistogramGroupType | ApiHistogramType }> => {
    const timeConfig = await this.getAdjustedTimeConfig(requestedTimeConfig, series);
    const seriesGroups = _.groupBy(series, (series) => series!.group);
    const binIntervalSeconds = timeConfig.binInterval.as("seconds");

    ////////////////////////////////////////////
    // NOTE: remove after combining group by is supported
    if (AnalyticsGeneralParamsEnum.GROUP_BY in additionalParams) {
      const params = {
        series: series.map((s) => s.name),
        bin_interval: `${binIntervalSeconds}s`,
        stats: Object.values(AnalyticsHistogramStatsEnum),
        ...additionalParams,
      };

      const report = (await this.getReport(
        AnalyticsReportTypeEnum.HISTOGRAM,
        timeConfig,
        params,
        metadata
      )) as ApiHistogramGroupType;
      return { report: report, timeConfig: timeConfig };
    }
    ////////////////////////////////////////////
    const histograms = await Promise.all(
      Object.keys(seriesGroups).map((groupType) => {
        const params = {
          series: seriesGroups[groupType].map((s) => s.name),
          bin_interval: `${binIntervalSeconds}s`,
          stats: Object.values(AnalyticsHistogramStatsEnum),
          ...additionalParams,
        };
        return this.getReport(
          AnalyticsReportTypeEnum.HISTOGRAM,
          timeConfig,
          params,
          metadata
        ) as Promise<ApiHistogramType>;
      })
    );

    const report = this.combineHistograms(histograms);
    return { report: report, timeConfig: timeConfig };
  };

  getAggregation = async (
    requestedTimeConfig: TimeConfig,
    series: MediaAnalyticsSeries[],
    additionalParams: AnalyticsParams = {},
    metadata: AjaxMetadata = new AjaxMetadata(true)
  ) => {
    const timeConfig = await this.getAdjustedTimeConfig(requestedTimeConfig, series);
    const seriesGroups = _.groupBy(series, (series) => series!.group);

    ////////////////////////////////////////////
    // NOTE: remove after combining group by is supported
    if (AnalyticsGeneralParamsEnum.GROUP_BY in additionalParams) {
      const params = { series: series.map((s) => s.name), ...additionalParams };
      return this.getReport(
        AnalyticsReportTypeEnum.AGGREGATION,
        timeConfig,
        params,
        metadata
      ) as Promise<ApiAggregationGroupType>;
    }
    ////////////////////////////////////////////

    const aggregations = await Promise.all(
      _.map(
        seriesGroups,
        (group) =>
          this.getReport(
            AnalyticsReportTypeEnum.AGGREGATION,
            timeConfig,
            {
              series: group.map((series) => series!.name),
              ...additionalParams,
            },
            metadata
          ) as Promise<ApiAggregationType>
      )
    );

    return this.combineAggregations(aggregations);
  };

  getPercentile = async (
    requestedTimeConfig: TimeConfig,
    series: MediaAnalyticsSeries[],
    additionalParams: AnalyticsParams,
    metadata: AjaxMetadata
  ): Promise<ApiPercentileType> => {
    const timeConfig = await this.getAdjustedTimeConfig(requestedTimeConfig, series);
    const binIntervalSeconds = timeConfig.binInterval.as("seconds");

    return (await this.getReport(
      AnalyticsReportTypeEnum.PERCENTILE,
      timeConfig,
      {
        series: series.map((serie) => serie.name),
        bin_interval: `${binIntervalSeconds}s`,
        ...additionalParams,
      },
      metadata
    )) as ApiPercentileType;
  };

  getLiveDataLatestDate = async (
    series: MediaAnalyticsSeries[],
    additionalParams: AnalyticsParams = {},
    metadata: AjaxMetadata = new AjaxMetadata(true)
  ): Promise<DateTime> => {
    const latestDate = DateTime.local();

    const seriesRequests: Promise<DateTime>[] = [];
    for (const serie of series) {
      const serieMinBinInterval = await this.getMinimumBinIntervalForSeries(
        [serie],
        latestDate,
        Duration.fromObject({ hours: 1 })
      );
      //NOTE: calculate only 1 min / 5 min interval series
      if (serieMinBinInterval.minutes <= 5) {
        seriesRequests.push(
          this.getLiveDataDropDate([serie], additionalParams, metadata, latestDate, serieMinBinInterval)
        );
      }
    }

    const dateTimes = await Promise.all(seriesRequests);
    return _.minBy<DateTime>(dateTimes, (dateTime) => dateTime.valueOf()) ?? latestDate;
  };

  private getLiveDataDropDate = async (
    series: MediaAnalyticsSeries[],
    additionalParams: AnalyticsParams = {},
    metadata: AjaxMetadata = new AjaxMetadata(true),
    toDate: DateTime = DateTime.local(),
    binInterval: Duration
  ): Promise<DateTime> => {
    const MAXIMUM_LIVE_DATA_DELAY_MINUTES = 15;
    // The percent of docCounts before we consider that enough data was collected
    const MINIMUM_THRESHOLD_PERCENT = 0.9;

    const fromDate = toDate.minus({ minutes: 15 });

    const timeConfig: TimeConfig = {
      toDate,
      fromDate,
      binInterval,
    };

    let lastAvailableLiveData = toDate;

    try {
      const data = await this.getHistogram(timeConfig, series, additionalParams, metadata);
      const bins: ApiHistogramBinCommon[] = data.report.reports.overtime.histogram.bins;
      const docCounts = bins.flatMap((bin) => bin.docCount);
      let filteredDocCounts = docCounts;
      //if duration is longer than 10 min, don't take into count the last 10 min when calculating avg
      if (toDate.diff(fromDate).minutes > 10) {
        filteredDocCounts = bins
          .filter((bin) => toDate.diff(DateTime.fromSeconds(bin.timestamp)).minutes > 10)
          .flatMap((bin) => bin.docCount);
      }

      const docCountAvg = _.sum(filteredDocCounts) / filteredDocCounts.length;
      const minDocCount = docCountAvg * MINIMUM_THRESHOLD_PERCENT;

      for (let i = 1; i < docCounts.length; i++) {
        const docCount = docCounts[i];
        if (_.isNumber(docCount) && minDocCount > docCount) {
          const dropDateTime = DateTime.fromSeconds(bins[i - 1].timestamp);
          if (dropDateTime.diff(toDate).minutes < MAXIMUM_LIVE_DATA_DELAY_MINUTES) {
            lastAvailableLiveData = dropDateTime;
          }
          break;
        }
      }
    } catch (e) {
      lastAvailableLiveData = toDate.minus({ minutes: MAXIMUM_LIVE_DATA_DELAY_MINUTES });
      Notifier.warn("Failed to find the latest timestamp for live data", e);
    }

    return lastAvailableLiveData;
  };

  protected getMinimumBinIntervalForSeries = async (
    series: MediaAnalyticsSeries[],
    toDate: DateTime,
    duration: Duration
  ): Promise<Duration> => {
    const allowedSeriesBinIntervals = [];

    const seriesGranularities = await this.getSeriesGranularities();
    for (const serie of series) {
      const value = await serie.getMinimumBinInterval(toDate, duration, seriesGranularities);
      if (value) {
        allowedSeriesBinIntervals.push(value);
      }
    }
    return Duration.fromObject({ second: _.max(allowedSeriesBinIntervals) });
  };

  private combineAggregations = (aggregations: ApiAggregationType[]) => {
    let series: ApiSeries = aggregations[0].reports.overtime.aggregation.series;

    for (const aggregation of aggregations.slice(1)) {
      const aggregationSeries = aggregation.reports.overtime.aggregation;
      series = _.merge(series, aggregationSeries);
    }

    return {
      reports: {
        overtime: {
          aggregation: { series },
        },
      },
    };
  };

  private combineHistograms = (histograms: ApiHistogramType[]): ApiHistogramType => {
    const bins: ApiHistogramBin[] = histograms[0].reports.overtime.histogram.bins;
    const stats: ApiHistogramStatsList | null = histograms[0].reports.overtime.histogram.stats;

    for (const histogram of histograms.slice(1)) {
      const histogramBins = histogram.reports.overtime.histogram.bins;
      const histogramStats = histogram.reports.overtime.histogram.stats;

      if (histogramBins.length === bins.length) {
        for (let i = 0; i < histogramBins.length; i++) {
          bins[i].series = _.merge(bins[i].series, histogramBins[i].series);
        }
      } else {
        Notifier.warn(`Excluded bins; merging bins (${histogramBins}) does not match the target (${bins})`);
      }

      if (stats && histogramStats) {
        for (const statType of Object.values(AnalyticsHistogramStatsEnum)) {
          stats.statsResults[statType as AnalyticsHistogramStatsEnum].series = _.merge(
            stats.statsResults[statType as AnalyticsHistogramStatsEnum].series,
            histogramStats.statsResults[statType as AnalyticsHistogramStatsEnum].series
          );
        }
      }
    }

    return {
      reports: {
        overtime: {
          histogram: { stats, bins },
        },
      },
    };
  };

  //region [[ Singleton ]]
  protected static _instance: MediaAnalyticsApi | undefined;
  static get instance(): MediaAnalyticsApi {
    if (!this._instance) {
      this._instance = (!devToolsStore.isMockMode
        ? new MediaAnalyticsApi()
        : MediaAnalyticsApiMock.instance) as MediaAnalyticsApi;
    }

    return this._instance;
  }
  //endregion
}
