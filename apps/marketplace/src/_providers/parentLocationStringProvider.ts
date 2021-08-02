import { MarketplaceEntity } from "../_domain/marketplaceEntity/marketplaceEntity";
import { MarketplaceEntityGeo } from "../_domain/marketplaceEntity/marketplaceEntityGeo";
import { ApiGeoEntityType } from "@qwilt/common/backend/geoDeployment/geoDeploymentTypes";

class ParentLocationStringProvider {
  private provideGeneric(
    marketplaceEntity: MarketplaceEntity,
    property: keyof MarketplaceEntityGeo,
    parentSeparator: string
  ) {
    let title = "";

    if (marketplaceEntity.geoParent && marketplaceEntity.type !== ApiGeoEntityType.CONTINENT) {
      title += marketplaceEntity.geoParent[property];

      if (marketplaceEntity.geoParent.type === ApiGeoEntityType.STATE && marketplaceEntity.geoParent.geoParent) {
        title += parentSeparator + marketplaceEntity.geoParent.geoParent[property];
      }
    }

    return title;
  }

  provideIso(marketplaceEntity: MarketplaceEntity, parentSeparator = "/") {
    return this.provideGeneric(marketplaceEntity, "iso2", parentSeparator);
  }

  provideName(marketplaceEntity: MarketplaceEntity, parentSeparator = "/") {
    return this.provideGeneric(marketplaceEntity, "name", parentSeparator);
  }
}

export const parentLocationStringProvider = new ParentLocationStringProvider();
