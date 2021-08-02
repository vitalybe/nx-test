/* eslint-disable unused-imports/no-unused-vars */
import * as _ from "lodash";
import {
  CapacityApiCapacityTimestamp,
  CapacityApiResultType,
  ConfigApiConfigurationType,
  ConfigApiNetworkType,
  ConfigApiResultType,
  DsgsApiDsgType,
  DsgsApiMappingType,
  DsgsApiResultType,
} from "../_types/resourceManagerTypes";
import mockData from "../../_utils/mockData";
import { Omit } from "../../../utils/typescriptUtils";
import { ResourceManagerApi } from "../../resourceManager";
import { AjaxMetadata } from "../../../utils/ajax";
import { Duration } from "luxon";

interface MockConfigOfDsgs {
  percentOfCycle: number;
  dsgs: DsgsApiDsgType[];
}

type ConfigApiNetworkTypeMock = Omit<ConfigApiNetworkType, "id">;

interface MockConfigOfConfig {
  percentOfCycle: number;
  config: ConfigApiNetworkTypeMock;
}

interface MockConfigOfCapacity {
  percentOfCycle: number;
  bw: number;
}

interface ResourceManagerApiMockConfig {
  cycle: Duration;
  capacity: MockConfigOfCapacity[];
  config: MockConfigOfConfig[];
  dsgs: MockConfigOfDsgs[];
}

export class ResourceManagerApiMock extends ResourceManagerApi {
  private getDefaultMockConfig(): ResourceManagerApiMockConfig {
    return {
      cycle: Duration.fromObject({ day: 1 }),
      capacity: [{ percentOfCycle: 0, bw: 300 * Math.pow(10, 9) }],
      config: [
        {
          percentOfCycle: 0,
          config: {
            preferred: [mockData.dsgs[0]],
            reserved: [{ dsgId: mockData.dsgs[0], bw: 400 * Math.pow(10, 9) }],
            qservices: { wire: { priority: "high" } },
          },
        },
      ],
      dsgs: [
        {
          percentOfCycle: 0,
          dsgs: [
            { id: mockData.dsgs[0], dsNames: [mockData.sites[0], mockData.sites[1]] },
            { id: mockData.dsgs[1], dsNames: [mockData.sites[1], mockData.sites[2]] },
          ],
        },
      ],
    };
  }

  mockConfig: ResourceManagerApiMockConfig = this.getDefaultMockConfig();

  private iterateTimestamp(
    from: number,
    to: number,
    timestampPercents: { percentOfCycle: number }[],
    callback: (timestamp: number, i: number) => void
  ) {
    const cycleSeconds = this.mockConfig.cycle.as("second");
    const cycleFrom = from - (from % cycleSeconds);
    const cycleTo = to - (to % cycleSeconds) + cycleSeconds;

    const percentsOfCycle = _.sortBy(timestampPercents.map((timestampPercent) => timestampPercent.percentOfCycle));
    for (let currentFrom = cycleFrom; currentFrom < cycleTo; currentFrom += cycleSeconds) {
      for (const [i, percentOfCycle] of percentsOfCycle.entries()) {
        const timestamp = currentFrom + (cycleSeconds / 100) * percentOfCycle;
        if (timestamp < to && timestamp >= from) {
          callback(timestamp, i);
        }
      }
    }
  }

  async getDsgs(from: number, to: number, metadata: AjaxMetadata): Promise<DsgsApiResultType> {
    const mappings: DsgsApiMappingType[] = [];

    const mockDsgs = this.mockConfig.dsgs;
    this.iterateTimestamp(from, to, mockDsgs, (timestamp, i) => {
      mappings.push({
        timestamp: timestamp,
        dsgs: mockDsgs[i].dsgs.map((dsg) => ({
          id: dsg.id,
          dsNames: dsg.dsNames,
          dsResourceIds: 1234,
        })),
      });
    });

    return { mappings: mappings };
  }

  async getConfig(
    from: number,
    to: number,
    networkIds: string[],
    metadata: AjaxMetadata
  ): Promise<ConfigApiResultType> {
    const configurations: ConfigApiConfigurationType[] = [];

    const mockConfigs = this.mockConfig.config;
    this.iterateTimestamp(from, to, mockConfigs, (timestamp, i) => {
      configurations.push({
        timestamp: timestamp,
        networks: networkIds.map((networkId) => ({
          id: networkId,
          preferred: mockConfigs[i].config.preferred,
          reserved: mockConfigs[i].config.reserved,
          qservices: mockConfigs[i].config.qservices,
        })),
      });
    });

    return { configurations: configurations };
  }

  async getCapacity(
    from: number,
    to: number,
    networkIds: string[],
    metadata: AjaxMetadata
  ): Promise<CapacityApiResultType> {
    const capacities: CapacityApiCapacityTimestamp[] = [];

    const mockCapacity = this.mockConfig.capacity;
    this.iterateTimestamp(from, to, mockCapacity, (timestamp, i) => {
      capacities.push({
        timestamp: timestamp,
        networks: networkIds.map((networkId) => ({
          id: networkId,
          capacity: { bw: mockCapacity[i].bw },
        })),
      });
    });

    return { capacities: capacities };
  }

  //region [[ Singleton ]]
  protected static _instance: ResourceManagerApiMock | undefined;
  static get instance(): ResourceManagerApiMock {
    if (!this._instance) {
      this._instance = new ResourceManagerApiMock();
    }

    return this._instance;
  }
  //endregion
}
