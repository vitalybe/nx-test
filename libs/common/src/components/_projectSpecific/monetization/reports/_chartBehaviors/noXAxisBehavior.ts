import { ChartBehavior } from "common/components/qwiltChart/_domain/chartBehavior";

export class NoXAxisBehavior implements ChartBehavior {
  constructor() {}

  modifyConfig(chartOptions: Highcharts.Options) {
    if (!chartOptions.xAxis || Array.isArray(chartOptions.xAxis)) {
      chartOptions.xAxis = {};
    }
    chartOptions.xAxis = {
      tickLength: 1,
      minPadding: 0.1,
      maxPadding: 0.1,
      labels: {
        enabled: false,
      },
    };
  }
}
