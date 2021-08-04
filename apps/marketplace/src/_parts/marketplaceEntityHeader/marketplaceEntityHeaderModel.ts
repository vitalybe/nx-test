import { MarketplaceEntity } from "src/_domain/marketplaceEntity/marketplaceEntity";
import { computed } from "mobx";
import { imageResourcePathProvider } from "src/_providers/imageResourcePathProvider";
import { mockUtils } from "common/utils/mockUtils";
import { ParentLocation } from "src/_domain/parentLocation";

export class MarketplaceEntityHeaderModel {
  constructor(private marketplaceEntity: MarketplaceEntity) {}

  @computed
  get title(): string {
    return this.marketplaceEntity.name;
  }

  @computed
  get ispImagePath(): string | undefined {
    return imageResourcePathProvider.provideIspImage(this.marketplaceEntity);
  }

  @computed
  get location(): string {
    const parentLocation = new ParentLocation(this.marketplaceEntity, ", ");

    return parentLocation.fullNameLabel;
  }

  static createMock(overrides?: Partial<MarketplaceEntityHeaderModel>) {
    return mockUtils.createMockObject<MarketplaceEntityHeaderModel>({
      title: "ISP name",
      ispImagePath: `common/images/isps/comcast.png`,
      location: "US, NY",
      ...overrides,
    });
  }
}
