import { MarketplaceMetrics } from "src/_domain/marketplaceMetrics";
import { computed, observable } from "mobx";
import { promisedComputed, PromisedComputedValue } from "computed-async-mobx";
import { TopBarSearchModel } from "src/topBar/topBarSearch/topBarSearchModel";
import { mockUtils } from "common/utils/mockUtils";
import { MarketplaceStore } from "src/_stores/marketplaceStore";
import { StoreStatus } from "common/stores/_models/storeStatus";
import { marketplaceMetricsProvider } from "src/_providers/marketplaceMetricsProvider";
import { TimeConfig } from "common/utils/timeConfig";
import { Duration } from "luxon";
import { Notifier } from "common/utils/notifications/notifier";

export class TopBarModel {
  constructor(private marketplace: MarketplaceStore) {}

  @observable
  status: StoreStatus = new StoreStatus();

  @computed
  get errorMessage(): string {
    const marketplaceError = this.marketplace.status.error;
    if (this.didUserSelectEntities) {
      return this.status.hasError ? this.status.error!.message : "";
    }
    return this.marketplace.status.hasError ? marketplaceError!.message : "";
  }
  @computed
  get didUserSelectEntities(): boolean {
    return this.marketplace.selectedEntities.length > 0;
  }

  @computed
  get selectionCountText(): string {
    const text = this.enabledCount === 1 ? "selection" : "selections";
    return `${this.enabledCount} ${text}`;
  }
  @computed
  get enabledCount(): number {
    return this.marketplace.selectedEntities.filter(item => item.isEnabled).length;
  }
  private selectedMetricsAsyncObservable = promisedComputed(undefined, async () => {
    if (!this.didUserSelectEntities) {
      return undefined;
    }
    const entityIds = this.marketplace.selectedEntities
      .filter(entity => entity.isEnabled)
      .map(entity => entity.marketplaceEntity.id);
    try {
      return marketplaceMetricsProvider.provide(entityIds, MarketplaceStore.lastHourTimeConfig);
    } catch (e) {
      this.status.setError("Failed to load metrics for selection");
      Notifier.error("Failed to load metrics for selection", e);
    }
  });
  @computed
  get timeConfig(): TimeConfig {
    return MarketplaceStore.lastHourTimeConfig;
  }

  @computed
  get selectedMetricsAsync(): PromisedComputedValue<MarketplaceMetrics | undefined> {
    return this.selectedMetricsAsyncObservable;
  }

  @computed
  get overallMetrics(): MarketplaceMetrics | undefined {
    return this.marketplace.overallMetrics;
  }
  @computed
  get topBarSearchModel(): TopBarSearchModel {
    return new TopBarSearchModel(this.marketplace);
  }

  static createMock(overrides?: Partial<TopBarModel>) {
    return mockUtils.createMockObject<TopBarModel>({
      overallMetrics: MarketplaceMetrics.createMock(),
      status: StoreStatus.createMock(),
      didUserSelectEntities: false,
      selectionCountText: "",
      enabledCount: 0,
      timeConfig: TimeConfig.fromDuration(Duration.fromObject({ hours: 1 })),
      selectedMetricsAsync: {
        get: () => undefined,
        busy: true,
        refresh: () => {},
      },
      topBarSearchModel: TopBarSearchModel.createMock(),
      errorMessage: "",
      ...overrides,
    });
  }
}
