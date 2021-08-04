import { computed } from "mobx";
import { TopBarModel } from "src/topBar/topBarModel";
import { MarketplaceOverviewModel } from "src/overview/marketplaceOverviewModel";
import { MapModel } from "src/map/mapModel";
import { DrillDownModel } from "src/drillDown/drillDownModel";
import { MarketplaceStore } from "src/_stores/marketplaceStore";
import { DrillDownStore } from "src/drillDown/_stores/drillDownStore";

export class MarketplaceModel {
  constructor(private marketplaceStore: MarketplaceStore) {}

  @computed
  get isLoading() {
    return this.marketplaceStore.isLoading;
  }

  @computed
  get isDrillDown() {
    return this.marketplaceStore.isDrillDown;
  }

  // top level models
  ///////////////////

  marketplaceOverview = new MarketplaceOverviewModel(this.marketplaceStore);
  marketplaceDrillDown = new DrillDownModel(new DrillDownStore(this.marketplaceStore));

  topbar = new TopBarModel(this.marketplaceStore);
  map = new MapModel(this.marketplaceStore);

  static createMock() {
    return new MarketplaceModel(MarketplaceStore.createMock());
  }
}
