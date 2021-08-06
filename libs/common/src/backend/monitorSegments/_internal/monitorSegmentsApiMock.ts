import { sleep } from "../../../utils/sleep";
import { MonitorSegmentsApi } from "../../monitorSegments";
import {
  MonitorSegmentsApiResult,
  MonitorSegmentsApiType,
} from "../_types/monitorSegmentsTypes";
import { loggerCreator } from "../../../utils/logger";
import { mockNetworkSleep } from "../../../utils/mockUtils";

const moduleLogger = loggerCreator("__filename");

export class MonitorSegmentsApiMock extends MonitorSegmentsApi {
  async list(cdnId: string): Promise<MonitorSegmentsApiResult> {
    await sleep(mockNetworkSleep);
    moduleLogger.debug("Mock List, cdnId: " + cdnId);

    const monitorSegments: Record<string, MonitorSegmentsApiType> = {};
    monitorSegments["0"] = {
      monitoringSegmentId: "Monitor Segment 1",
      healthCollectorSystemIds: [],
    };
    monitorSegments["1"] = {
      monitoringSegmentId: "Monitor Segment 2",
      healthCollectorSystemIds: ["healthCollector2"],
    };
    monitorSegments["2"] = {
      monitoringSegmentId: "Monitor Segment 3",
      healthCollectorSystemIds: [],
    };
    return { monitoringSegments: monitorSegments };
  }

  async update(cdnId: string, entity: MonitorSegmentsApiType) {
    await sleep(mockNetworkSleep);
    moduleLogger.debug("Mock update, id: " + entity.monitoringSegmentId);
    moduleLogger.debug(JSON.stringify(entity));
  }

  async create(cdnId: string, entity: MonitorSegmentsApiType) {
    await sleep(mockNetworkSleep);
    moduleLogger.debug("Mock create: ");
    moduleLogger.debug(JSON.stringify(entity));
  }

  async delete(cdnId: string, monitoringSegmentId: string) {
    await sleep(mockNetworkSleep);
    moduleLogger.debug("Mock delete: " + monitoringSegmentId);
  }

  //region [[ Singleton ]]
  protected static _instance: MonitorSegmentsApiMock | undefined;
  static get instance(): MonitorSegmentsApiMock {
    if (!this._instance) {
      this._instance = new MonitorSegmentsApiMock();
    }

    return this._instance;
  }

  //endregion

  //region [[ Mock config ]]
  private getDefaultMockConfig() {
    return {
      sampleText: "very mock",
    };
  }

  mockConfig: MonitorSegmentsApiMockConfig = this.getDefaultMockConfig();
  //endregion
}

//region [[ Mock config types ]]
interface MonitorSegmentsApiMockConfig {
  sampleText: string;
}

//endregion
