import { mockUtils } from "common/utils/mockUtils";
import { MarketplaceStore } from "src/_stores/marketplaceStore";
import { CardContainerModel } from "src/card/_parts/cardContainer/cardContainerModel";
import { CardSharedTopModel } from "src/card/_parts/cardSharedTop/cardSharedTopModel";
import { CardCapabilitiesModel } from "src/card/_parts/cardCapabilities/cardCapabilitiesModel";
import { MarketplaceEntityGeo } from "src/_domain/marketplaceEntity/marketplaceEntityGeo";
import { MarketplaceEntityIsp } from "src/_domain/marketplaceEntity/marketplaceEntityIsp";

export class CardMoreDetailsContainerModel {
  constructor(
    private marketplaceEntity: MarketplaceEntityGeo | MarketplaceEntityIsp,
    private marketplace: MarketplaceStore
  ) {}

  readonly cardContainerModel = new CardContainerModel(this.marketplaceEntity, this.marketplace);
  readonly cardSharedTop = new CardSharedTopModel(this.marketplaceEntity);
  readonly cardCapabilities = new CardCapabilitiesModel();

  static createMock(overrides?: Partial<CardMoreDetailsContainerModel>) {
    return mockUtils.createMockObject<CardMoreDetailsContainerModel>({
      cardContainerModel: CardContainerModel.createMock(),
      cardSharedTop: CardSharedTopModel.createMock(),
      cardCapabilities: new CardCapabilitiesModel(),
      ...overrides,
    });
  }
}
