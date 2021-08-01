import { loggerCreator } from "common/utils/logger";
import { mockUtils } from "common/utils/mockUtils";
import {
  CacheOperationalModeApiEnum,
  DeliveryUnitEditApiType,
  DeliveryUnitHealthProfileApiType,
} from "common/backend/cdns/_types/deliveryUnitApiType";
import { NameWithId } from "common/domain/nameWithId";
import mockData from "common/backend/_utils/mockData";
import { Utils } from "common/utils/utils";
import { CacheNetworkInterface } from "src/_domain/cacheNetworkInterface";
import { defaultHealthProfile } from "src/_domain/defaultHealthProfile";

const moduleLogger = loggerCreator(__filename);

interface CacheEntityParams {
  id: string;
  name: string;
  group: NameWithId | undefined;
  network: NameWithId<number> | undefined;
  systemId: string;
  cacheHashId: string;
  operationalMode: CacheOperationalModeApiEnum;
  interfaces: CacheNetworkInterface[];
  monitoringSegmentId: string | undefined;
  healthProfile: DeliveryUnitHealthProfileApiType;
}

export class CacheEntity {
  constructor(data: CacheEntityParams) {
    Object.assign(this, data);
  }

  toEditApiType(): DeliveryUnitEditApiType {
    return {
      name: this.name || "",
      systemId: this.systemId,
      duGroupId: this?.group?.id ?? "",
      cacheHashId: this.cacheHashId,
      operationalMode: this.operationalMode,
      deliveryUnitInterfaces: Object.fromEntries(
        this.interfaces
          .filter((duInterface) => duInterface.isEnabled && duInterface.cacheInterface)
          .map((duInterface) => {
            if (duInterface.cacheInterface)
              return [
                duInterface.cacheInterface.name,
                {
                  interfaceName: duInterface.cacheInterface.name,
                  routingName: duInterface.routingName,
                  hashId: duInterface.hashId,
                  hashCount: duInterface.hashCount,
                  hashCountOffset: duInterface.hashCountOffset,
                },
              ];
          })
          .filter(Utils.isTruthy)
      ),
      monitoringSegmentId: this.monitoringSegmentId,
      ...this.healthProfile,
    };
  }

  // Mock
  static createMock(overrides?: Partial<CacheEntityParams>, id: number = mockUtils.sequentialId()) {
    const cacheGroupId = mockData.cacheGroups[id % mockData.cacheGroups.length];
    const networkIdName = mockData.networksWithId[id % mockData.networksWithId.length];
    return new CacheEntity({
      id: id.toString(),
      name: `Cache ${id}`,
      group: new NameWithId({ id: cacheGroupId, name: cacheGroupId }),
      network: new NameWithId<number>({ id: networkIdName.id, name: networkIdName.name }),
      systemId: "MOCK",
      cacheHashId: "CACHE HASH ID",
      operationalMode: CacheOperationalModeApiEnum.OFFLINE,
      interfaces: [
        {
          cacheInterface: { name: "INTERFACE 1", ipv4Address: "1.1.1.1", ipv6Address: "" },
          routingName: "ROUTING 1",
          isEnabled: true,
          hashCount: null,
          hashCountOffset: null,
          hashId: null,
        },
        {
          cacheInterface: { name: "INTERFACE 2", ipv4Address: "2.2.2.2", ipv6Address: "" },
          routingName: "ROUTING 2",
          isEnabled: false,
          hashCount: null,
          hashCountOffset: null,
          hashId: null,
        },
      ],
      monitoringSegmentId: "segmentId",
      healthProfile: defaultHealthProfile,
      ...overrides,
    });
  }
}

// utility - merges parameters as class members
export interface CacheEntity extends CacheEntityParams {}
