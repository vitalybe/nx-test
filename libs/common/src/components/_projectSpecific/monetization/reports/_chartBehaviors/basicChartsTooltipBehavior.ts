import { ReactElement } from "react";
import { ChartBehavior } from "common/components/qwiltChart/_domain/chartBehavior";
import { Options, PointObject, SeriesObject, TooltipOptions } from "highcharts";
import { ChartSeriesData } from "common/components/qwiltChart/_domain/chartSeriesData";
import { renderToString } from "react-dom/server";

export interface ThisTooltipShared {
  x: number;
  y: number;
  points: PointObject[];
}

export interface ThisTooltipNotShared {
  x: number;
  y: number;
  total: number;
  point: PointObject;
  series: SeriesObject;
}

export type ThisTooltip = ThisTooltipNotShared | ThisTooltipShared;

export type TooltipProps = { index: number };

export class BasicChartsTooltipBehavior<T extends ThisTooltip = ThisTooltip> implements ChartBehavior {
  constructor(
    private tooltipContent: (props: {
      tooltip: TooltipProps & T;
      chartSeriesDataItems: ChartSeriesData[];
    }) => ReactElement | null,
    private tooltipOptions: TooltipOptions = {}
  ) {}

  modifyConfig(chartOptions: Options, chartSeriesDataItems: ChartSeriesData[]): void {
    const that = this;
    const options: TooltipOptions = {
      enabled: true,
      useHTML: true,
      padding: 0,
      borderWidth: 0,
      ...this.tooltipOptions,
    };
    chartOptions.tooltip = {
      ...options,
      formatter(this: T) {
        if (chartSeriesDataItems.length === 0) {
          return "No data Items";
        }
        const index = chartSeriesDataItems[0].histogram.timestamps.indexOf(this.x);
        const content = that.tooltipContent({ tooltip: { ...this, index }, chartSeriesDataItems });
        return content ? renderToString(content) : false;
      },
    };
  }
}
