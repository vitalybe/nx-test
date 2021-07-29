import { loggerCreator } from "@qwilt/common/utils/logger";
import { PrepareQueryResult } from "@qwilt/common/utils/reactQueryUtils/prepareQueryResult";
import { NameWithId } from "@qwilt/common/domain/nameWithId";
import { DeploymentEntitiesProvider } from "@qwilt/common/providers/deploymentEntitiesProvider";

// noinspection JSUnusedLocalSymbols
const moduleLogger = loggerCreator("__filename");

export class NetworksProvider {
  private constructor() {}

  prepareQuery(): PrepareQueryResult<NameWithId<number>[]> {
    return new PrepareQueryResult({
      name: "NetworksProvider.prepareQuery",
      provide: async () => {
        const networkEntities = await DeploymentEntitiesProvider.instance.provideNetworks();
        return networkEntities.map(
          (networkEntity) => new NameWithId<number>({ id: networkEntity.id, name: networkEntity.name })
        );
      },
    });
  }

  //region [[ Singleton ]]
  private static _instance: NetworksProvider | undefined;
  static get instance(): NetworksProvider {
    if (!this._instance) {
      this._instance = new NetworksProvider();
    }

    return this._instance;
  }
  //endregion
}
