import { mockUtils } from "common/utils/mockUtils";
import { MarketplaceEntity } from "src/_domain/marketplaceEntity/marketplaceEntity";
import { computed } from "mobx";
import { imageResourcePathProvider } from "src/_providers/imageResourcePathProvider";
import { ApiGeoEntityType } from "common/backend/geoDeployment/geoDeploymentTypes";
import { UrlStore } from "common/stores/urlStore/urlStore";
import { CommonUrlParams } from "common/urlParams/commonUrlParams";

export class EntityIconModel {
  constructor(private marketplaceEntity: MarketplaceEntity) {}

  @computed
  get iconPath() {
    const obfuscate = UrlStore.getInstance().getParamExists(CommonUrlParams.obfuscate);
    return obfuscate ? undefined : imageResourcePathProvider.provideImage(this.marketplaceEntity);
  }

  @computed
  get fallbackType(): "isp" | "geo" {
    return this.marketplaceEntity.type === ApiGeoEntityType.ISP ? ApiGeoEntityType.ISP : "geo";
  }

  static createMock(overrides?: Partial<EntityIconModel>) {
    return mockUtils.createMockObject<EntityIconModel>({
      iconPath: "common/images/flags/il.svg",
      fallbackType: "geo",
      ...overrides,
    });
  }
}
