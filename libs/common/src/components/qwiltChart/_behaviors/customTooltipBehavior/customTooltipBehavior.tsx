import { ChartObject, Options, PlotPoint, PointObject } from "highcharts";
import { ChartBehavior } from "common/components/qwiltChart/_domain/chartBehavior";
import { ChartSeriesData } from "common/components/qwiltChart/_domain/chartSeriesData";
// eslint-disable-next-line unused-imports/no-unused-vars
import { ReactElement } from "react";
import ReactDOMServer from "react-dom/server";
import { loggerCreator } from "common/utils/logger";

const moduleLogger = loggerCreator(__filename);

export class CustomTooltipBehavior implements ChartBehavior {
  constructor(
    private tooltipContent: (props: { index: number; chartSeriesDataItems: ChartSeriesData[] }) => ReactElement | null,
    private yPosition: number = 90,
    private suppressPositioner: boolean = false
  ) {}

  private getTooltipConfig(getTooltipHtml: (points: PointObject[]) => string | boolean) {
    const that = this;
    return {
      enabled: true,
      useHTML: true,
      shared: true,
      padding: 0,
      borderWidth: 0,
      shadow: false,
      formatter: function (this: { points: PointObject[] }) {
        return getTooltipHtml(this.points);
      },
      positioner: this.suppressPositioner
        ? undefined
        : function (this: { chart: ChartObject }, labelWidth: number, labelHeight: number, point: PlotPoint) {
            const chart = this.chart;
            if (!chart) {
              return { x: 0, y: 0 };
            }

            let tooltipX;
            const plotLeft = chart.plotLeft!;

            if (chart.plotWidth !== undefined && point.plotX + labelWidth > chart.plotWidth) {
              tooltipX = point.plotX + plotLeft - labelWidth - 20;
            } else {
              tooltipX = point.plotX + plotLeft + 20;
            }

            return {
              x: tooltipX,
              y: that.yPosition,
            };
          },
    };
  }

  modifyConfig(chartOptions: Options, chartSeriesDataItems: ChartSeriesData[]): void {
    chartOptions.tooltip = this.getTooltipConfig((points) => {
      let tooltipResult: string | boolean = false;

      try {
        if (points.length !== 0 && chartSeriesDataItems.length !== 0) {
          const index = chartSeriesDataItems[0].histogram.points.findIndex((value) => value.x === points[0].x);
          const content = this.tooltipContent({ index, chartSeriesDataItems });
          if (content) {
            tooltipResult = ReactDOMServer.renderToString(content);
          }
        }
      } catch (e) {
        moduleLogger.error("failed to show tooltip", e);
      }

      return tooltipResult;
    });
  }
}
