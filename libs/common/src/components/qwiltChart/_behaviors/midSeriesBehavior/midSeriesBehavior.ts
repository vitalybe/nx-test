import { ElementObject } from "highcharts";
import { ChartSeriesArray } from "../../_domain/chartSeriesArray";
import { ChartBehavior } from "../../_domain/chartBehavior";
import { ChartSeries } from "../../_domain/chartSeries";
import { darken } from "polished";
import { BehaviorUtils } from "../utils/behaviorUtils";
import { ChartSeriesData } from "../../_domain/chartSeriesData";
import { ChartSvg } from "../../../../utils/chartSvg";

interface MidSeriesOptions {
  lineWidth: number;
  showPeak: boolean;
  isSeriesReversed: boolean;
  useContrastPeak: boolean;
}
export class MidSeriesBehavior implements ChartBehavior {
  seriesOptions: MidSeriesOptions;

  constructor(seriesOptions: Partial<MidSeriesOptions> = {}) {
    this.seriesOptions = {
      lineWidth: 5,
      showPeak: false,
      // to be used with AddReversedStackedSeriesBehavior from ds dashboard cp
      isSeriesReversed: false,
      // to be used with ContrastPeaksBehavior from ds dashboard cp
      useContrastPeak: false,
      ...seriesOptions,
    };
  }

  private behaviorG: ElementObject | undefined = undefined;

  drawAdditions(chartSeriesGroup: ChartSeriesArray): void {
    if (chartSeriesGroup.highchartChart) {
      const renderer = chartSeriesGroup.highchartChart.renderer;
      this.behaviorG = BehaviorUtils.getDrawingG(renderer, this.behaviorG, "midSeriesBehavior", 3);

      for (const [i, chartSerie] of chartSeriesGroup.series.entries()) {
        let baselineSerie: ChartSeries | undefined;
        const nextSerie = chartSeriesGroup.series[i + (this.seriesOptions.isSeriesReversed ? -1 : 1)];
        if (chartSerie.data.stacking === "normal" && nextSerie?.data.stacking === "normal") {
          baselineSerie = nextSerie;
        }

        for (const midSerie of chartSerie.data.midSeries) {
          this.drawMid(chartSerie, midSerie, baselineSerie, renderer, this.behaviorG, this.seriesOptions);
        }
      }
    }
  }

  private drawMid(
    chartSerie: ChartSeries,
    midSerie: ChartSeriesData,
    baselineSerie: ChartSeries | undefined,
    renderer: Highcharts.RendererObject,
    behaviorG: Highcharts.ElementObject,
    seriesOptions: MidSeriesOptions
  ) {
    const { lineWidth } = seriesOptions;
    const plotHeight = chartSerie.highchartChart.plotHeight;
    if (!plotHeight) return;

    const path = [];
    for (const midPoint of midSerie.histogram.points) {
      const chartPoint = chartSerie.getChartPoint(midPoint.index);
      if (chartPoint) {
        const ratio = chartPoint.y && midPoint.y ? midPoint.y / chartPoint.y : 0;
        const baseLineY = baselineSerie ? baselineSerie.getChartPoint(midPoint.index)?.plotY : plotHeight;
        if (baseLineY) {
          const chartPointHeight = baseLineY - chartPoint.plotY;
          const midPointY = baseLineY - chartPointHeight * ratio;

          const action = midPoint.index === 0 ? "M" : "L";

          if (this.seriesOptions.showPeak && midSerie.histogram.peakPoint.index === midPoint.index) {
            const workshop = new ChartSvg(renderer, behaviorG);
            const radius = 3;
            const point = {
              x: chartPoint.plotX,
              y: midPointY,
              color: midSerie.color || darken(0.1, chartSerie.data.color),
            };
            if (this.seriesOptions.useContrastPeak) {
              workshop.drawContrastPeaks([point], radius);
            } else {
              workshop.drawPeakPoints([point], radius);
            }
          }

          path.push([`${action} ${chartPoint.plotX} ${midPointY}`]);
        }
      }

      if (path.length > 0) {
        renderer
          .path({
            stroke: midSerie.color || darken(0.1, chartSerie.data.color), // basic
            "stroke-width": lineWidth,
            "stroke-dasharray": midSerie.dashStyle === "dash" ? lineWidth.toString() : undefined,
            d: path,
          })
          .add(behaviorG);
      }
    }
  }
}
