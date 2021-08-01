import { loggerCreator } from "@qwilt/common/utils/logger";
import { CacheEntity } from "../_domain/cacheEntity";
import { CdnsApi } from "@qwilt/common/backend/cdns";
import { DeliveryUnitApiType, DeliveryUnitInterfaceApiType } from "@qwilt/common/backend/cdns/_types/deliveryUnitApiType";
import { Notifier } from "@qwilt/common/utils/notifications/notifier";
import { PrepareQueryResult } from "@qwilt/common/utils/reactQueryUtils/prepareQueryResult";
import { QnEntity } from "../_domain/qnEntity";
import { QnsProvider } from "./qnsProvider";
import { DeploymentEntitiesProvider } from "@qwilt/common/providers/deploymentEntitiesProvider";
import { DeploymentEntity } from "@qwilt/common/domain/qwiltDeployment/deploymentEntity";
import { NameWithId } from "@qwilt/common/domain/nameWithId";
import { CacheGroupsProvider } from "./cacheGroupsProvider";
import { CacheGroupEntity } from "../_domain/cacheGroupEntity";
import _ from "lodash";
import { CacheNetworkInterface } from "../_domain/cacheNetworkInterface";

const moduleLogger = loggerCreator("__filename");

export class CachesProvider {
  constructor() {}

  private getCacheInterfaces(cache: QnEntity, deliveryUnit: DeliveryUnitApiType) {
    const cacheInterfaceNames = cache.interfaces.map((cache) => cache.name);
    const duInterfaceNames = Object.keys(deliveryUnit.deliveryUnitInterfaces);
    const allInterfaceNames = _.union(cacheInterfaceNames, duInterfaceNames);

    return allInterfaceNames.map((interfaceName) => {
      const cacheInterface = cache.interfaces.find((cacheInterface) => cacheInterface.name === interfaceName);
      const duInterfaceApiType: DeliveryUnitInterfaceApiType | undefined =
        deliveryUnit.deliveryUnitInterfaces[interfaceName];
      const duInterface: CacheNetworkInterface = {
        cacheInterface: cacheInterface,
        routingName: duInterfaceApiType?.routingName ?? "",
        isEnabled: !!duInterfaceApiType,
        hashId: duInterfaceApiType?.hashId ?? null,
        hashCount: duInterfaceApiType?.hashCount ?? null,
        hashCountOffset: duInterfaceApiType?.hashCountOffset ?? null,
      };

      return duInterface;
    });
  }

  private fromApiType(
    deliveryUnits: DeliveryUnitApiType[],
    qns: QnEntity[],
    networks: DeploymentEntity[],
    cacheGroups: CacheGroupEntity[]
  ): CacheEntity[] {
    return deliveryUnits.map((deliveryUnit) => {
      const qn = qns.find((qn) => qn.systemId === deliveryUnit.systemId);

      const network = networks.find((network) => network.id === deliveryUnit.networkId);
      const networkNameId = new NameWithId<number>({ id: deliveryUnit.networkId ?? -1, name: network?.name ?? "N/A" });

      const group = cacheGroups.find((cacheGroup) => cacheGroup.id === deliveryUnit.duGroupId);
      const groupNameId = new NameWithId({ id: deliveryUnit.duGroupId, name: group?.name ?? "N/A" });

      let interfaces: CacheNetworkInterface[] = [];
      if (qn) {
        interfaces = this.getCacheInterfaces(qn, deliveryUnit);
      } else {
        Notifier.warn(`Failed to find cache for systemId: ${deliveryUnit.systemId} - Interfaces will not be listed`);
      }

      return new CacheEntity({
        id: deliveryUnit.deliveryUnitId,
        name: deliveryUnit.name,
        group: groupNameId,
        network: networkNameId,
        systemId: deliveryUnit.systemId,
        cacheHashId: deliveryUnit.cacheHashId,
        operationalMode: deliveryUnit.operationalMode,
        interfaces: interfaces,
        monitoringSegmentId: deliveryUnit.monitoringSegmentId ? deliveryUnit.monitoringSegmentId : "",
        healthProfile: {
          healthMinAvailableBwKbpsEnabled: deliveryUnit.healthMinAvailableBwKbpsEnabled,
          healthMinAvailableBwKbps: deliveryUnit.healthMinAvailableBwKbps,
          healthMaxLoadAverage: deliveryUnit.healthMaxLoadAverage,
          healthMaxQueryTimeMs: deliveryUnit.healthMaxQueryTimeMs,
          healthConnectionTimeoutMs: deliveryUnit.healthConnectionTimeoutMs,
          healthHistoryCount: deliveryUnit.healthHistoryCount,
          healthPollUrlTemplate: deliveryUnit.healthPollUrlTemplate,
          healthSampleTimeMs: deliveryUnit.healthSampleTimeMs,
          healthReportTimeMs: deliveryUnit.healthReportTimeMs,
          healthRequestTimeoutMs: deliveryUnit.healthRequestTimeoutMs,
          healthRequestTimeWarnMs: deliveryUnit.healthRequestTimeWarnMs,
        },
      });
    });
  }

  prepareQuery(cdnId: string): PrepareQueryResult<CacheEntity[]> {
    return new PrepareQueryResult<CacheEntity[]>({
      name: "CachesProvider.prepareQuery",
      params: [cdnId],
      provide: async (key): Promise<CacheEntity[]> => {
        const [deliveryUnitsResult, qns, groups, networks] = await Promise.all([
          CdnsApi.instance.deliveryUnitsList(cdnId),

          QnsProvider.instance.prepareQuery(cdnId).fetchQueryAsDependency(key),
          CacheGroupsProvider.instance.prepareQuery(cdnId).fetchQueryAsDependency(key),
          DeploymentEntitiesProvider.instance.prepareQueryNetworks().fetchQueryAsDependency(key),
        ]);

        return this.fromApiType(deliveryUnitsResult.deliveryUnits, qns, networks, groups);
      },
    });
  }

  //region [[ Singleton ]]
  private static _instance: CachesProvider | undefined;
  static get instance(): CachesProvider {
    if (!this._instance) {
      this._instance = new CachesProvider();
    }

    return this._instance;
  }
  //endregion
}
