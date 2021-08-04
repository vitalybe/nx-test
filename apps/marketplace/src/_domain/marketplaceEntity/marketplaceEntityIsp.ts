import { MarketplaceMetrics } from "src/_domain/marketplaceMetrics";
import { MarketplaceEntity } from "src/_domain/marketplaceEntity/marketplaceEntity";
import { MarketplaceEntityGeo } from "src/_domain/marketplaceEntity/marketplaceEntityGeo";
import { computed, observable, runInAction } from "mobx";
import { ParentLocation } from "src/_domain/parentLocation";
import { ApiGeoEntityType } from "common/backend/geoDeployment/geoDeploymentTypes";
import { MarketplaceQnEntity } from "src/_domain/marketplaceEntity/marketplaceQnEntity";
import { marketplaceMetricsProvider } from "src/_providers/marketplaceMetricsProvider";
import { MarketplaceStore } from "src/_stores/marketplaceStore";

export class MarketplaceEntityIsp implements MarketplaceEntity {
  public ispCount: number = 1;

  constructor(
    // For ISP inside region a combination of all its parents IDs and ISP id
    public id: string,
    public ispId: string | undefined,
    public name: string,
    // Global ISP entities have no geo parent
    public geoParent: MarketplaceEntityGeo | undefined,
    public qns: MarketplaceQnEntity[],
    public coverage: number
  ) {}

  readonly type = ApiGeoEntityType.ISP;

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

  static createMock(id: string): MarketplaceEntityIsp {
    return new MarketplaceEntityIsp(id, "comcast", id, MarketplaceEntityGeo.createMock(id + "parent", false), [], 10);
  }
}
