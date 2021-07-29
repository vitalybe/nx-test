import { loggerCreator } from "common/utils/logger";
import { CacheGroupEntity } from "src/_domain/cacheGroupEntity";
import { PrepareQueryResult } from "common/utils/reactQueryUtils/prepareQueryResult";
import { Notifier } from "common/utils/notifications/notifier";
import { Utils } from "common/utils/utils";
import { CdnsApi } from "common/backend/cdns";
import { DeploymentEntitiesProvider } from "common/providers/deploymentEntitiesProvider";
import { NameWithId } from "common/domain/nameWithId";
import _ from "lodash";

const moduleLogger = loggerCreator(__filename);

export class CacheGroupsProvider {
  constructor() {}

  prepareQuery(cdnId: string): PrepareQueryResult<CacheGroupEntity[]> {
    return new PrepareQueryResult<CacheGroupEntity[]>({
      name: "CacheGroupsProvider.prepareQuery",
      // NOTE: remove if there are no arguments
      // eslint-disable-next-line prefer-rest-params
      params: [...arguments],
      provide: async (key): Promise<CacheGroupEntity[]> => {
        const deliveryUnitGroupsResult = await CdnsApi.instance.deliveryUnitGroupsList(cdnId);
        const networks = await DeploymentEntitiesProvider.instance.prepareQueryNetworks().fetchQueryAsDependency(key);

        const groupsApiResult = deliveryUnitGroupsResult.duGroups;
        const cacheGroups: CacheGroupEntity[] = groupsApiResult
          .map((cacheGroupApi) => {
            try {
              const network = networks.find((network) => network.id === cacheGroupApi.networkId);

              return new CacheGroupEntity({
                id: cacheGroupApi.duGroupId,
                name: cacheGroupApi.name,
                network: network ? new NameWithId<number>({ id: network.id, name: network.name }) : undefined,
                type: cacheGroupApi.type,
                latitude: cacheGroupApi.latitude,
                longitude: cacheGroupApi.longitude,
                fallbackCacheGroups: [],
                dispersion: cacheGroupApi.dispersion,
                dispersionCalculationMethod: cacheGroupApi.dispersionCalculationMethod,
              });
            } catch (e) {
              Notifier.error("Failed to create group", e);
            }
          })
          .filter(Utils.isTruthy);

        for (const cacheGroup of cacheGroups) {
          const groupApiResult = groupsApiResult.find((groupApiType) => cacheGroup.id === groupApiType.duGroupId);
          if (!groupApiResult) {
            throw new Error("can't find group in response");
          }

          // fallback groups
          for (const fallbackId of groupApiResult.fallbackDeliveryUnitGroups) {
            const fallbackGroup = cacheGroups.find((group) => group.id === fallbackId);
            if (fallbackGroup) {
              cacheGroup.fallbackCacheGroups.push(fallbackGroup);
            } else {
              Notifier.warn("Failed to find defined fallback group: " + fallbackId);
            }
          }

          // parent group
          const parentGroupId = groupApiResult.parentDeliveryUnitGroupId;
          if (parentGroupId) {
            const parentGroup = cacheGroups.find((group) => group.id === parentGroupId);
            if (parentGroup) {
              parentGroup.childrenCacheGroups.push(cacheGroup);
              cacheGroup.parentCacheGroup = parentGroup;
            } else {
              Notifier.warn(
                `Failed to find defined parent group "${parentGroupId}" for DUG: ${groupApiResult.duGroupId}`
              );
            }
          }
        }

        return _.orderBy(cacheGroups, ["name"]);
      },
    });
  }

  //region [[ Singleton ]]
  private static _instance: CacheGroupsProvider | undefined;
  static get instance(): CacheGroupsProvider {
    if (!this._instance) {
      this._instance = new CacheGroupsProvider();
    }

    return this._instance;
  }
  //endregion
}
