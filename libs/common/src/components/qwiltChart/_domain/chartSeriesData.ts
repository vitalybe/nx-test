import { mockUtils } from "common/utils/mockUtils";
import { HistogramSeries } from "common/utils/histograms/domain/histogramSeries";
import { MediaAnalyticsSeries } from "common/backend/mediaAnalytics/mediaAnalyticsSeries";
import { TimeConfig } from "common/utils/timeConfig";
import { UnitKindEnum } from "common/utils/unitsFormatter";
import { IndividualSeriesOptions } from "highcharts";

type ConstructorType<T> = { name: string; histogram: HistogramSeries } & Partial<ChartSeriesData<T>>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class ChartSeriesData<UserOptions extends { [k: string]: any } = { [k: string]: any }> {
  name: string;
  id?: string;
  histogram: HistogramSeries;

  type: "line" | "area" | "column" | undefined;
  // NOTE: Can add options here: https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/plotoptions/series-dashstyle-all/
  dashStyle: "solid" | "dash" = "solid";
  lineWidth = 1;
  stacking: "normal" | "percent" | null = null;
  midSeries: ChartSeriesData[] = [];
  visible = true;
  unitType?: UnitKindEnum;

  color: string = "black";
  // NOTE: These colors by default get the value of the "color" property
  lineColor!: string;
  peakColor!: string;
  fillColor!: string;
  userOptions?: UserOptions & IndividualSeriesOptions;

  constructor(data: ConstructorType<UserOptions>) {
    Object.assign(this, data);

    this.name = data.name;
    this.histogram = data.histogram;
    this.unitType = data.unitType;

    if (data.color) {
      this.color = data.color;
    }

    if (!this.lineColor) {
      this.lineColor = this.color;
    }

    if (!this.peakColor) {
      this.peakColor = this.color;
    }

    if (!this.fillColor) {
      this.fillColor = this.color;
    }
  }

  // Mock
  static createMock(
    overrides?: Partial<ConstructorType<IndividualSeriesOptions>>,
    id: number = mockUtils.sequentialId()
  ) {
    const name = id.toString();
    return new ChartSeriesData({
      name: name,
      histogram: HistogramSeries.createMock(name),
      color: "black",
      ...overrides,
    });
  }

  static createArrayMock(
    analyticsSeries: MediaAnalyticsSeries[],
    timeConfig: TimeConfig,
    overrides?: Partial<ConstructorType<IndividualSeriesOptions>>
  ) {
    return analyticsSeries.map(series => {
      const id = mockUtils.sequentialId();
      const colorId = id;
      const colors = ["hsl(197,83%,46%)", "hsl(197,83%,56%)", "hsl(197,83%,36%)"];
      return new ChartSeriesData({
        color: colors[colorId % colors.length],
        name: series.name,
        histogram: HistogramSeries.createMock(series.name, timeConfig),
        ...overrides,
      });
    });
  }
}
