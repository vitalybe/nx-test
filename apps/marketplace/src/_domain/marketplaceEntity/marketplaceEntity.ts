import { MarketplaceMetrics } from "src/_domain/marketplaceMetrics";
import { MarketplaceEntityGeo } from "src/_domain/marketplaceEntity/marketplaceEntityGeo";
import { ParentLocation } from "src/_domain/parentLocation";
import { ApiGeoEntityType } from "common/backend/geoDeployment/geoDeploymentTypes";

export interface MarketplaceEntity {
  id: string;
  name: string;
  type: ApiGeoEntityType;
  lastHourMetrics: MarketplaceMetrics | undefined;
  geoParent: MarketplaceEntityGeo | undefined;
  ispCount: number;
  parentLocation: ParentLocation;
  coverage: number;
}

export function isMarketplaceEntityContainedIn(
  thisEntity: MarketplaceEntity,
  parentEntity: MarketplaceEntity
): boolean {
  if (!thisEntity.geoParent) {
    return false;
  } else if (thisEntity.geoParent && thisEntity.geoParent.id === parentEntity.id) {
    return true;
  } else {
    return isMarketplaceEntityContainedIn(thisEntity.geoParent, parentEntity);
  }
}
