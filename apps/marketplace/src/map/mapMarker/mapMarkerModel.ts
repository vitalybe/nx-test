import { loggerCreator } from "@qwilt/common/utils/logger";
import { CardMapClickedModel } from "../../card/cardMapClicked/cardMapClickedModel";
import { LatLng } from "../../_domain/latLng";
import { computed } from "mobx";
import { isMarketplaceEntityContainedIn } from "../../_domain/marketplaceEntity/marketplaceEntity";
import * as _ from "lodash";
import { mockUtils } from "@qwilt/common/utils/mockUtils";
import { MarketplaceEntityIsp } from "../../_domain/marketplaceEntity/marketplaceEntityIsp";
import { MarketplaceStore } from "../../_stores/marketplaceStore";
import { CardMapHoverModel } from "../../card/cardMapHover/cardMapHoverModel";
import { MarketplaceQnEntity } from "../../_domain/marketplaceEntity/marketplaceQnEntity";
import { MarketplaceEntityGeo } from "../../_domain/marketplaceEntity/marketplaceEntityGeo";

const moduleLogger = loggerCreator("__filename");

export class MapMarkerModel {
  public readonly geoParent: MarketplaceEntityGeo;

  public cardHover: CardMapHoverModel;
  public card: CardMapClickedModel;
  public location: LatLng;

  constructor(
    public marketplaceEntity: MarketplaceEntityIsp,
    private qnEntity: MarketplaceQnEntity,
    private marketplace: MarketplaceStore,
    private showCards: boolean
  ) {
    if (!this.marketplaceEntity.geoParent) {
      throw new Error(`marker entity without geo parent`);
    }

    this.geoParent = this.marketplaceEntity.geoParent;
    this.location = _.clone(qnEntity.location);
    this.cardHover = new CardMapHoverModel(this.geoParent);
    this.card = new CardMapClickedModel(this.geoParent, this.marketplace);
  }

  // ID returns the id of the marker entity (e.g ISP), but since single ISP in geo can have many markers, it won't be unique
  @computed
  get id(): string {
    return this.marketplaceEntity.id;
  }

  @computed get uniqueId() {
    return this.id + "_" + this.qnEntity.getId();
  }

  @computed
  get isHoverCardActive() {
    return this.showCards && this.marketplace.activeHoverCardId === this.geoParent.id;
  }

  @computed
  get isClickedCardActive() {
    return this.showCards && this.marketplace.activeClickedCardId === this.geoParent.id;
  }

  @computed
  get isHighlighted() {
    const selectedMarketplaceEntities = this.marketplace.selectedEntities.map(
      selectedEntity => selectedEntity.marketplaceEntity
    );
    if (selectedMarketplaceEntities.length === 0) {
      return true;
    }
    for (const selectedEntity of selectedMarketplaceEntities) {
      if (this.marketplaceEntity.id === selectedEntity.id) {
        return true;
      } else if (isMarketplaceEntityContainedIn(this.marketplaceEntity, selectedEntity)) {
        return true;
      } else if (
        selectedEntity instanceof MarketplaceEntityIsp &&
        selectedEntity.geoParent === undefined &&
        selectedEntity.ispId === this.marketplaceEntity.ispId
      ) {
        return true;
      }
    }

    return false;
  }

  showMoreDetails() {
    this.marketplace.moreDetailsCardId = this.geoParent.id;
  }

  changeIsHoverCardActive(value: boolean) {
    if (value) {
      this.marketplace.actionShowHoverCard(this.geoParent.id);
    } else if (this.isHoverCardActive) {
      this.marketplace.actionHideHoverCard();
    }
  }

  changeIsClickedCardActive(value: boolean) {
    if (value) {
      this.marketplace.activeClickedCardId = this.geoParent.id;
    } else {
      this.marketplace.activeClickedCardId = undefined;
    }
  }

  static createMock(overrides?: Partial<MapMarkerModel>) {
    return mockUtils.createMockObject<MapMarkerModel>({
      id: "cardId",
      uniqueId: "cardIdUnique",
      location: { lat: 35, lng: 45 },
      isClickedCardActive: false,
      isHoverCardActive: false,
      card: CardMapClickedModel.createMock(),
      cardHover: CardMapHoverModel.createMock(),
      isHighlighted: true,
      showMoreDetails: mockUtils.mockAction("showMoreDetails"),
      changeIsHoverCardActive: mockUtils.mockAction("changeIsHoverCardActive"),
      changeIsClickedCardActive: mockUtils.mockAction("changeIsClickedCardActive"),
      geoParent: MarketplaceEntityGeo.createMock("france", false),
      marketplaceEntity: MarketplaceEntityIsp.createMock("bla"),
      ...overrides,
    });
  }
}
