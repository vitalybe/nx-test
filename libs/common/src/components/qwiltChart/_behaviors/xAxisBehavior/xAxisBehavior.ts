import { AxisLabelFormatterOptions, ElementObject, Options, PlotLines } from "highcharts";
import { DateTime, Duration, Zone } from "luxon";
import { ChartBehavior } from "../../_domain/chartBehavior";
import { ChartSeriesData } from "../../_domain/chartSeriesData";
import { OnlyData } from "../../../../utils/typescriptUtils";
import { BehaviorUtils } from "../utils/behaviorUtils";
import { ChartSeriesArray } from "../../_domain/chartSeriesArray";
import { HistogramSeries } from "../../../../utils/histograms/domain/histogramSeries";

const MAXIMUM_TICKS = 30;
// Possibilities of every few X the ticks would be
const TICK_EVERY_DURATIONS = [
  Duration.fromObject({ minutes: 5 }),
  Duration.fromObject({ minutes: 10 }),
  Duration.fromObject({ minutes: 20 }),
  Duration.fromObject({ minutes: 30 }),
  Duration.fromObject({ hours: 1 }),
  Duration.fromObject({ hours: 2 }),
  Duration.fromObject({ hours: 3 }),
  Duration.fromObject({ hours: 4 }),
  Duration.fromObject({ hours: 6 }),
  Duration.fromObject({ hours: 12 }),
  Duration.fromObject({ days: 1 }),
  Duration.fromObject({ days: 2 }),
  Duration.fromObject({ days: 7 }),
  Duration.fromObject({ days: 14 }),
  Duration.fromObject({ days: 21 }),
  Duration.fromObject({ months: 1 }),
  Duration.fromObject({ months: 3 }),
  Duration.fromObject({ months: 6 }),
  Duration.fromObject({ years: 1 }),
];

export class XAxisBehavior implements ChartBehavior {
  timezone: Zone = DateTime.local().zone;
  labelsColor: string = "black";
  labelsXPosition: number = 0;
  regularStyle: string = "";
  highlightedStyle: string = `font-weight: bold;`;
  backgroundColor: string = "";
  gridLineColor: string = "";
  gridLineWidth: number = 1;
  minorGridLine?: {
    color: string;
    width: number;
    tickInterval: number;
  };
  plotLines: PlotLines[] = [];

  maximumTicks: number = MAXIMUM_TICKS;
  // How early/late should the labels show in the chart. Pass different values if the labels are getting clipped/cut.
  startLabelsPercent: number = 3;
  endLabelsPercent: number = 97;
  maxPadding: number = 0;
  minPadding: number = 0;
  fixedRange?: { startDate: DateTime; endDate: DateTime };
  fixedTickEvery?: Duration;
  showBothRegularHighlightedLabels? = false;

  constructor(data?: Partial<OnlyData<XAxisBehavior>>) {
    Object.assign(this, data);
  }

  private getTickPositions(points: { x: number; y: number | null }[]) {
    const ticks = [];

    if (points.length > 0) {
      const startDate = DateTime.fromMillis(points[0].x);
      const endDate = DateTime.fromMillis(points[points.length - 1].x);
      const duration = endDate.diff(startDate);

      const tickEvery = this.fixedTickEvery ?? this.getTickEveryDuration(duration);
      // We want to avoid values like 09:23 in the x-axis. To do that, we match the X-Axis values to the
      // `tickEvery` amount. So if there is a tick every 5 minutes, then the values that appear in the axis
      // will have to be 09:25. But if there is a tick every hour, then the first label will be 10:00.
      const tickMinutes = tickEvery.as("minutes");
      const durationFromDayStart = startDate.diff(startDate.startOf("day"));
      const durationFromDayStartMinutes = durationFromDayStart.as("minutes");
      // When we use % the resulting remainder is negative, so for 09:23 and 5 minutes tick interval, it'll be 3.
      // However, we don't want to set the label to 09:20 since it is before the start time of the chart
      const negativeRemainingMinutes = durationFromDayStartMinutes % tickMinutes;
      const remainingMinutes = negativeRemainingMinutes > 0 ? tickMinutes - negativeRemainingMinutes : 0;

      let currentDate = startDate.plus({ minutes: remainingMinutes });
      while (currentDate <= endDate) {
        const index = points.findIndex(point => DateTime.fromMillis(point.x) >= currentDate);
        const percentOfAxis = Math.round((index / points.length) * 100);

        if (percentOfAxis >= this.startLabelsPercent && percentOfAxis <= this.endLabelsPercent) {
          ticks.push(currentDate.toMillis());
        }
        currentDate = currentDate.plus(tickEvery);
      }
    }

    return ticks;
  }

  private getTickEveryDuration(duration: Duration) {
    let tickEvery = TICK_EVERY_DURATIONS[TICK_EVERY_DURATIONS.length - 1];
    for (const tickEveryDuration of TICK_EVERY_DURATIONS) {
      if (duration.valueOf() / tickEveryDuration.valueOf() <= this.maximumTicks) {
        tickEvery = tickEveryDuration;
        break;
      }
    }

    return tickEvery;
  }

  private getLabelFormat(
    axisOptions: Highcharts.AxisLabelFormatterOptions,
    tickPositions: number[],
    highlightPredicate: (thisDate: DateTime, prevDate: DateTime) => boolean,
    regularFormat: string,
    highlightedFormat: string
  ): string {
    let xAxisLabel;
    const date = DateTime.fromMillis(axisOptions.value).setZone(this.timezone);
    const index = tickPositions.indexOf(axisOptions.value);

    const isNextHighlighted =
      index + 1 < tickPositions.length && this.isHighlighted(index + 1, tickPositions, highlightPredicate);
    const shouldHighlight = !isNextHighlighted && this.isHighlighted(index, tickPositions, highlightPredicate);

    if (shouldHighlight) {
      if (this.showBothRegularHighlightedLabels) {
        xAxisLabel = `<div style="display: flex; flex-direction: column; align-items: center;">
          <span style="${this.regularStyle};">${date.toFormat(regularFormat)}</span>
          <span style="${this.highlightedStyle};">${date.toFormat(highlightedFormat)}</span>
        </div>`;
      } else {
        xAxisLabel = `<span style="${this.highlightedStyle};">${date.toFormat(highlightedFormat)}</span>`;
      }
    } else {
      xAxisLabel = `<span style="${this.regularStyle}">${date.toFormat(regularFormat)}</span>`;
    }

    return xAxisLabel;
  }

  modifyConfig(chartOptions: Options, chartSeriesData: ChartSeriesData[]): void {
    if (chartSeriesData.length < 1) {
      return;
    }

    const points = this.createDataPoints(chartSeriesData[0].histogram);
    let highlightedFormat: string = "MMM d";
    let regularFormat: string = "HH:mm";
    let highlightPredicate: (thisDate: DateTime, prevDate: DateTime) => boolean = (thisDate, prevDate) =>
      thisDate.day !== prevDate.day;
    const tickPositions = this.getTickPositions(points);

    if (points.length > 0) {
      const xDelta = tickPositions[1] - tickPositions[0];
      const xDeltaDuration = Duration.fromMillis(xDelta);
      const xDeltaDays = xDeltaDuration.as("day");

      if (xDeltaDays >= 360) {
        regularFormat = "yyyy";
        highlightedFormat = "yyyy";
        highlightPredicate = (thisDate, prevDate) => thisDate.year !== prevDate.year;
      } else if (xDeltaDays >= 20) {
        regularFormat = "MMM";
        highlightedFormat = "yyyy";
        highlightPredicate = (thisDate, prevDate) => thisDate.year !== prevDate.year;
      } else if (xDeltaDays >= 1) {
        regularFormat = "d";
        highlightedFormat = "MMM d";
        highlightPredicate = (thisDate, prevDate) => thisDate.month !== prevDate.month;
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const that = this;
    chartOptions.xAxis = {
      plotLines: this.plotLines,
      min: this.fixedRange?.startDate.toMillis(),
      max: this.fixedRange?.endDate.toMillis(),
      // This makes the chart start and end at the beginning/end of the chart, without whitesplace
      maxPadding: this.maxPadding,
      minPadding: this.minPadding,
      lineWidth: 0,
      gridLineWidth: 0,
      labels: {
        style: {
          ...BehaviorUtils.axisCommonLabelStyleOption,
          color: this.labelsColor,
        },
        useHTML: true,
        autoRotationLimit: 0,
        padding: 0,
        x: this.labelsXPosition,
        overflow: "allow",
        step: 1,
        formatter(this: AxisLabelFormatterOptions): string {
          // eslint-disable-next-line @typescript-eslint/no-this-alias
          return that.getLabelFormat(this, tickPositions, highlightPredicate, regularFormat, highlightedFormat);
        },
      },
      tickPositions: tickPositions,
      tickWidth: 0,
    };

    if (this.gridLineColor) {
      chartOptions.xAxis.gridLineWidth = this.gridLineWidth;
      chartOptions.xAxis.gridLineColor = this.gridLineColor;
    }
    if (this.minorGridLine) {
      chartOptions.xAxis.minorGridLineWidth = this.minorGridLine.width;
      chartOptions.xAxis.minorGridLineColor = this.minorGridLine.color;
      chartOptions.xAxis.minorTickInterval = this.minorGridLine.tickInterval;
    }
  }

  private isHighlighted(
    index: number,
    tickPositions: number[],
    highlightPredicate: (thisDate: DateTime, prevDate: DateTime) => boolean
  ) {
    let shouldHighlight = false;
    if (index === 0) {
      shouldHighlight = true;
    } else if (index > 0) {
      const thisDate = DateTime.fromMillis(tickPositions[index]);
      const prevDate = DateTime.fromMillis(tickPositions[index - 1]);
      shouldHighlight = highlightPredicate(thisDate, prevDate);
    }
    return shouldHighlight;
  }

  private behaviorG: ElementObject | undefined = undefined;

  drawAdditions(chartSeriesGroup: ChartSeriesArray) {
    if (!this.backgroundColor) {
      return;
    }

    const chart = chartSeriesGroup.highchartChart;
    const renderer = chart?.renderer;
    this.behaviorG = renderer && BehaviorUtils.getDrawingG(renderer, this.behaviorG, "XAxisBehavior", 3);

    if (renderer?.plotBox && chart?.xAxis[0]) {
      const y = renderer.plotBox.y + renderer.plotBox.height;
      const axis = chart.xAxis[0];

      renderer
        .rect(axis.left, y, axis.width, axis.bottom, 0)
        .attr({
          "stroke-width": 0,
          stroke: this.backgroundColor,
          fill: this.backgroundColor,
        })
        .add(this.behaviorG);
    }
  }

  private createDataPoints(histogram: HistogramSeries) {
    // this function creates points of data based on the fixed range if provided
    // it is required for tick positions creation to be according to a provided fixed range
    // if no fixed range is provided, we use the original data points
    let data: { x: number; y: number | null }[] = [];
    if (!this.fixedRange) {
      data = histogram.points.map(({ x, y }) => ({ x, y }));
    } else {
      const pointInterval =
        histogram.pointInterval > 0
          ? histogram.pointInterval
          : this.getTickEveryDuration(
              Duration.fromMillis(this.fixedRange.endDate.toMillis() - this.fixedRange.startDate.toMillis())
            )?.as("milliseconds");
      const start = this.fixedRange.startDate.toMillis();
      const end = this.fixedRange.endDate.toMillis();

      for (let x = start; x <= end; x += pointInterval) {
        data.push({ x, y: 0 });
      }
    }
    return data;
  }
}
