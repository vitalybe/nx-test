import { imageResourcePathProvider } from "../../_providers/imageResourcePathProvider";
import { computed } from "mobx";
import { MarketplaceEntitySelected } from "../../_domain/marketplaceEntity/marketplaceEntitySelected";
import { Colors } from "../../_styling/colors";
import { MarketplaceEntityGeo } from "../../_domain/marketplaceEntity/marketplaceEntityGeo";

export class DrillDownEntity {
  constructor(private selectedEntity: MarketplaceEntitySelected, private readonly originalColor: string) {}

  @computed
  get color() {
    return this.selectedEntity.isEnabled ? this.originalColor : Colors.GRAY_5;
  }

  @computed
  get isEnabled() {
    return this.selectedEntity.isEnabled;
  }

  @computed
  get marketplaceEntity() {
    return this.selectedEntity.marketplaceEntity;
  }

  ispIcon: string | undefined = imageResourcePathProvider.provideIspImage(this.marketplaceEntity);

  static createMock(): DrillDownEntity {
    return new DrillDownEntity(
      new MarketplaceEntitySelected(MarketplaceEntityGeo.createMock("1", false), true),
      "blue"
    );
  }
}
