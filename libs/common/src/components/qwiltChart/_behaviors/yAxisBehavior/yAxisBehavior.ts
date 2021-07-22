import { AxisLabelFormatterOptions, AxisLabels, AxisOptions, Options, PlotLines } from "highcharts";
import { UnitKindEnum, UnitNameEnum, unitsFormatter } from "common/utils/unitsFormatter";
import * as _ from "lodash";
import { ChartSeriesData } from "common/components/qwiltChart/_domain/chartSeriesData";
import { ChartBehavior } from "common/components/qwiltChart/_domain/chartBehavior";
import { HistogramSeries } from "common/utils/histograms/domain/histogramSeries";
import { BehaviorUtils } from "common/components/qwiltChart/_behaviors/utils/behaviorUtils";
import { OnlyData } from "common/utils/typescriptUtils";

export class YAxisBehavior implements ChartBehavior {
  gridLineColor: string = "";
  labelsColor: string = "black";
  showFirstLabel: boolean = false;
  lastLabelFormatter?: (value: number, unit: UnitKindEnum, largestUnitName: UnitNameEnum) => string;
  singleAxis: boolean = false;
  hideUnits: boolean = false;
  axisMax?: number;
  tickAmount: number = 8;
  plotLines?: PlotLines[];
  labelOptions: AxisLabels = {};

  constructor(data?: Partial<OnlyData<YAxisBehavior>>) {
    Object.assign(this, data);
  }

  private largestUnit(series: HistogramSeries[], unitKind: UnitKindEnum) {
    const largestValues: number[] = series.map(serie => {
      const maxHistogramPoint = _.maxBy(serie.points, dataPoint => dataPoint.y);
      return maxHistogramPoint?.y ? maxHistogramPoint.y : 0;
    });
    const largestValue = _.max([...largestValues, this.axisMax ?? 0]) || 0;
    return unitsFormatter.format(largestValue, unitKind).unit;
  }

  private getYAxisValue(value: number, showUnit: boolean, chartSeriesData: ChartSeriesData[], unitType: UnitKindEnum) {
    const yAxisUnits = this.getLargestValueUnitName(chartSeriesData, unitType);
    const formatted = unitsFormatter.convert(value, yAxisUnits);
    const valueString = formatted.getRounded(2);
    return `<span class="axis">${valueString} <b>${showUnit ? formatted.unit : ""}</b></span>`;
  }

  private getLargestValueUnitName(chartSeriesData: ChartSeriesData[], unitType: UnitKindEnum): UnitNameEnum {
    const histogramSeries = chartSeriesData
      .filter(serie => serie.visible)
      .map(chartSerieData => chartSerieData.histogram);
    return this.largestUnit(histogramSeries, unitType);
  }

  modifyConfig(chartOptions: Options, chartSeriesData: ChartSeriesData[]): void {
    const yAxisCommonOptions: AxisOptions = {
      title: undefined,
      plotLines: this.plotLines,
      gridLineColor: this.gridLineColor,
      showFirstLabel: this.showFirstLabel,
      showLastLabel: !!this.lastLabelFormatter,
      maxPadding: 0.3,
      gridLineWidth: 0,
      labels: {
        style: {
          ...BehaviorUtils.axisCommonLabelStyleOption,
          color: this.labelsColor,
        },
        x: 5,
        y: -5,
      },
    };
    if (this.axisMax) {
      const dataMax = _.max(chartSeriesData.map(({ histogram }) => histogram.peakValue)) ?? 0;
      if (this.axisMax > dataMax) {
        yAxisCommonOptions.max = this.axisMax;
      }
    }
    if (this.gridLineColor) {
      yAxisCommonOptions.gridLineWidth = 1;
      yAxisCommonOptions.gridLineColor = this.gridLineColor;
    }

    // in case we are using percent stacking on the series
    // we want y axis unit to be percents, even if data is of other unit type.
    const unitType =
      (chartSeriesData.length > 0 &&
        (chartSeriesData[0].stacking === "percent" ? UnitKindEnum.PERCENT : chartSeriesData[0].unitType)) ||
      UnitKindEnum.COUNT;
    if (unitType === UnitKindEnum.PERCENT) {
      // NOTE: Since first and last label are hidden, 0 and 120 aren't shown
      yAxisCommonOptions.tickPositions = [0, 20, 40, 60, 80, 100, 120];
    } else {
      yAxisCommonOptions.tickAmount = this.tickAmount;
    }

    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const _this = this;
    chartOptions.yAxis = [
      {
        ...yAxisCommonOptions,
        startOnTick: true,
        endOnTick: true,
        labels: {
          ...yAxisCommonOptions.labels,
          align: "left",
          formatter(this: AxisLabelFormatterOptions): string {
            // eslint-disable-next-line @typescript-eslint/no-this-alias
            const label = this;
            const tickAmount = label.axis.tickAmount || label.axis.tickPositions.length;

            // HACK: getting the index of the current tick
            // label is possible only after the chart fully loaded
            let tickIndex = Object.keys(label.axis.ticks).indexOf(label.pos.toString());
            if (tickIndex === -1) {
              // label is possible only before the ticks are fully loaded
              tickIndex = Object.keys(label.axis.ticks).length;
            }

            const isOneBeforeLast = tickIndex + 2 === tickAmount;

            if (label.isLast && _this.lastLabelFormatter) {
              // optional last label
              const largestUnitName = _this.getLargestValueUnitName(chartSeriesData, unitType);
              return _this.lastLabelFormatter(label.value, unitType, largestUnitName);
            }

            return _this.getYAxisValue(label.value, !_this.hideUnits && isOneBeforeLast, chartSeriesData, unitType);
          },
          ...this.labelOptions,
        },
      },
    ];
    if (!this.singleAxis) {
      chartOptions.yAxis.push({
        ...yAxisCommonOptions,
        opposite: true,
        linkedTo: 0,
        labels: {
          ...yAxisCommonOptions.labels,
          ...this.labelOptions,
          reserveSpace: false,
          x: -5,
          align: "right",
          formatter(this: AxisLabelFormatterOptions): string {
            // eslint-disable-next-line @typescript-eslint/no-this-alias
            const label = this;
            if (label.isLast && _this.lastLabelFormatter) {
              // optional last label
              const largestUnitName = _this.getLargestValueUnitName(chartSeriesData, unitType);
              return _this.lastLabelFormatter(label.value, unitType, largestUnitName);
            }
            return _this.getYAxisValue(label.value, false, chartSeriesData, unitType);
          },
        },
      });
    }
  }
}
