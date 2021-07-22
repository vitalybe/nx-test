import { Options } from "highcharts";
import { ChartSeriesData } from "common/components/qwiltChart/_domain/chartSeriesData";
import { ChartSeriesArray } from "common/components/qwiltChart/_domain/chartSeriesArray";

export interface ChartBehavior {
  addSeriesData?(chartSeriesData: ChartSeriesData[]): ChartSeriesData[];

  modifyConfig?(chartOptions: Options, chartSeriesData: ChartSeriesData[]): void;

  // Draw addition is called initially whenever there is a major change in the chart (e.g. resize)
  drawAdditions?(chartSeriesGroup: ChartSeriesArray): void;

  // If implemented - Should save the index and call draw additions
  onChartHoverIndexChanged?(index: number | undefined, chartSeriesGroup: ChartSeriesArray): void;
  subscribeHoverIndexChange?(callback: (newIndex: number) => void): void;
}
