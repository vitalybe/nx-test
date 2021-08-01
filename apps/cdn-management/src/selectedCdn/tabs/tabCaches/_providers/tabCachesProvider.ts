import { loggerCreator } from "@qwilt/common/utils/logger";
import { PrepareQueryResult } from "@qwilt/common/utils/reactQueryUtils/prepareQueryResult";
import { CachesProvider } from "../../../../_providers/cachesProvider";
import { CacheGroupsProvider } from "../../../../_providers/cacheGroupsProvider";
import { QnsProvider } from "../../../../_providers/qnsProvider";
import { DeploymentEntitiesProvider } from "@qwilt/common/providers/deploymentEntitiesProvider";
import { CacheEntity } from "../../../../_domain/cacheEntity";
import { CacheGroupEntity } from "../../../../_domain/cacheGroupEntity";
import { QnEntity } from "../../../../_domain/qnEntity";
import { DeploymentEntity } from "@qwilt/common/domain/qwiltDeployment/deploymentEntity";

// noinspection JSUnusedLocalSymbols
const moduleLogger = loggerCreator("__filename");

export class TabCachesProvider {
  private constructor() {}

  prepareQuery(
    cdnId: string
  ): PrepareQueryResult<{
    caches: CacheEntity[];
    cacheGroups: CacheGroupEntity[];
    availableQns: QnEntity[];
    networks: DeploymentEntity[];
  }> {
    return new PrepareQueryResult({
      name: "TabCachesProvider.prepareQuery",
      // NOTE: remove if there are no arguments
      // eslint-disable-next-line prefer-rest-params
      params: [...arguments],
      provide: async (key) => {
        return {
          caches: await CachesProvider.instance.prepareQuery(cdnId).fetchQueryAsDependency(key),
          cacheGroups: await CacheGroupsProvider.instance.prepareQuery(cdnId).fetchQueryAsDependency(key),
          availableQns: await QnsProvider.instance.prepareQueryAvailableQns(cdnId).fetchQueryAsDependency(key),
          networks: await DeploymentEntitiesProvider.instance.prepareQueryNetworks().fetchQueryAsDependency(key),
        };
      },
    });
  }

  //region [[ Singleton ]]
  private static _instance: TabCachesProvider | undefined;
  static get instance(): TabCachesProvider {
    if (!this._instance) {
      this._instance = new TabCachesProvider();
    }

    return this._instance;
  }
  //endregion
}
