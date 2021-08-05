import "reflect-metadata";
import { MarketplaceEntity } from "./marketplaceEntity/marketplaceEntity";
import { computed } from "mobx";
import { MarketplaceEntityGeo } from "./marketplaceEntity/marketplaceEntityGeo";
import { mockUtils } from "@qwilt/common/utils/mockUtils";
import { ApiGeoEntityType } from "@qwilt/common/backend/geoDeployment/geoDeploymentTypes";

class MarketplaceParent {
  constructor(private geoEntity: MarketplaceEntityGeo) {}

  @computed
  get isoName(): string {
    return this.geoEntity.iso2;
  }

  @computed
  get fullName(): string {
    return this.geoEntity.name;
  }

  static createMock(overrides?: Partial<MarketplaceParent>) {
    return mockUtils.createMockObject<MarketplaceParent>({
      isoName: "US",
      fullName: "United States",
      ...overrides,
    });
  }
}

export class ParentLocation {
  constructor(private marketplaceEntity: MarketplaceEntity, private parentSeparator = "/") {}

  @computed
  get firstParent(): MarketplaceParent | undefined {
    const { geoParent, type } = this.marketplaceEntity;
    if (geoParent && type !== ApiGeoEntityType.CONTINENT) {
      return new MarketplaceParent(geoParent);
    }
  }

  @computed
  get secondParent(): MarketplaceParent | undefined {
    const { geoParent } = this.marketplaceEntity;
    if (geoParent && geoParent.type !== ApiGeoEntityType.CONTINENT && geoParent.geoParent) {
      return new MarketplaceParent(geoParent.geoParent);
    }
  }

  @computed
  get fullIsoLabel(): string {
    return this.getLabelByProperty("isoName");
  }

  @computed
  get fullNameLabel(): string {
    return this.getLabelByProperty("fullName");
  }

  private getLabelByProperty(property: keyof MarketplaceParent): string {
    let label = "";
    if (this.firstParent && this.firstParent[property].length > 0) {
      label += this.firstParent[property];
      if (this.secondParent && this.secondParent[property].length > 0) {
        label += `${this.parentSeparator + this.secondParent[property]}`;
      }
    }
    return label;
  }

  static createMock(createEmpty: boolean = false) {
    if (createEmpty) {
      return mockUtils.createMockObject<ParentLocation>({
        firstParent: undefined,
        secondParent: undefined,
        fullIsoLabel: "",
        fullNameLabel: "",
      });
    }
    return mockUtils.createMockObject<ParentLocation>({
      firstParent: MarketplaceParent.createMock(),
      secondParent: MarketplaceParent.createMock(),
      fullIsoLabel: "CA/US",
      fullNameLabel: "California/UnitedStates",
    });
  }
}
