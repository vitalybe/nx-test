import { computed } from "mobx";
import { mockUtils } from "common/utils/mockUtils";
import { MarketplaceStore } from "src/_stores/marketplaceStore";
import { CardSharedTopModel } from "src/card/_parts/cardSharedTop/cardSharedTopModel";
import { CardContainerModel } from "src/card/_parts/cardContainer/cardContainerModel";
import { MarketplaceEntityGeo } from "src/_domain/marketplaceEntity/marketplaceEntityGeo";
import { MarketplaceEntityIsp } from "src/_domain/marketplaceEntity/marketplaceEntityIsp";

export class CardMapClickedModel {
  constructor(
    private marketplaceEntity: MarketplaceEntityGeo | MarketplaceEntityIsp,
    private marketplace: MarketplaceStore
  ) {}

  readonly cardSharedTop = new CardSharedTopModel(this.marketplaceEntity);
  readonly cardContainerModel = new CardContainerModel(this.marketplaceEntity, this.marketplace);

  @computed
  get id(): string {
    return this.marketplaceEntity.id;
  }

  static createMock(overrides?: Partial<CardMapClickedModel>) {
    return mockUtils.createMockObject<CardMapClickedModel>({
      id: "cardId",
      cardContainerModel: CardContainerModel.createMock(),
      cardSharedTop: CardSharedTopModel.createMock(),
      ...overrides,
    });
  }
}
