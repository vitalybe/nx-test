import { action, computed } from "mobx";
import { SelectionBarModel } from "src/overview/selectionBar/selectionBarModel";
import { MarketplaceStore } from "src/_stores/marketplaceStore";

export class MarketplaceOverviewModel {
  constructor(private marketplace: MarketplaceStore) {}

  selectionBar = new SelectionBarModel(this.marketplace);

  @action
  changeMoredDetailsCard = (id: string) => {
    this.marketplace.moreDetailsCardId = id;
  };

  @action
  closeMoredDetailsCard = () => {
    this.marketplace.moreDetailsCardId = undefined;
  };

  @computed
  get activeMoreDetailsCard() {
    return this.marketplace.activeMoreDetailsCard;
  }
}
