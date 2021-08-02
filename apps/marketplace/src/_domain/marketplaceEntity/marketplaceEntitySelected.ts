import { MarketplaceEntityGeo } from "src/_domain/marketplaceEntity/marketplaceEntityGeo";
import { MarketplaceEntityIsp } from "src/_domain/marketplaceEntity/marketplaceEntityIsp";

export class MarketplaceEntitySelected {
  constructor(
    public readonly marketplaceEntity: MarketplaceEntityGeo | MarketplaceEntityIsp,
    public readonly isEnabled: boolean
  ) {}

  get id(): string {
    return this.marketplaceEntity.id;
  }
}
