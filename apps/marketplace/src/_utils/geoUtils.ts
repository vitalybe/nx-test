import { MarketplaceEntityGeo } from "../_domain/marketplaceEntity/marketplaceEntityGeo";

export class GeoUtils {
  static getContinentIso(geoEntity: MarketplaceEntityGeo) {
    const continentsDict: { [key: string]: string } = {
      africa: "AF",
      antarctica: "AN",
      asia: "AS",
      europe: "EU",
      "north america": "NA",
      oceania: "OC",
      "south america": "SA",
    };
    return geoEntity.iso2 ? geoEntity.iso2 : continentsDict[geoEntity.name.toLowerCase()];
  }
}
