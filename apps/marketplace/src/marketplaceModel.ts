import { computed } from "mobx";
import { TopBarModel } from "./topBar/topBarModel";
import { MarketplaceOverviewModel } from "./overview/marketplaceOverviewModel";
import { MapModel } from "./map/mapModel";
import { DrillDownModel } from "./drillDown/drillDownModel";
import { MarketplaceStore } from "./_stores/marketplaceStore";
import { DrillDownStore } from "./drillDown/_stores/drillDownStore";

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
