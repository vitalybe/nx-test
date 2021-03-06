/* eslint-disable */
import * as highcharts from "highcharts";
import * as geojson from "geojson";

declare module "highcharts" {
  interface Static {
    mapChart(renderTo: string | HTMLElement, options: MapOptions, callback?: (chart: ChartObject) => void): ChartObject;
  }

  interface MapOptions {
    chart?: ChartOptions;
    legend?: LegendOptions;
    mapNavigation?: Navigation;
    plotOptions?: PlotOptions;
    series?: MapSeriesOptions[];
    colorAxis?: ColorAxis;
    title?: TitleOptions;
    tooltip?: TooltipOptions;
  }

  interface MapSeriesOptions {
    data?: number[] | Array<[number, number]> | Array<[string, number]> | DataPoint[];

    dataLabels?: MapSeriesOptionsDataLabels;

    joinBy?: string[];

    mapData?: geojson.GeoJsonObject;

    name?: string;

    states?: MapSeriesOptionsStates;

    tooltip?: MapSeriesOptionsTooltip;

    type?: string;
  }

  interface Navigation {}

  interface MapSeriesOptionsDataLabels {}

  interface MapSeriesOptionsStates {}

  interface MapSeriesOptionsTooltip {}

  interface ColorAxis {}
}
