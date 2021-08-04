import { MarketplaceEntityGeo } from "./marketplaceEntityGeo";
import { MarketplaceEntityIsp } from "./marketplaceEntityIsp";

export class MarketplaceEntitySelected {
  constructor(
    public readonly marketplaceEntity: MarketplaceEntityGeo | MarketplaceEntityIsp,
    public readonly isEnabled: boolean
  ) {}

  get id(): string {
    return this.marketplaceEntity.id;
  }
}
