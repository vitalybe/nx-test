import { MarketplaceStore } from "../../_stores/marketplaceStore";
import { computed, observable } from "mobx";
import { DrillDownEntity } from "../_domain/drillDownEntity";
import { promisedComputed } from "computed-async-mobx";
import { HistogramByType } from "../_domain/drillDownHistogram";
import { MetricTypesEnum } from "../../_domain/metricTypes";
import { histogramProvider } from "../_providers/drillDownHistogramProvider/drillDownHistogramProvider";
import { mockUtils } from "@qwilt/common/utils/mockUtils";
import { MediaAnalyticsApi } from "@qwilt/common/backend/mediaAnalytics";
import { TimeConfig } from "@qwilt/common/utils/timeConfig";
import { DateTime, Duration } from "luxon";

export class DrillDownStore {
  constructor(public marketplace: MarketplaceStore) {}

  static allColors = [
    "#4363d8",
    "#e6194b",
    "#3cb44b",
    "#e1c617",
    "#f58231",
    "#911eb4",
    "#46f0f0",
    "#f032e6",
    "#bcf60c",
    "#fabebe",
    "#008080",
    "#e6beff",
    "#9a6324",
    "#fffac8",
    "#800000",
    "#aaffc3",
    "#808000",
    "#ffd8b1",
    "#000075",
    "#808080",
  ];

  private getColor(index: number) {
    return DrillDownStore.allColors[index % DrillDownStore.allColors.length];
  }

  public static get lastMonthTimeConfig(): TimeConfig {
    return TimeConfig.fromDuration(Duration.fromObject({ month: 1 }), DateTime.local().minus({ minutes: 15 }));
  }

  public static get lastDayTimeConfig(): TimeConfig {
    return TimeConfig.fromDuration(Duration.fromObject({ day: 1 }), DateTime.local().minus({ minutes: 15 }));
  }

  @observable private _dataTimeSpan: "day" | "month" = "month";

  @computed get dataTimeSpan() {
    return this._dataTimeSpan;
  }

  set dataTimeSpan(value: "day" | "month") {
    this._dataTimeSpan = value;
  }

  @computed
  private get missingEntityIds(): string[] {
    const ids = this.drillDownEntities.map(entity => entity.marketplaceEntity.id);
    // NOTE (Amir): Implement missing addition of missingIds to current data
    //return this.drillDownHistogram ? this.drillDownHistogram.verifyMissingEntityIds(ids) : ids
    return ids;
  }
  @computed
  get drillDownEntities(): DrillDownEntity[] {
    return this.marketplace.selectedEntities.map((selectedEntity, i) => {
      return new DrillDownEntity(selectedEntity, this.getColor(i));
    });
  }

  @computed get timeConfig() {
    return this.dataTimeSpan === "month" ? DrillDownStore.lastMonthTimeConfig : DrillDownStore.lastDayTimeConfig;
  }

  private drillDownHistogramAsyncObservable = promisedComputed(undefined, async () => {
    // NOTE (Amir): Fetch histogramProvider information only for new selections for which we didn't fetch data before.
    // Use the same time, when fetching, as was used for previously fetched series:
    if (this.missingEntityIds.length > 0) {
      try {
        return histogramProvider.provide(MediaAnalyticsApi.instance, this.missingEntityIds, this.timeConfig);
      } catch (e) {
        console.error(e);
      }
    }
  });

  @computed
  get drillDownHistogram(): HistogramByType | undefined {
    if (this.drillDownHistogramAsyncObservable.busy) {
      return undefined;
    }

    const rawData = this.drillDownHistogramAsyncObservable.get();
    return rawData || undefined;
  }

  @observable
  private _metricType: MetricTypesEnum = MetricTypesEnum.AVAILABLE_BW;

  @computed
  get metricType() {
    return this._metricType;
  }

  set metricType(type: MetricTypesEnum) {
    this._metricType = type;
  }

  static createMock(overrides?: Partial<DrillDownStore>) {
    const drillDownEntity = DrillDownEntity.createMock();
    return mockUtils.createMockObject<DrillDownStore>({
      marketplace: MarketplaceStore.createMock(),
      drillDownEntities: [drillDownEntity],
      drillDownHistogram: HistogramByType.createMockData([drillDownEntity.marketplaceEntity.id]),
      metricType: MetricTypesEnum.AVAILABLE_BW,
      dataTimeSpan: "month",
      timeConfig: TimeConfig.fromDuration(Duration.fromObject({ month: 1 }), DateTime.local().minus({ minutes: 15 })),
      ...overrides,
    });
  }
}
