import { mockUtils } from "@qwilt/common/utils/mockUtils";
import { MarketplaceEntity } from "../../_domain/marketplaceEntity/marketplaceEntity";
import { MarketplaceStore } from "../../_stores/marketplaceStore";
import { CardIspLocationModel } from "../cardIspLocation/cardIspLocationModel";
import { MarketplaceEntityIsp } from "../../_domain/marketplaceEntity/marketplaceEntityIsp";
import { CardGeoModel } from "../cardGeo/cardGeoModel";
import { CardIspModel } from "../cardIsp/cardIspModel";
import { MarketplaceEntityGeo } from "../../_domain/marketplaceEntity/marketplaceEntityGeo";

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
