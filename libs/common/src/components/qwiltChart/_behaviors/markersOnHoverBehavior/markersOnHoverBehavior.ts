import Highcharts, { ChartObject, ElementObject, PointObject, SeriesObject } from "highcharts";
import { lighten } from "polished";
import { ChartSeries } from "../../_domain/chartSeries";
import { ChartBehavior } from "../../_domain/chartBehavior";
import { ChartSeriesArray } from "../../_domain/chartSeriesArray";

export interface MarkersOnHoverOptions {
  bubbles?: boolean;
  verticalLine?: { color: string };
  highlightRect?: { color: string; width?: number };
  triangle?: { color: string };
  filterCallback?: (series: ChartSeries) => boolean;
  borderColor?: string;
  onHoveredIndexChange?: (index: number | undefined) => void;
}

export class MarkersOnHoverBehavior implements ChartBehavior {
  constructor(private options: MarkersOnHoverOptions) {}

  private canvas: ElementObject | undefined = undefined;
  private backgroundCanvas: ElementObject | undefined = undefined;
  private index: number | undefined = undefined;

  private showHighlightRectAtPoint(
    chart: ChartObject,
    canvas: Highcharts.ElementObject,
    chartPoint: Highcharts.PointObject & { pointWidth?: number },
    options: { color: string; width?: number }
  ) {
    const size = chartPoint.pointWidth ? chartPoint.pointWidth * 1.3 : options.width ?? 20;
    const x = (chart.plotLeft || 0) + chartPoint.plotX - size / 2;
    const plotHeight = chart.plotHeight ?? chart.plotSizeY ?? chart.renderer.plotBox?.height ?? 0;
    chart.renderer
      .rect(x, 0, size, plotHeight, 4)
      .attr({ fill: options.color })
      .css({ zIndex: -1 })
      .add(canvas);
  }
  private showBubblesAtIndex(
    chart: ChartObject,
    chartSeries: ChartSeries[],
    index: number,
    canvas: Highcharts.ElementObject
  ) {
    chartSeries.forEach(series => {
      const isFilterPass = !this.options?.filterCallback || this.options.filterCallback(series);
      if (series.visible && isFilterPass) {
        const point = series.getChartPoint(index);
        if (point) {
          chart.renderer
            .circle(point.plotX, point.plotY, 5)
            .attr({
              fill: series.data.color,
              stroke: this.options.borderColor ?? lighten(0.2, series.data.color),
              "stroke-width": 1,
            })
            .add(canvas);
        }
      }
    });
  }

  private showLineAtIndex(chart: ChartObject, canvas: ElementObject, chartPoint: PointObject, color: string) {
    const x = (chart.plotLeft || 0) + chartPoint.plotX - 1;
    const y = chart.plotTop || 0;
    const width = 1;
    const height = chart.plotSizeY || 0;

    chart.renderer
      .rect(x, y, width, height, 0)
      .attr({ fill: color })
      .add(canvas);
  }

  private showTriangleAtTop(
    chart: ChartObject,
    canvas: Highcharts.ElementObject,
    chartPoint: Highcharts.PointObject,
    color: string
  ) {
    const size = 30;
    const x = (chart.plotLeft || 0) + chartPoint.plotX - size / 2;

    chart.renderer
      .path(["M", x + ",0", "L", x + size + ",0", "L", x + size / 2 + "," + size / 2, "Z"])
      .attr({ fill: color })
      .add(canvas);
  }

  private showHoverAtIndex(chartSeriesArray: ChartSeriesArray, index?: number) {
    const chart = chartSeriesArray.highchartChart;
    if (chart && chart.renderer) {
      if (this.canvas) {
        this.canvas.destroy();
        this.canvas = undefined;
      }
      if (this.backgroundCanvas) {
        this.backgroundCanvas.destroy();
        this.canvas = undefined;
      }

      this.canvas = chart.renderer
        .g()
        .attr({ zIndex: 3 })
        .add();

      this.backgroundCanvas = chart.renderer
        .g()
        .attr({ zIndex: 1 })
        .add();

      if (chart && chart.series && chart.series.length > 0 && index !== undefined) {
        const series = chart.series as SeriesObject[];

        const chartPoint = series[0].data[index];
        if (chartPoint) {
          if (this.options.verticalLine) {
            this.showLineAtIndex(chart, this.canvas, chartPoint, this.options.verticalLine.color);
          }

          if (this.options.highlightRect) {
            // this marker type should not cover/override series on chart
            this.showHighlightRectAtPoint(chart, this.backgroundCanvas, chartPoint, this.options.highlightRect);
          }

          if (this.options.triangle) {
            this.showTriangleAtTop(chart, this.canvas, chartPoint, this.options.triangle.color);
          }

          if (this.options.bubbles) {
            this.showBubblesAtIndex(chart, chartSeriesArray.series, index, this.canvas);
          }
        }
      }
    }
  }

  drawAdditions(chartSeriesArray: ChartSeriesArray): void {
    this.showHoverAtIndex(chartSeriesArray, this.index);
  }

  onChartHoverIndexChanged(index: number | undefined, chartSeriesArray: ChartSeriesArray): void {
    this.index = index;
    this.drawAdditions(chartSeriesArray);
    if (this.options.onHoveredIndexChange) {
      this.options.onHoveredIndexChange(index);
    }
  }
}
