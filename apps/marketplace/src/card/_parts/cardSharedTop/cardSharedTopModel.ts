import { mockUtils } from "common/utils/mockUtils";
import { computed } from "mobx";
import { MarketplaceMetrics } from "src/_domain/marketplaceMetrics";
import { MarketplaceEntityHeaderModel } from "src/_parts/marketplaceEntityHeader/marketplaceEntityHeaderModel";
import { EntityIconModel } from "src/_parts/entityIcon/entityIconModel";
import { MarketplaceEntityGeo } from "src/_domain/marketplaceEntity/marketplaceEntityGeo";
import { MarketplaceEntityIsp } from "src/_domain/marketplaceEntity/marketplaceEntityIsp";

export class CardSharedTopModel {
  constructor(private marketplaceEntity: MarketplaceEntityGeo | MarketplaceEntityIsp) {}

  readonly marketplaceEntityHeader = new MarketplaceEntityHeaderModel(this.marketplaceEntity);
  readonly entityIcon = new EntityIconModel(this.marketplaceEntity);

  @computed
  get hasIcon() {
    return this.marketplaceEntity instanceof MarketplaceEntityGeo;
  }

  @computed
  get cardMetrics(): MarketplaceMetrics | undefined {
    return this.marketplaceEntity.lastHourMetrics;
  }

  static createMock(overrides?: Partial<CardSharedTopModel>) {
    return mockUtils.createMockObject<CardSharedTopModel>({
      cardMetrics: MarketplaceMetrics.createMock(),
      marketplaceEntityHeader: MarketplaceEntityHeaderModel.createMock(),
      entityIcon: EntityIconModel.createMock(),
      hasIcon: true,
      ...overrides,
    });
  }
}
