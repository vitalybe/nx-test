import { MetricTypesEnum } from "../../_domain/metricTypes";
import { computed } from "mobx";
import * as _ from "lodash";
import { DateTime } from "luxon";

const murmur = require("murmurhash-js");

export class HistogramValue {
  constructor(public date: number, public value: number) {}
}

export class HistogramValuesByDate {
  constructor(public entityId: string, private histogramValueByDate: Map<number, HistogramValue>) {}

  getByDate(date: number): HistogramValue | undefined {
    return this.histogramValueByDate.get(date);
  }
  getAll() {
    return Array.from(this.histogramValueByDate.values());
  }
  @computed
  get peakValue(): HistogramValue | undefined {
    return _.maxBy(this.getAll(), value => value.value);
  }
  @computed
  get average(): number {
    return _.meanBy(this.getAll(), value => value.value);
  }
}

export class HistogramTypeByEntityId {
  constructor(public type: MetricTypesEnum, private histogramByEntityId: Map<string, HistogramValuesByDate>) {}

  getByEntityId(id: string): HistogramValuesByDate | undefined {
    return this.histogramByEntityId.get(id);
  }

  getAll() {
    return Array.from(this.histogramByEntityId.values());
  }
}

export class HistogramByType {
  constructor(private readonly histogramsByType: Map<MetricTypesEnum, HistogramTypeByEntityId>) {}

  getHistogramsByType(type: MetricTypesEnum): HistogramTypeByEntityId {
    return this.histogramsByType.get(type)!;
  }

  getAll() {
    return Array.from(this.histogramsByType.values());
  }

  verifyMissingEntityIds = (ids: string[]): string[] => {
    if (this.getAll().length === 0) {
      return ids;
    }
    return ids.filter(id => !this.getAll()[0].getByEntityId(id));
  };

  static createMockData(entityIds: string[]): HistogramByType {
    const lastHour = DateTime.local()
      .minus({ hour: 1 })
      .startOf("hour");
    const fromDate = lastHour.minus({ month: 1 }).valueOf();
    const toDate = lastHour.valueOf();
    const hour = 3_600_000;

    const histogramsByType = new Map<MetricTypesEnum, HistogramTypeByEntityId>();
    Object.values(MetricTypesEnum).forEach(metricType => {
      const histogramByEntityId = new Map<string, HistogramValuesByDate>();
      entityIds.forEach(entityId => {
        const histogramValueByDate = new Map<number, HistogramValue>();
        const randomSeed = metricType + "_" + entityId;
        const moveHash = murmur(randomSeed + "_move") % 1000;
        const heightHash = (murmur(randomSeed + "height") % 3) + 1;

        for (let timestamp = fromDate; timestamp <= toDate; timestamp += hour) {
          const value = Math.cos(timestamp / 250000000 + moveHash) * 100000 * heightHash + 1000000;
          histogramValueByDate.set(timestamp, new HistogramValue(timestamp, value));
        }
        histogramByEntityId.set(entityId, new HistogramValuesByDate(entityId, histogramValueByDate));
      });
      histogramsByType.set(
        metricType as MetricTypesEnum,
        new HistogramTypeByEntityId(metricType as MetricTypesEnum, histogramByEntityId)
      );
    });

    return new HistogramByType(histogramsByType);
  }
}
