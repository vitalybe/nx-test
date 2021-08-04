import { computed } from "mobx";
import { MapMarkerModel } from "src/map/mapMarker/mapMarkerModel";
import { MarketplaceEntityIsp } from "src/_domain/marketplaceEntity/marketplaceEntityIsp";
import { MarketplaceStore } from "src/_stores/marketplaceStore";
import { MarketplaceQnEntity } from "src/_domain/marketplaceEntity/marketplaceQnEntity";

export class MapModel {
  constructor(public marketplace: MarketplaceStore) {}

  @computed
  get mapMarkers() {
    const existingGeoIds = new Set<string>();

    const ispEntitiesInGeo = this.marketplace.coveredMarketplaceEntities.filter(
      (entity) => entity instanceof MarketplaceEntityIsp && entity.geoParent
    ) as MarketplaceEntityIsp[];

    const markers = ispEntitiesInGeo
      .map((entity) => {
        const id = entity.geoParent!.id;
        const ispEntity = entity as MarketplaceEntityIsp;

        let isNewId = !existingGeoIds.has(id);
        if (isNewId && ispEntity.qns.length) {
          existingGeoIds.add(id);
        }

        return ispEntity.qns.map((qn) => {
          const mapMarker = new MapMarkerModel(ispEntity, qn, this.marketplace, isNewId);
          isNewId = false;
          return mapMarker;
        });
      })
      .flat();

    const coverageOnlyMarkers = ispEntitiesInGeo
      .filter((entity) => !existingGeoIds.has(entity.geoParent!.id))
      .map(
        (ispEntityWithoutQns) =>
          new MapMarkerModel(
            ispEntityWithoutQns,
            new MarketplaceQnEntity({
              location: ispEntityWithoutQns.geoParent!.geoLocation,
              isFutureDeployment: false,
            }),
            this.marketplace,
            true
          )
      );

    // NOTE: These markers don't represent a QN - Instead it represents coverage in this geo
    markers.push(...coverageOnlyMarkers);

    const existingLocations = new Map<string, MapMarkerModel>();

    for (const marker of markers) {
      const latLngString = `${marker.location.lat}_${marker.location.lng}`;
      if (!existingLocations.has(latLngString)) {
        existingLocations.set(latLngString, marker);
      }
    }

    return Array.from(existingLocations.values());
  }

  @computed
  get clickedMarker() {
    if (this.marketplace.activeClickedCardId) {
      return this.mapMarkers.find((marker) => marker.card.id === this.marketplace.activeClickedCardId);
    } else {
      return undefined;
    }
  }
}
