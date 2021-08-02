import { ChartBehavior } from "common/components/qwiltChart/_domain/chartBehavior";

export class NoTooltipBehavior implements ChartBehavior {
  modifyConfig(chartOptions: Highcharts.Options) {
    chartOptions.tooltip = {
      followPointer: true,
      shared: true,
      formatter(): boolean | string {
        return false;
      },
    };
  }
}
