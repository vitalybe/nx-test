import { action, computed } from "mobx";
import { MarketplaceEntity } from "src/_domain/marketplaceEntity/marketplaceEntity";
import { mockUtils } from "common/utils/mockUtils";
import { MarketplaceStore } from "src/_stores/marketplaceStore";

export class CardContainerModel {
  constructor(private marketplaceEntity: MarketplaceEntity, private marketplace: MarketplaceStore) {}

  @computed
  get id(): string {
    return this.marketplaceEntity.id;
  }

  @computed
  get isSelected(): boolean {
    return this.marketplace.selectedEntities.some(
      selectedEntity => selectedEntity.marketplaceEntity.id === this.marketplaceEntity.id
    );
  }

  @action
  addToSelection() {
    this.marketplace.addSelectedEntitiesIds(this.id);
  }

  @action
  removeFromSelection() {
    this.marketplace.removeSelectedEntitiesIds(this.id);
  }

  @computed
  get isDrilldownOpen() {
    return this.marketplace.isDrillDown;
  }

  static createMock(overrides?: Partial<CardContainerModel>) {
    return mockUtils.createMockObject<CardContainerModel>({
      id: "cardId",
      isSelected: false,
      addToSelection: mockUtils.mockAction("addToSelection"),
      removeFromSelection: mockUtils.mockAction("removeFromSelection"),
      isDrilldownOpen: false,
      ...overrides,
    });
  }
}
