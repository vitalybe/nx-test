import { mockUtils } from "common/utils/mockUtils";
import { MarketplaceEntity } from "src/_domain/marketplaceEntity/marketplaceEntity";
import { MarketplaceStore } from "src/_stores/marketplaceStore";
import { CardMoreDetailsContainerModel } from "src/card/_parts/cardMoreDetailsContainer/cardMoreDetailsContainerModel";
import { computed } from "mobx";
import { MarketplaceEntityIsp } from "src/_domain/marketplaceEntity/marketplaceEntityIsp";

export class CardIspModel {
  constructor(private marketplaceEntityIsp: MarketplaceEntityIsp, private marketplace: MarketplaceStore) {}
  readonly cardMoreDetailsContainer = new CardMoreDetailsContainerModel(this.marketplaceEntityIsp, this.marketplace);

  @computed
  get entityName(): string {
    return this.marketplaceEntityIsp.name;
  }

  @computed
  get ispsInGeo(): MarketplaceEntity[] {
    return this.marketplace.marketplaceEntities.entities.filter((entity) => {
      const isSameIsp = entity instanceof MarketplaceEntityIsp && entity.ispId === this.marketplaceEntityIsp.ispId;
      return entity.geoParent && isSameIsp;
    });
  }

  static createMock(overrides?: Partial<CardIspModel>) {
    return mockUtils.createMockObject<CardIspModel>({
      cardMoreDetailsContainer: CardMoreDetailsContainerModel.createMock(),
      ispsInGeo: [MarketplaceEntityIsp.createMock("Best ISP"), MarketplaceEntityIsp.createMock("Awesome ISP")],
      entityName: "Best ISP",
      ...overrides,
    });
  }
}
