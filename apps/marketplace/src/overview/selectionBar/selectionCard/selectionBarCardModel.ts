import { MarketplaceEntityHeaderModel } from "../../../_parts/marketplaceEntityHeader/marketplaceEntityHeaderModel";
import { MarketplaceMetrics } from "../../../_domain/marketplaceMetrics";
import { action, computed } from "mobx";
import { mockUtils } from "@qwilt/common/utils/mockUtils";
import { MarketplaceStore } from "../../../_stores/marketplaceStore";
import { MarketplaceEntityIsp } from "../../../_domain/marketplaceEntity/marketplaceEntityIsp";
import { MarketplaceEntityGeo } from "../../../_domain/marketplaceEntity/marketplaceEntityGeo";

export class SelectionBarCardModel {
  constructor(
    private marketplaceEntity: MarketplaceEntityIsp | MarketplaceEntityGeo,
    private marketplace: MarketplaceStore
  ) {}

  @computed
  get id(): string {
    return this.marketplaceEntity.id;
  }
  @computed
  get marketplaceEntityHeaderModel(): MarketplaceEntityHeaderModel {
    return new MarketplaceEntityHeaderModel(this.marketplaceEntity);
  }
  @computed
  get cardMetrics(): MarketplaceMetrics | undefined {
    return this.marketplaceEntity.lastHourMetrics;
  }

  @action
  showMoreDetails = () => {
    this.marketplace.moreDetailsCardId = this.id;
  };

  static createMock(id = 0, overrides?: Partial<SelectionBarCardModel>) {
    return mockUtils.createMockObject<SelectionBarCardModel>({
      id: "test-id" + id,
      marketplaceEntityHeaderModel: MarketplaceEntityHeaderModel.createMock(),
      cardMetrics: MarketplaceMetrics.createMock(),
      showMoreDetails: mockUtils.mockAction("showMoreDetails"),
      ...overrides,
    });
  }
}
