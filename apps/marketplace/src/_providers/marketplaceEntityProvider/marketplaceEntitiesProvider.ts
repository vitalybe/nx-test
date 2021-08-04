import {
  ApiContainedIsp,
  ApiGeoEntity,
  ApiGeoEntityType,
  ApiIspEntities,
  ApiIspEntity,
} from "@qwilt/common/backend/geoDeployment/geoDeploymentTypes";
import { MarketplaceEntityGeo } from "../../_domain/marketplaceEntity/marketplaceEntityGeo";
import { MarketplaceEntityIsp } from "../../_domain/marketplaceEntity/marketplaceEntityIsp";
import { ApiAggregationGroupType, ApiHistogramGroupType } from "@qwilt/common/backend/mediaAnalytics/mediaAnalyticsTypes";
import { MarketplaceEntity } from "../../_domain/marketplaceEntity/marketplaceEntity";
import { MarketplaceEntities } from "../../_domain/marketplaceEntity/marketplaceEntities";
import { MarketplaceNoServiceEntity } from "../../_domain/marketplaceEntity/marketplaceNoServiceEntity";
import { GeoUtils } from "../../_utils/geoUtils";
import { GeoDeploymentApiInterface } from "@qwilt/common/backend/geoDeployment/geoDeploymentApi";
import { devToolsStore } from "@qwilt/common/components/devTools/_stores/devToolsStore";
import { MarketplaceQnEntity } from "../../_domain/marketplaceEntity/marketplaceQnEntity";
import { MediaAnalyticsApi } from "@qwilt/common/backend/mediaAnalytics";

class MarketplaceEntitiesProviderReal {
  provide = async (mediaAnalyticsApi: MediaAnalyticsApi, geoDeploymentApi: GeoDeploymentApiInterface) => {
    const [geoEntities, ispEntities] = await Promise.all([geoDeploymentApi.getEntities(), geoDeploymentApi.getIsps()]);

    const marketplaceEntities = this.provideEntities(geoEntities.entities, ispEntities);
    // add global isp entities
    for (const apiIsp of ispEntities.isps) {
      const isIspWithRegions = marketplaceEntities.find(
        (entity) => entity instanceof MarketplaceEntityIsp && entity.ispId === apiIsp.id
      );
      if (isIspWithRegions) {
        // NOTE: coverage is hard-coded just so the ISP will considered as covered entity. However, the actual coverage will be load lazily
        // if the user brings this ISP details
        marketplaceEntities.push(new MarketplaceEntityIsp(apiIsp.id, apiIsp.id, apiIsp.displayName, undefined, [], 1));
      }
    }

    return new MarketplaceEntities(marketplaceEntities);
  };

  provideEntities = (
    entities: ApiGeoEntity[],
    apiIsps: ApiIspEntities,
    geoParent?: MarketplaceEntityGeo
  ): MarketplaceEntity[] => {
    let collection: MarketplaceEntity[] = [];
    for (const entity of entities) {
      if (entity.coveragePercentage <= 0 || !entity.coveragePercentage) {
        collection.push(
          new MarketplaceNoServiceEntity(entity.id, entity.displayName, entity.isoName, entity.type, geoParent)
        );
      } else {
        const marketplaceEntityGeo = this.provideGeo(entity, geoParent);

        if (marketplaceEntityGeo.type === ApiGeoEntityType.CONTINENT) {
          marketplaceEntityGeo.iso2 = GeoUtils.getContinentIso(marketplaceEntityGeo);
        }

        collection.push(marketplaceEntityGeo);

        collection = collection.concat(this.provideEntities(entity.contains, apiIsps, marketplaceEntityGeo));

        for (const childIsp of entity.isps) {
          const apiIsp = apiIsps.isps.find((isp) => isp.id === childIsp.id);

          if (apiIsp && childIsp.coveragePercent > 0) {
            const marketplaceEntityIsp = this.provideIsp(
              apiIsp,
              childIsp,
              childIsp.coveragePercent,
              marketplaceEntityGeo
            );

            collection.push(marketplaceEntityIsp);
          }
        }
      }
    }

    return collection;
  };

  provideCoveredEntityIds = (entities: ApiGeoEntity[]): string[] => {
    let list: Set<string> = new Set();

    for (const entity of entities) {
      if (entity.coveragePercentage > 0) {
        list.add(entity.id);
      }

      for (const childIsp of entity.isps) {
        if (childIsp.coveragePercent > 0) {
          list.add(childIsp.id);
          list.add(`${entity.id}::${childIsp.id}`);
        }
      }

      list = new Set([...Array.from(list), ...this.provideCoveredEntityIds(entity.contains)]);
    }

    return Array.from(list);
  };

  private getChildIsps = (entity: ApiGeoEntity, containedIsps = new Set<string>()) => {
    entity.isps.forEach((isp) => containedIsps.add(isp.id));

    entity.contains.forEach((child) => {
      this.getChildIsps(child, containedIsps);
    });

    return containedIsps;
  };

  provideGeo = (geoEntity: ApiGeoEntity, geoParent?: MarketplaceEntityGeo): MarketplaceEntityGeo => {
    const type = Object.values(ApiGeoEntityType).find((type) => type === geoEntity.type);
    if (!type) {
      throw new Error(`failed to find type: ${geoEntity.type}`);
    }

    return new MarketplaceEntityGeo(
      geoEntity.id,
      geoEntity.isoName,
      type,
      geoEntity.displayName,
      { lat: geoEntity.lat, lng: geoEntity.lng },
      geoParent,
      geoEntity.coveragePercentage,
      this.getChildIsps(geoEntity).size
    );
  };

  provideIsp = (
    apiIsp: ApiIspEntity,
    apiContainedIsp: ApiContainedIsp,
    coveragePercent: number,
    geoParent?: MarketplaceEntityGeo
  ): MarketplaceEntityIsp => {
    const entityIspId = geoParent ? `${geoParent.id}::${apiIsp.id}` : apiIsp.id;

    const qnEntities: MarketplaceQnEntity[] = [];
    for (const coordinate of apiContainedIsp.coordinates) {
      qnEntities.push(
        new MarketplaceQnEntity({ location: { lng: coordinate.y, lat: coordinate.x }, isFutureDeployment: false })
      );
    }

    return new MarketplaceEntityIsp(entityIspId, apiIsp.id, apiIsp.displayName, geoParent, qnEntities, coveragePercent);
  };
}

class MarketplaceEntitiesProviderMock {
  provide = async (
    // NOTE: Supressing due to the need of matching the interface of MarketplaceEntitiesProviderReal
    // eslint-disable-next-line unused-imports/no-unused-vars
    mediaAnalyticsApi: MediaAnalyticsApi,
    // eslint-disable-next-line unused-imports/no-unused-vars
    geoDeploymentApi: GeoDeploymentApiInterface
  ) => {
    return MarketplaceEntities.createMock();
  };
}

interface MarketplaceEntitiesProvider extends MarketplaceEntitiesProviderMock {}

export const marketplaceEntitiesProvider: MarketplaceEntitiesProvider = devToolsStore.isMockMode
  ? new MarketplaceEntitiesProviderMock()
  : new MarketplaceEntitiesProviderReal();
