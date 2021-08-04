import { mockUtils } from "@qwilt/common/utils/mockUtils";
import { MarketplaceEntity } from "../../_domain/marketplaceEntity/marketplaceEntity";
import { MarketplaceEntityHeaderModel } from "../../_parts/marketplaceEntityHeader/marketplaceEntityHeaderModel";

export class CardMapHoverModel {
  constructor(private marketplaceEntity: MarketplaceEntity) {}

  readonly marketplaceEntityHeader = new MarketplaceEntityHeaderModel(this.marketplaceEntity);

  static createMock(overrides?: Partial<CardMapHoverModel>) {
    return mockUtils.createMockObject<CardMapHoverModel>({
      marketplaceEntityHeader: MarketplaceEntityHeaderModel.createMock(),
      ...overrides,
    });
  }
}
