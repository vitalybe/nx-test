import { SelectionBarCardModel } from "./selectionCard/selectionBarCardModel";
import { action, computed } from "mobx";
import * as _ from "lodash";
import { mockUtils } from "@qwilt/common/utils/mockUtils";
import { MarketplaceStore } from "../../_stores/marketplaceStore";

export class SelectionBarModel {
  constructor(private marketplace: MarketplaceStore) {}

  @computed
  get selectionCards(): SelectionBarCardModel[] {
    return this.marketplace.selectedEntities.map(
      selectedEntity => new SelectionBarCardModel(selectedEntity.marketplaceEntity, this.marketplace)
    );
  }

  @action
  showDrilldown = () => {
    this.marketplace.isDrillDown = true;
    // we don't want to show the active more details card when drilldown comes
    // up (side effect - current more details card will disappear on drilldown)
    this.marketplace.moreDetailsCardId = undefined;
  };

  @action
  cardClose = (id: string) => {
    this.marketplace.removeSelectedEntitiesIds(id);
  };

  @action
  cardCloseAll = () => {
    this.marketplace.clearSelectedEntities();
  };

  static createMock(overrides?: Partial<SelectionBarModel>) {
    return mockUtils.createMockObject<SelectionBarModel>({
      selectionCards: _.range(5).map(i => SelectionBarCardModel.createMock()),
      showDrilldown: mockUtils.mockAction("showDrilldown"),
      cardClose: mockUtils.mockAction("cardClose"),
      cardCloseAll: mockUtils.mockAction("cardCloseAll"),
      ...overrides,
    });
  }
}
