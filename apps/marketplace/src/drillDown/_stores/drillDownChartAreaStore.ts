import { action, computed, observable } from "mobx";
import { HistogramTypeByEntityId } from "src/drillDown/_domain/drillDownHistogram";
import { DrillDownChartHistogram } from "src/drillDown/_domain/drillDownChartHistogram";
import { DrillDownStore } from "src/drillDown/_stores/drillDownStore";

export class DrillDownChartAreaStore {
  constructor(public marketplaceDrillDown: DrillDownStore) {}

  @computed
  get hasDateValue(): boolean {
    return this.dateValue !== 0;
  }
  @computed
  get currentHistogram(): DrillDownChartHistogram | undefined {
    return (
      this.allHistograms &&
      this.allHistograms.find(histogram => histogram.type === this.marketplaceDrillDown.metricType)
    );
  }
  @computed
  get allHistograms(): DrillDownChartHistogram[] | undefined {
    const drillDownHistogram = this.marketplaceDrillDown.drillDownHistogram;
    if (drillDownHistogram !== undefined) {
      return drillDownHistogram.getAll().map((histogramOfType: HistogramTypeByEntityId) => {
        return new DrillDownChartHistogram(histogramOfType);
      });
    }
    return undefined;
  }
  @observable
  highlightedSeriesId: string | undefined;

  @action
  highlightSeries = (seriesId: string | undefined) => {
    this.highlightedSeriesId = seriesId;
  };

  @observable
  _dateValue: number = 0;

  @computed
  get dateValue() {
    return this._dateValue;
  }

  set dateValue(value: number) {
    this._dateValue = value;
  }

  static createMock(): DrillDownChartAreaStore {
    return new DrillDownChartAreaStore(DrillDownStore.createMock());
  }
}
