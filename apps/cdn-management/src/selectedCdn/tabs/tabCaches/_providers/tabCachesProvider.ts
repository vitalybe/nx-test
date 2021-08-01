import { loggerCreator } from "common/utils/logger";
import { PrepareQueryResult } from "common/utils/reactQueryUtils/prepareQueryResult";
import { CachesProvider } from "src/_providers/cachesProvider";
import { CacheGroupsProvider } from "src/_providers/cacheGroupsProvider";
import { QnsProvider } from "src/_providers/qnsProvider";
import { DeploymentEntitiesProvider } from "common/providers/deploymentEntitiesProvider";
import { CacheEntity } from "src/_domain/cacheEntity";
import { CacheGroupEntity } from "src/_domain/cacheGroupEntity";
import { QnEntity } from "src/_domain/qnEntity";
import { DeploymentEntity } from "common/domain/qwiltDeployment/deploymentEntity";

// noinspection JSUnusedLocalSymbols
const moduleLogger = loggerCreator(__filename);

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
