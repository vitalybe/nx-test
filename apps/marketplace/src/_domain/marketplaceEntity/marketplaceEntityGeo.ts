import { LatLng } from "src/_domain/latLng";
import { MarketplaceMetrics } from "src/_domain/marketplaceMetrics";
import { MarketplaceEntity } from "src/_domain/marketplaceEntity/marketplaceEntity";
import { computed, observable, runInAction } from "mobx";
import { ParentLocation } from "src/_domain/parentLocation";
import { ApiGeoEntityType } from "common/backend/geoDeployment/geoDeploymentTypes";
import { marketplaceMetricsProvider } from "src/_providers/marketplaceMetricsProvider";
import { MarketplaceStore } from "src/_stores/marketplaceStore";

export class MarketplaceEntityGeo implements MarketplaceEntity {
  constructor(
    // ID of region/ISP. For ISP inside region a combination of all its parents IDs and ISP id
    public id: string,
    public iso2: string,
    public type: ApiGeoEntityType,
    public name: string,
    public geoLocation: LatLng,
    // Countries have no geo parent
    public geoParent: MarketplaceEntityGeo | undefined,
    // bandwidth lastHourMetrics
    public coverage: number,
    public ispCount: number = 0
  ) {}

  _lastHourMetricsLoaded: boolean = false;
  @observable private _lastHourMetrics: MarketplaceMetrics | undefined = undefined;
  @computed get lastHourMetrics(): MarketplaceMetrics | undefined {
    if (!this._lastHourMetricsLoaded && !this._lastHourMetrics) {
      this._lastHourMetricsLoaded = true;
      marketplaceMetricsProvider.provide([this.id], MarketplaceStore.lastHourTimeConfig).then(resultMetrics => {
        runInAction(() => {
          this._lastHourMetrics = resultMetrics;
        });
      });
    }

    return this._lastHourMetrics;
  }

  @computed
  get parentLocation(): ParentLocation {
    return new ParentLocation(this);
  }

  static createMock(id: string, isSecondParent: boolean): MarketplaceEntityGeo {
    return new MarketplaceEntityGeo(
      id,
      isSecondParent ? "eur" : "fr",
      ApiGeoEntityType.COUNTRY,
      isSecondParent ? "europe" : "france",
      { lat: 5743753499734, lng: 3459438950934 },
      Math.random() > 0.5 ? MarketplaceEntityGeo.createMock(id + "parent", true) : undefined,
      5
    );
  }
}
