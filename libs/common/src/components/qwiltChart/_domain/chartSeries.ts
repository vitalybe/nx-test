import { HistogramPoint } from "common/utils/histograms/domain/histogramPoint";
import { ChartObject, PlotPoint, PointObject, SeriesObject } from "highcharts";
import { HistogramPointType, HistogramPointsSeries } from "common/utils/histograms/utils/histogramUtils";
import { ChartSeriesData } from "common/components/qwiltChart/_domain/chartSeriesData";
import { ChartPoint } from "common/components/qwiltChart/_domain/chartPoint";
import { HistogramSeries } from "common/utils/histograms/domain/histogramSeries";

interface ChartSeriesObject extends SeriesObject {
  // this is missing from highcharts types so added manually
  userOptions?: Partial<ChartSeriesData>;
}
export class ChartSeries implements HistogramPointsSeries {
  private readonly highchartSerie: ChartSeriesObject;

  constructor(public readonly data: ChartSeriesData, public readonly highchartChart: ChartObject) {
    const highchartSerie = (highchartChart.series as ChartSeriesObject[]).find(serie => {
      if (serie.userOptions?.id) {
        return serie.userOptions?.id === this.data.id;
      }
      return serie.name === this.data.name;
    });
    if (!highchartSerie) {
      throw new Error("failed to find highchart series - " + this.data.name);
    }

    this.highchartSerie = highchartSerie;
  }

  get name(): string {
    return this.data.name;
  }

  get peakValue(): HistogramPoint {
    return this.data.histogram.peakPoint;
  }

  get peakColor(): string {
    return this.data.peakColor;
  }

  get color(): string {
    return this.data.color;
  }

  get points(): HistogramPointType[] {
    return this.data.histogram.points;
  }

  get histogram(): HistogramSeries {
    return this.data.histogram;
  }

  get visible(): boolean {
    return this.highchartSerie.visible;
  }

  getChartPoint(index: number): ChartPoint | undefined {
    const point = this.data.histogram.points?.[index];
    if (point) {
      const highchartPoints = ((this.highchartSerie.data as PointObject[]) as unknown) as PlotPoint[];
      const plotPoint = highchartPoints?.[index];
      if (plotPoint) {
        const plotX = plotPoint.plotX + (this.highchartChart.plotLeft || 0);
        const plotY = plotPoint.plotY + (this.highchartChart.plotTop || 0);

        return { x: point.x, y: point.y, index: index, plotX: plotX, plotY: plotY };
      }
    }
  }
}
