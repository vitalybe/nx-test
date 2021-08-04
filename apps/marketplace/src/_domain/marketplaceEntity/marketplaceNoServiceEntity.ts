import { MarketplaceEntityGeo } from "src/_domain/marketplaceEntity/marketplaceEntityGeo";
import { MarketplaceEntity } from "src/_domain/marketplaceEntity/marketplaceEntity";
import { computed } from "mobx";
import { ParentLocation } from "src/_domain/parentLocation";
import { ApiGeoEntityType } from "common/backend/geoDeployment/geoDeploymentTypes";

export class MarketplaceNoServiceEntity implements MarketplaceEntity {
  constructor(
    public id: string,
    public name: string,
    public iso2: string,
    public type: ApiGeoEntityType,
    public geoParent: MarketplaceEntityGeo | undefined
  ) {}

  @computed
  get parentLocation(): ParentLocation {
    return new ParentLocation(this);
  }

  readonly coverage: number = 0;
  readonly lastHourMetrics = undefined;
  readonly ispCount = 0;
}
