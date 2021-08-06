import { ElementObject } from "highcharts";
import { ChartBehavior } from "../../_domain/chartBehavior";
import { ChartSeriesArray } from "../../_domain/chartSeriesArray";
import { CSSProperties } from "react";

export class LabeledSeriesBehavior implements ChartBehavior {
  constructor(
    private affectedSeries: string[],
    // its more convenient to set x position by percents (points count is unknown)
    // and y position by pixels (distance of label from line)
    private xPositionPercent: number = 5,
    private yPositionPx: number = -5,
    private additionalCss: CSSProperties = {}
  ) {}

  private elementG: ElementObject | undefined = undefined;

  drawAdditions(chartSeriesGroup: ChartSeriesArray): void {
    if (chartSeriesGroup.highchartChart) {
      if (this.elementG) {
        this.elementG.destroy();
        this.elementG = undefined;
      }

      chartSeriesGroup.series
        .filter(s => this.affectedSeries.includes(s.name))
        .forEach(series => {
          const point = series.getChartPoint(Math.floor((series.points.length * this.xPositionPercent) / 100));
          const x = point?.plotX;
          // This is needed to prevent the label from going over a maximum that suddenly rises
          const plotY = point?.plotY;
          if (x !== undefined && plotY !== undefined) {
            const y = plotY + this.yPositionPx;
            const renderer = chartSeriesGroup.highchartChart!.renderer;
            this.elementG = renderer
              .text(series.name, x, y)
              .attr({ zIndex: 3 })
              .css({
                color: series.color,
                textShadow: "-1px -1px 0 white, 1px -1px 0 white, -1px 1px 0 white, 1px 1px 0 white",
                ...this.additionalCss,
              })
              .add();
          }
        });
    }
  }
}
