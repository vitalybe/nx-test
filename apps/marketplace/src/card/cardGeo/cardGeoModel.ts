import { mockUtils } from "@qwilt/common/utils/mockUtils";
import { isMarketplaceEntityContainedIn, MarketplaceEntity } from "../../_domain/marketplaceEntity/marketplaceEntity";
import { MarketplaceStore } from "../../_stores/marketplaceStore";
import { CardMoreDetailsContainerModel } from "../_parts/cardMoreDetailsContainer/cardMoreDetailsContainerModel";
import { computed } from "mobx";
import { MarketplaceEntityGeo } from "../../_domain/marketplaceEntity/marketplaceEntityGeo";
import { MarketplaceEntityIsp } from "../../_domain/marketplaceEntity/marketplaceEntityIsp";

export class CardGeoModel {
  constructor(private marketplaceEntityGeo: MarketplaceEntityGeo, private marketplace: MarketplaceStore) {}

  readonly cardMoreDetailsContainer = new CardMoreDetailsContainerModel(this.marketplaceEntityGeo, this.marketplace);

  @computed
  get entityName(): string {
    return this.marketplaceEntityGeo.name;
  }

  @computed
  get ispsInGeo(): MarketplaceEntity[] {
    return this.marketplace.marketplaceEntities.entities.filter(
      entity =>
        entity instanceof MarketplaceEntityIsp && isMarketplaceEntityContainedIn(entity, this.marketplaceEntityGeo)
    );
  }

  static createMock(modelOverrides?: Partial<CardGeoModel>) {
    return mockUtils.createMockObject<CardGeoModel>({
      entityName: "Israel",
      cardMoreDetailsContainer: CardMoreDetailsContainerModel.createMock(),
      ispsInGeo: [MarketplaceEntityIsp.createMock("Best ISP"), MarketplaceEntityIsp.createMock("Awesome ISP")],
      ...modelOverrides,
    });
  }
}
