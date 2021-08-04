import { MetricTypesEnum } from "src/_domain/metricTypes";
import {
  HistogramTypeByEntityId,
  HistogramValue,
  HistogramValuesByDate,
} from "src/drillDown/_domain/drillDownHistogram";
import { computed } from "mobx";

export class DrillDownChartHistogram {
  constructor(private readonly drillDownHistogramOfType: HistogramTypeByEntityId) {}
  @computed
  get type(): MetricTypesEnum {
    return this.drillDownHistogramOfType.type;
  }
  @computed
  get latestValue(): HistogramValue | undefined {
    if (this.drillDownHistogramOfType.getAll().length > 0) {
      const sortedValues = this.drillDownHistogramOfType
        .getAll()[0]
        .getAll()
        .sort((a, b) => a.date - b.date);
      return sortedValues[sortedValues.length - 1];
    }
  }

  @computed
  get pointInterval() {
    const histograms = this.drillDownHistogramOfType.getAll();
    if (histograms.length > 0) {
      const points = histograms[0].getAll();
      if (points.length > 1) {
        return points[1].date - points[0].date;
      }
    }
  }

  getHistogramValue = (entityId: string, timestamp: number): HistogramValue | undefined => {
    const entity = this.drillDownHistogramOfType.getByEntityId(entityId);
    return entity && entity.getByDate(timestamp);
  };
  getHistogramEntity = (entityId: string): HistogramValuesByDate | undefined => {
    return this.drillDownHistogramOfType.getByEntityId(entityId);
  };
  getAllEntityData = () => {
    return this.drillDownHistogramOfType.getAll();
  };
}
