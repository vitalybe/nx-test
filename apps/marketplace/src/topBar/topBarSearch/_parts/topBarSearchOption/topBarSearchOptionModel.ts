import { MarketplaceEntity } from "src/_domain/marketplaceEntity/marketplaceEntity";
import { computed } from "mobx";
import { MarketplaceEntityIsp } from "src/_domain/marketplaceEntity/marketplaceEntityIsp";
import { mockUtils } from "common/utils/mockUtils";
import { EntityIconModel } from "src/_parts/entityIcon/entityIconModel";
import { ParentLocation } from "src/_domain/parentLocation";
import { MarketplaceEntityGeo } from "src/_domain/marketplaceEntity/marketplaceEntityGeo";
import { ApiGeoEntityType } from "common/backend/geoDeployment/geoDeploymentTypes";

export class TopBarSearchOptionModel {
  constructor(private marketplaceEntity: MarketplaceEntity) {}

  entityIcon = new EntityIconModel(this.marketplaceEntity);

  @computed
  get entityType(): ApiGeoEntityType {
    return this.marketplaceEntity.type;
  }

  @computed
  get id(): string {
    return this.marketplaceEntity.id;
  }

  @computed
  get title(): string {
    return this.marketplaceEntity.name;
  }

  @computed
  get parentLocation(): ParentLocation {
    return this.marketplaceEntity.parentLocation;
  }

  @computed
  get isDisabled(): boolean {
    return this.marketplaceEntity.coverage === 0;
  }

  @computed
  get isIspWithLocation(): boolean {
    return !!(this.marketplaceEntity instanceof MarketplaceEntityIsp && this.parentLocation.firstParent);
  }

  static createMock(overrides?: Partial<TopBarSearchOptionModel>) {
    return mockUtils.createMockObject<TopBarSearchOptionModel>({
      id: "id",
      title: "Israel",
      isDisabled: false,
      isIspWithLocation: false,
      parentLocation: new ParentLocation(MarketplaceEntityGeo.createMock("israel", false)),
      entityIcon: EntityIconModel.createMock(),
      entityType: ApiGeoEntityType.COUNTRY,
      ...overrides,
    });
  }
}
