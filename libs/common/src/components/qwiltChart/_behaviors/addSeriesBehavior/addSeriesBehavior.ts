import { AreaChartSeriesOptions, DataPoint, Options } from "highcharts";
import { ChartBehavior } from "../../_domain/chartBehavior";
import { ChartSeriesData } from "../../_domain/chartSeriesData";

export class AddSeriesBehavior implements ChartBehavior {
  modifyConfig(chartOptions: Options, chartSeriesData: ChartSeriesData[]): void {
    chartOptions.series = [
      ...(chartOptions.series || []),
      ...chartSeriesData.map(chartSerieData => {
        const seriesOptions: AreaChartSeriesOptions = {
          name: chartSerieData.name,
          id: chartSerieData.id,
          color: chartSerieData.color,
          fillColor: chartSerieData.fillColor,
          lineColor: chartSerieData.lineColor,
          dashStyle: chartSerieData.dashStyle,
          lineWidth: chartSerieData.lineWidth,
          //https://stackoverflow.com/questions/12463506/highcharts-doesnt-display-series-with-lots-of-data-points
          data:
            chartSerieData.histogram.points.length >= 1000
              ? chartSerieData.histogram.points.map(point => [point.x, point.y as number])
              : (chartSerieData.histogram.points as DataPoint[]),
          type: chartSerieData.type,
          stacking: chartSerieData.stacking,
          visible: chartSerieData.visible,
          ...chartSerieData.userOptions,
        };

        return seriesOptions;
      }),
    ];
  }
}
