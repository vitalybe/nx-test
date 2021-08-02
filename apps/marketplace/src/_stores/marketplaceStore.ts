import { action, computed, observable, runInAction } from "mobx";
import { MarketplaceEntities } from "../_domain/marketplaceEntity/marketplaceEntities";
import { promisedComputed } from "computed-async-mobx";
import { MarketplaceMetrics } from "../_domain/marketplaceMetrics";
import { MarketplaceEntitySelected } from "../_domain/marketplaceEntity/marketplaceEntitySelected";
import { mockUtils } from "@qwilt/common/utils/mockUtils";
import { CardMoreDetailsModel } from "../card/cardMoreDetails/cardMoreDetailsModel";
import { MarketplaceEntityGeo } from "../_domain/marketplaceEntity/marketplaceEntityGeo";
import { marketplaceEntitiesProvider } from "../_providers/marketplaceEntityProvider/marketplaceEntitiesProvider";
import { MarketplaceEntityIsp } from "../_domain/marketplaceEntity/marketplaceEntityIsp";
import { StoreStatus } from "@qwilt/common/stores/_models/storeStatus";
import { geoDeploymentApi } from "@qwilt/common/backend/geoDeployment/geoDeploymentApi";
import { marketplaceMetricsProvider } from "../_providers/marketplaceMetricsProvider";
import { MarketplaceQnEntity } from "../_domain/marketplaceEntity/marketplaceQnEntity";
import { UrlParameterTypeEnum } from "@qwilt/common/stores/urlParameterTypeEnum";
import { UrlStore } from "@qwilt/common/stores/urlStore/urlStore";
import { TimeConfig } from "@qwilt/common/utils/timeConfig";
import { DateTime, Duration } from "luxon";
import { MediaAnalyticsApi } from "@qwilt/common/backend/mediaAnalytics";
import { Notifier } from "@qwilt/common/utils/notifications/notifier";

const futureLocations = require("../map/futureLocations.json") as { latitude: number; longitude: number }[];

export class MarketplaceStore {
  constructor(private urlStore: UrlStore) {}

  private static getLastHourTimeConfig(): TimeConfig {
    return TimeConfig.fromDuration(Duration.fromObject({ hours: 1 }), DateTime.local().minus({ minutes: 15 }));
  }

  static lastHourTimeConfig = MarketplaceStore.getLastHourTimeConfig();

  @observable
  status: StoreStatus = new StoreStatus();

  @computed
  get lastMonthQoeTimeConfig(): TimeConfig {
    return TimeConfig.fromDuration(Duration.fromObject({ months: 1 }));
  }

  @computed
  get isLoading(): boolean {
    return this.overallMetricsAsyncObservable.busy || this.marketplaceEntitiesAsyncObservable.busy;
  }

  // marketplaceEntities
  /////////////////////////

  private marketplaceEntitiesAsyncObservable = promisedComputed(undefined, async () => {
    this.status.clearError();
    try {
      return marketplaceEntitiesProvider.provide(MediaAnalyticsApi.instance, geoDeploymentApi);
    } catch (e) {
      this.status.setError("Failed to load locations data");
      Notifier.error("Failed to load locations data", e);
    }
  });

  @computed
  get marketplaceEntities(): MarketplaceEntities {
    const marketplaceEntities = this.marketplaceEntitiesAsyncObservable.get();
    if (marketplaceEntities) {
      return marketplaceEntities;
    } else {
      return new MarketplaceEntities([]);
    }
  }
  @computed
  get coveredMarketplaceEntities(): Array<MarketplaceEntityGeo | MarketplaceEntityIsp> {
    return this.marketplaceEntities.entities.filter(entity => entity.coverage > 0) as Array<
      MarketplaceEntityGeo | MarketplaceEntityIsp
    >;
  }

  // future deployment
  /////////////////////

  get futureDeployments(): MarketplaceQnEntity[] {
    return futureLocations.map(
      location =>
        new MarketplaceQnEntity({
          location: { lat: location.latitude, lng: location.longitude },
          isFutureDeployment: true,
        })
    );
  }

  // overallMetrics
  //////////////////
  // NOTE: Used only by TopBar but we use this data to set "isLoading" - Marketplace only loads with overall data

  private overallMetricsAsyncObservable = promisedComputed(undefined, async () => {
    if (this.coveredMarketplaceEntities.length === 0) {
      this.status.setError("No coverage was reported");
    }
    const worldWideEntity = this.coveredMarketplaceEntities.find(entity => !entity.geoParent);
    if (worldWideEntity) {
      this.status.clearError();
      try {
        return marketplaceMetricsProvider.provide([worldWideEntity.id], MarketplaceStore.lastHourTimeConfig);
      } catch (e) {
        this.status.setError("Failed to load world wide data");
        Notifier.error("Failed to load world wide data", e);
      }
    }
  });

  @computed
  get overallMetrics(): MarketplaceMetrics | undefined {
    const overallMetrics = this.overallMetricsAsyncObservable.get();
    if (overallMetrics) {
      return overallMetrics;
    }
  }

  // selectedCards
  ///////////////////

  @computed
  private get selectedEntitiesIds(): string[] {
    const idsSet = this.urlStore.getArrayParam(UrlParameterTypeEnum.marketplaceSelectedEntitiesIds);
    return Array.from(idsSet);
  }

  private set selectedEntitiesIds(value: string[]) {
    this.urlStore.setArrayParam(UrlParameterTypeEnum.marketplaceSelectedEntitiesIds, new Set(value));
  }

  @computed
  private get enabledEntitiesIds() {
    const idsSet = this.urlStore.getArrayParam(UrlParameterTypeEnum.marketplaceEnabledEntitiesIds);
    return Array.from(idsSet);
  }

  private set enabledEntitiesIds(value: string[]) {
    this.urlStore.setArrayParam(UrlParameterTypeEnum.marketplaceEnabledEntitiesIds, new Set(value));
  }

  @computed
  get selectedEntities(): MarketplaceEntitySelected[] {
    const enabledEntityIds = this.enabledEntitiesIds;
    return this.manuallySelectedEntities
      .map(entity => {
        const isEnabled = enabledEntityIds.some(enabledEntityId => enabledEntityId === entity.id);
        return new MarketplaceEntitySelected(entity, isEnabled);
      })
      .slice()
      .reverse();
  }

  @computed
  private get manuallySelectedEntities(): Array<MarketplaceEntityGeo | MarketplaceEntityIsp> {
    const selectedEntityIds = Array.from(this.selectedEntitiesIds);
    return selectedEntityIds
      .map(id => this.coveredMarketplaceEntities.find(entity => entity.id === id))
      .filter(entity => !!entity) as Array<MarketplaceEntityGeo | MarketplaceEntityIsp>;
  }

  @action
  addSelectedEntitiesIds(id: string, index = -1) {
    const selectedEntity = this.findEntityById(id);
    if (selectedEntity) {
      const selectedIds = this.selectedEntitiesIds;

      if (index != -1) {
        selectedIds.splice(Math.abs(index - selectedIds.length), 0, id);
      } else {
        selectedIds.push(id);
      }

      this.selectedEntitiesIds = selectedIds;

      this.selectedEntitySetEnabled(id, true);
    }
  }

  @action
  removeSelectedEntitiesIds(id: string) {
    let selectedIds = this.selectedEntitiesIds;

    selectedIds = selectedIds.filter(item => item !== id);

    this.selectedEntitiesIds = selectedIds;
    this.selectedEntitySetEnabled(id, false);
    // Close drilldown if all selections are removed
    if (this.isDrillDown && this.selectedEntities.length < 1) {
      this.isDrillDown = false;
    }
  }

  selectedEntitySetEnabled(id: string, isEnabled: boolean) {
    if (!isEnabled && this.enabledEntitiesIds.length <= 1 && this.selectedEntities.length > 0) {
      return;
    }

    const selectedEntity = this.findEntityById(id);
    if (selectedEntity) {
      let enabledIds = this.enabledEntitiesIds;
      if (isEnabled) {
        enabledIds.push(id);
      } else {
        enabledIds = enabledIds.filter(enabledId => enabledId !== id);
      }

      this.enabledEntitiesIds = enabledIds;
    }
  }

  @action
  clearSelectedEntities() {
    this.selectedEntitiesIds = [];
    this.enabledEntitiesIds = [];
  }

  // activeHoverCardId
  ///////////////////////////
  // NOTE: activeHoverCardId has to reside in marketplace because it is used beyond MapMarker - Map is also using information
  // to layer the markers above/below each other.

  private hideHoverCardTimeoutId: number | undefined;

  private cancelHideHoverCard() {
    if (this.hideHoverCardTimeoutId) {
      clearTimeout(this.hideHoverCardTimeoutId);
      this.hideHoverCardTimeoutId = undefined;
    }
  }

  @action
  actionShowHoverCard(id: string) {
    this.cancelHideHoverCard();

    if (!this.activeClickedCardId) {
      this.activeHoverCardId = id;
    }
  }

  @action
  actionHideHoverCard() {
    this.cancelHideHoverCard();

    this.hideHoverCardTimeoutId = setTimeout(
      () =>
        runInAction(() => {
          this.activeHoverCardId = undefined;
        }),
      500
    );
  }

  @observable
  private _activeHoverCardId?: string;

  @computed
  get activeHoverCardId() {
    return this._activeHoverCardId;
  }

  set activeHoverCardId(id: string | undefined) {
    this._activeHoverCardId = id;
  }

  // activeClickedCardId
  ///////////////////////////

  @observable
  private _activeClickedCardId?: string;

  @computed
  get activeClickedCardId() {
    return this._activeClickedCardId;
  }

  set activeClickedCardId(id: string | undefined) {
    this._activeClickedCardId = id;
  }

  // activeMoreDetailsCardId
  ///////////////////////////

  @computed
  get moreDetailsCardId(): string | undefined {
    return this.urlStore.getParam(UrlParameterTypeEnum.marketplaceMoreDetailsId);
  }

  set moreDetailsCardId(id: string | undefined) {
    this.urlStore.setParam(UrlParameterTypeEnum.marketplaceMoreDetailsId, id);
  }

  @computed
  get activeMoreDetailsCard(): CardMoreDetailsModel | undefined {
    let activeCardMoreDetails: CardMoreDetailsModel | undefined;

    const id = this.moreDetailsCardId;
    if (id) {
      // can happen if id comes from a URL and points to entity that no longer exists
      const foundEntity = this.marketplaceEntities.entities.find(entity => entity.id === id);
      if (foundEntity) {
        activeCardMoreDetails = new CardMoreDetailsModel(foundEntity, this);
      }
    }

    return activeCardMoreDetails;
  }

  // Drilldown mode
  ///////////////////

  @computed
  get isDrillDown() {
    return this.urlStore.getParam(UrlParameterTypeEnum.marketplaceIsDrillDownOpen) === "true";
  }

  set isDrillDown(value: boolean) {
    this.urlStore.setParam(UrlParameterTypeEnum.marketplaceIsDrillDownOpen, value.toString());
  }

  // Helpers

  private findEntityById(id: string) {
    const foundEntity = this.marketplaceEntities.entities.find(entity => entity.id === id);
    if (!foundEntity) {
      throw new Error(`Entity not found by ID: ${id}`);
    }
    return foundEntity;
  }

  ////////////////////////////////

  static createMock(overrides?: Partial<MarketplaceStore>) {
    const marketplaceEntities = MarketplaceEntities.createMock();
    return mockUtils.createMockObject<MarketplaceStore>({
      lastMonthQoeTimeConfig: TimeConfig.getMockMonthConfiguration(),
      marketplaceEntities: marketplaceEntities,
      coveredMarketplaceEntities: marketplaceEntities.entities as Array<MarketplaceEntityGeo | MarketplaceEntityIsp>,
      isLoading: false,
      activeClickedCardId: undefined,
      activeHoverCardId: undefined,
      activeMoreDetailsCard: undefined,
      status: StoreStatus.createMock(),
      isDrillDown: false,
      moreDetailsCardId: undefined,
      overallMetrics: MarketplaceMetrics.createMock(),
      selectedEntities: [],
      clearSelectedEntities: mockUtils.mockAction("clearSelectedEntities"),
      selectedEntitySetEnabled: mockUtils.mockAction("selectedEntitySetEnabled"),
      removeSelectedEntitiesIds: mockUtils.mockAction("removeSelectedEntitiesIds"),
      addSelectedEntitiesIds: mockUtils.mockAction("addSelectedEntitiesIds"),
      futureDeployments: [MarketplaceQnEntity.createMock({ isFutureDeployment: true })],
      actionHideHoverCard: mockUtils.mockAction("actionHideHoverCard"),
      actionShowHoverCard: mockUtils.mockAction("actionShowHoverCard"),
      ...overrides,
    });
  }
}
