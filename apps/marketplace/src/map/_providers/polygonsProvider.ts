import { loggerCreator } from "common//utils/logger";
import { PolygonEntity } from "src/map/_domain/polygonEntity";
import { LatLng } from "src/_domain/latLng";
import { Utils } from "common/utils/utils";

const moduleLogger = loggerCreator(__filename);

type JsonCoordinate = [number, number];
type JsonPolygon = [JsonCoordinate[]];
type JsonMultiPolygon = JsonPolygon[];

interface JsonFeature {
  properties: { countryIso: string; stateIso?: string };
  geometry: {
    type: "Polygon" | "MultiPolygon";
    coordinates: JsonPolygon | JsonMultiPolygon;
  };
}

export class PolygonsProvider {
  constructor() {}

  private coordinatesFromJsonPolygon(polygon: JsonPolygon): LatLng[] {
    return polygon[0].map(coordinate => ({ lat: coordinate[1], lng: coordinate[0] }));
  }

  private coordinatesFromJsonMultiPolygon(multiPolygon: JsonMultiPolygon): LatLng[][] {
    return multiPolygon.map(polygon => this.coordinatesFromJsonPolygon(polygon));
  }

  private polygonEntityFromJsonFeature(feature: JsonFeature): PolygonEntity {
    let coordinates: LatLng[][];
    if (feature.geometry.type === "Polygon") {
      coordinates = [this.coordinatesFromJsonPolygon(feature.geometry.coordinates as JsonPolygon)];
    } else if (feature.geometry.type === "MultiPolygon") {
      coordinates = this.coordinatesFromJsonMultiPolygon(feature.geometry.coordinates as JsonMultiPolygon);
    } else {
      throw new Error(`unknown type: ${feature.geometry.type}`);
    }

    return new PolygonEntity({
      countryIso: feature.properties.countryIso,
      stateIso: feature.properties.stateIso,
      coordinates: coordinates,
    });
  }

  private polygonEntitiesFromJsonFeatures(features: JsonFeature[]): PolygonEntity[] {
    return features
      .map(feature => {
        try {
          return this.polygonEntityFromJsonFeature(feature);
        } catch (e) {
          moduleLogger.error(`failed to process feature: ${features}`);
        }
      })
      .filter(Utils.isTruthy);
  }

  polygonEntitiesCache: PolygonEntity[] | undefined;

  provide = (): PolygonEntity[] => {
    if (!this.polygonEntitiesCache) {
      const allCountryPolygons = this.polygonEntitiesFromJsonFeatures(
        require("../_data/region_data_countries.json").features
      );
      const allUsaStatesPolygons = this.polygonEntitiesFromJsonFeatures(
        require("../_data/region_data_us_states.json").features
      );

      return [...allCountryPolygons, ...allUsaStatesPolygons];
    }

    return this.polygonEntitiesCache;
  };

  private static _instance: PolygonsProvider | undefined;
  static getInstance(): PolygonsProvider {
    if (!this._instance) {
      this._instance = new PolygonsProvider();
    }

    return this._instance;
  }
}
