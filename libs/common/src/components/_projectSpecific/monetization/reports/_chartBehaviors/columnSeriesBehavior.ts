import { ChartBehavior } from "../../../../qwiltChart/_domain/chartBehavior";
import { ColumnChartSeriesOptions } from "highcharts";

export class ColumnSeriesBehavior implements ChartBehavior {
  constructor(private options: ColumnChartSeriesOptions = {}) {}

  modifyConfig(chartOptions: Highcharts.Options) {
    if (!chartOptions.plotOptions) {
      chartOptions.plotOptions = {};
    }
    // for some reason states do not work if there is no definition of them inside plotOptions.series
    chartOptions.plotOptions.series = {
      ...(chartOptions.plotOptions.series ?? {}),
      states: {
        hover: {},
      },
    };
    chartOptions.plotOptions.column = {
      ...this.options,
    };
  }
}
