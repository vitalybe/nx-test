import { loggerCreator } from "common/utils/logger";
import { ChartSeries } from "common/components/qwiltChart/_domain/chartSeries";
import { HistogramUtils, HistogramPointType } from "common/utils/histograms/utils/histogramUtils";
import { ChartObject } from "highcharts";

const moduleLogger = loggerCreator(__filename);

export class ChartSeriesArray {
  constructor(public readonly series: ChartSeries[]) {
    HistogramUtils.assertSeriesSameX(series);
  }

  get highchartChart(): ChartObject | undefined {
    return this.series[0]?.highchartChart;
  }

  getXAxisChartPoint(index: number) {
    return { index: 0, y: 0, plotX: 0, ...this.series[0].getChartPoint(index), plotY: 0 };
  }

  get axisPoints(): HistogramPointType[] {
    if (!this.series || this.series.length < 1) {
      throw new Error(`no chart series are available`);
    }

    return this.series[0].points;
  }

  get firstAxisPoint(): HistogramPointType {
    return this.axisPoints[0];
  }

  get lastAxisPoint(): HistogramPointType {
    return this.axisPoints[this.axisPoints.length - 1];
  }
}
