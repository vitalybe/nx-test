import { MarketplaceMetrics } from "../marketplaceMetrics";
import { MarketplaceEntityGeo } from "./marketplaceEntityGeo";
import { ParentLocation } from "../parentLocation";
import { ApiGeoEntityType } from "@qwilt/common/backend/geoDeployment/geoDeploymentTypes";

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
