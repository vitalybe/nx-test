import { ElementObject } from "highcharts";
import { ChartSvg } from "common/utils/chartSvg";
import { ChartSeriesArray } from "common/components/qwiltChart/_domain/chartSeriesArray";
import { ChartBehavior } from "common/components/qwiltChart/_domain/chartBehavior";
import { ChartSeries } from "common/components/qwiltChart/_domain/chartSeries";

export class SeriesPeaksBehavior implements ChartBehavior {
  constructor(
    private options?: {
      filterCallback?: (series: ChartSeries) => boolean;
      pointRadius?: number;
      borderColor?: string;
    }
  ) {}

  private elementG: ElementObject | undefined = undefined;

  drawAdditions(chartSeriesGroup: ChartSeriesArray): void {
    if (chartSeriesGroup.highchartChart) {
      if (this.elementG) {
        this.elementG.destroy();
        this.elementG = undefined;
      }

      const peakPoints = [];

      for (const serie of chartSeriesGroup.series) {
        const isFilterPass = !this.options?.filterCallback || this.options.filterCallback(serie);
        if (serie.visible && isFilterPass) {
          const chartPoint = serie.getChartPoint(serie.peakValue.index);
          if (chartPoint) {
            peakPoints.push({ x: chartPoint.plotX, y: chartPoint.plotY, color: serie.peakColor });
          }
        }
      }

      const renderer = chartSeriesGroup.highchartChart.renderer;
      this.elementG = renderer
        .g("peak-points")
        .attr({ zIndex: 5 })
        .add();
      const workshop = new ChartSvg(renderer, this.elementG);
      workshop.drawPeakPoints(peakPoints, this.options?.pointRadius, this.options?.borderColor);
    }
  }
}
