import { ChartBehavior } from "../../../../qwiltChart/_domain/chartBehavior";
import { AxisLabelFormatterOptions } from "highcharts";
import { GlobalFontStore } from "../../../../GlobalFontProvider";
import { ChartSeriesData } from "../../../../qwiltChart/_domain/chartSeriesData";
import _ from "lodash";

interface Options {
  categories?: string[];
  tickWidth?: number;
  crosshair?: boolean;
  formatter?: (this: AxisLabelFormatterOptions) => string;
  seriesWidthMultiplier?: number;
}
export class XAxisCategoriesBehavior implements ChartBehavior {
  constructor(private options: Options) {}

  modifyConfig(chartOptions: Highcharts.Options, chartSeriesData: ChartSeriesData[]) {
    if (!chartOptions.plotOptions) {
      chartOptions.plotOptions = {};
    }

    if (!chartOptions.chart) {
      chartOptions.chart = {};
    }
    if (this.options.seriesWidthMultiplier) {
      const categoriesCount = _.uniq(chartSeriesData.flatMap(({ histogram }) => histogram.timestamps)).length;
      chartOptions.chart.scrollablePlotArea = {
        minWidth: chartSeriesData.length * this.options.seriesWidthMultiplier * categoriesCount,
      };
    }
    chartOptions.xAxis = [
      {
        min: 0,
        tickLength: -6,
        categories: this.options.categories,
        type: "category",
        tickWidth: this.options.tickWidth ?? 2,
        crosshair: !!this.options.crosshair,
        labels: {
          formatter: this.options.formatter,
          useHTML: true,
          y: GlobalFontStore.instance.remToPixels(1.75),
        },
      },
    ];
  }
}
