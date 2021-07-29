import { loggerCreator } from "@qwilt/common/utils/logger";
import { PrepareQueryResult } from "@qwilt/common/utils/reactQueryUtils/prepareQueryResult";
import { InfrastructureApi } from "@qwilt/common/backend/infrastructure";
import { QnDeploymentApi } from "@qwilt/common/backend/qnDeployment";
import { EntityTypeEnum } from "@qwilt/common/backend/qnDeployment/_types/entitiesApiType";
import { CacheApiType } from "@qwilt/common/backend/infrastructure/_types/infrastructureTypes";
import { QnEntity } from "../_domain/qnEntity";
import { CachesProvider } from "./cachesProvider";

// noinspection JSUnusedLocalSymbols
const moduleLogger = loggerCreator("__filename");

export class QnsProvider {
  private constructor() {}

  prepareQuery(cdnId: string) {
    return new PrepareQueryResult<QnEntity[]>({
      name: "QnsProvider.prepareQuery",
      // eslint-disable-next-line prefer-rest-params
      params: [...arguments],
      provide: async (): Promise<QnEntity[]> => {
        const cacheResult = await InfrastructureApi.instance.cachesList(cdnId);
        const qnEntities = await QnDeploymentApi.instance.entitiesList({
          types: EntityTypeEnum.QN,
          entities_list_format: "details",
          contained_in_list_format: "none",
          contains_list_format: "none",

          contained_in_list_deep: "false",
        });

        return cacheResult.caches.map((cache: CacheApiType) => {
          const interfaces = cache.interfaces.map((cdnCacheInterface) => ({
            name: cdnCacheInterface.interfaceName,

            ipv4Address: cdnCacheInterface.ipv4Address || "",
            ipv6Address: cdnCacheInterface.ipv6Address || "",
          }));
          const qnApi = qnEntities.entities.find((qnApi) => qnApi.attributes?.systemId === cache.systemId);
          const supportName = qnApi?.attributes["support-name"] ? qnApi?.attributes["support-name"] : "";

          return new QnEntity({
            systemId: cache.systemId,
            networkId: cache.networkId,
            interfaces: interfaces,
            supportName: supportName !== undefined ? supportName : "",
          });
        });
      },
    });
  }

  prepareQueryAvailableQns(cdnId: string) {
    return new PrepareQueryResult<QnEntity[]>({
      name: "QnsProvider.prepareQueryAvailableQns",
      // eslint-disable-next-line prefer-rest-params
      params: [...arguments],
      provide: async (key): Promise<QnEntity[]> => {
        const caches = await CachesProvider.instance.prepareQuery(cdnId).fetchQueryAsDependency(key);
        const qns = await this.prepareQuery(cdnId).fetchQueryAsDependency(key);

        return qns.filter(
          (qn) =>
            !caches.find((cache) => {
              return qn.systemId === cache.systemId;
            })
        );
      },
    });
  }

  //region [[ Singleton ]]
  private static _instance: QnsProvider | undefined;
  static get instance(): QnsProvider {
    if (!this._instance) {
      this._instance = new QnsProvider();
    }

    return this._instance;
  }
  //endregion
}
