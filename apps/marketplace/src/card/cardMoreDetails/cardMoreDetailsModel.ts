import { mockUtils } from "common/utils/mockUtils";
import { MarketplaceEntity } from "src/_domain/marketplaceEntity/marketplaceEntity";
import { MarketplaceStore } from "src/_stores/marketplaceStore";
import { CardIspLocationModel } from "src/card/cardIspLocation/cardIspLocationModel";
import { MarketplaceEntityIsp } from "src/_domain/marketplaceEntity/marketplaceEntityIsp";
import { CardGeoModel } from "src/card/cardGeo/cardGeoModel";
import { CardIspModel } from "src/card/cardIsp/cardIspModel";
import { MarketplaceEntityGeo } from "src/_domain/marketplaceEntity/marketplaceEntityGeo";

export class CardMoreDetailsModel {
  constructor(private marketplaceEntity: MarketplaceEntity, private marketplace: MarketplaceStore) {}

  get moreDetailsIspLocation(): CardIspLocationModel | undefined {
    if (this.marketplaceEntity instanceof MarketplaceEntityIsp && this.marketplaceEntity.geoParent) {
      return new CardIspLocationModel(this.marketplaceEntity, this.marketplace);
    } else {
      return undefined;
    }
  }

  get moreDetailsIsp(): CardIspModel | undefined {
    if (this.marketplaceEntity instanceof MarketplaceEntityIsp && !this.marketplaceEntity.geoParent) {
      return new CardIspModel(this.marketplaceEntity, this.marketplace);
    } else {
      return undefined;
    }
  }

  get moreDetailsGeo(): CardGeoModel | undefined {
    if (this.marketplaceEntity instanceof MarketplaceEntityGeo) {
      return new CardGeoModel(this.marketplaceEntity, this.marketplace);
    } else {
      return undefined;
    }
  }
  static createMock(modelOverrides?: Partial<CardMoreDetailsModel>) {
    return mockUtils.createMockObject<CardMoreDetailsModel>({
      moreDetailsIspLocation: modelOverrides ? undefined : CardIspLocationModel.createMock(),
      moreDetailsGeo: undefined,
      moreDetailsIsp: undefined,
      ...modelOverrides,
    });
  }
}
