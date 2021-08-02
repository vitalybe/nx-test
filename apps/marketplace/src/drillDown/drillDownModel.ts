import { action, computed } from "mobx";
import { DrillDownTableModel } from "src/drillDown/table/drillDownTableModel";
import { MarketplaceStore } from "src/_stores/marketplaceStore";
import { DrillDownStore } from "src/drillDown/_stores/drillDownStore";
import { DrillDownLegendModel } from "src/drillDown/legend/drillDownLegendModel";
import { DrillDownChartModel } from "src/drillDown/chart/drillDownChartModel";
import { DrillDownChartAreaStore } from "src/drillDown/_stores/drillDownChartAreaStore";

export class DrillDownModel {
  constructor(private drilldownStore: DrillDownStore) {}

  private chartAreaStore = new DrillDownChartAreaStore(this.drilldownStore);

  legend = new DrillDownLegendModel(this.chartAreaStore);
  chart = new DrillDownChartModel(this.chartAreaStore);
  table = new DrillDownTableModel(this.drilldownStore);

  @computed
  get isDrilldownActive() {
    return this.drilldownStore.marketplace.isDrillDown;
  }

  @action
  hideDrilldown = () => {
    this.drilldownStore.marketplace.isDrillDown = false;
    this.drilldownStore.marketplace.moreDetailsCardId = undefined;

    const drillDownEntities = this.drilldownStore.drillDownEntities;
    drillDownEntities.forEach(entity => {
      this.drilldownStore.marketplace.selectedEntitySetEnabled(entity.marketplaceEntity.id, true);
    });
  };

  @computed
  get moreDetailsCard() {
    return this.drilldownStore.marketplace.activeMoreDetailsCard;
  }

  @action
  changeCard = (id: string) => {
    return (this.drilldownStore.marketplace.moreDetailsCardId = id);
  };

  @action
  removeCard = () => {
    return (this.drilldownStore.marketplace.moreDetailsCardId = undefined);
  };

  static createMock(): DrillDownModel {
    const marketplace = MarketplaceStore.createMock();
    marketplace.marketplaceEntities.entities.forEach(entity => {
      marketplace.addSelectedEntitiesIds(entity.id);
    });
    return new DrillDownModel(DrillDownStore.createMock());
  }
}
