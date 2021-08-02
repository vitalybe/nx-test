import { mockUtils } from "@qwilt/common/utils/mockUtils";
import { MarketplaceStore } from "../../../_stores/marketplaceStore";
import { CardContainerModel } from "../cardContainer/cardContainerModel";
import { CardSharedTopModel } from "../cardSharedTop/cardSharedTopModel";
import { CardCapabilitiesModel } from "../cardCapabilities/cardCapabilitiesModel";
import { MarketplaceEntityGeo } from "../../../_domain/marketplaceEntity/marketplaceEntityGeo";
import { MarketplaceEntityIsp } from "../../../_domain/marketplaceEntity/marketplaceEntityIsp";

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
