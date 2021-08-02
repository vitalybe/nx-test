import { sleep } from "../../../../utils/sleep";
import { FootprintAssignmentsApi } from "../index";
import {
  FootprintAssignmentsApiResult,
  FootprintAssignmentsApiType,
} from "../_types/footprintAssignmentsTypes";
import { loggerCreator } from "../../../../utils/logger";
import { mockNetworkSleep } from "../../../../utils/mockUtils";

const moduleLogger = loggerCreator("__filename");

export class FootprintAssignmentsApiMock extends FootprintAssignmentsApi {
  async List(): Promise<FootprintAssignmentsApiResult> {
    await sleep(mockNetworkSleep);

    const footprintAssignments: Record<string, FootprintAssignmentsApiType> = {};
    footprintAssignments["0"] = { "footprint-element-id": "0", "assigned-dug": "DUG MOCK 1" };
    footprintAssignments["1"] = { "footprint-element-id": "1", "assigned-dug": "test" };

    return {
      "footprint-assignments": footprintAssignments,
    };
  }

  async ListUnassigned(): Promise<string[]> {
    await sleep(mockNetworkSleep);
    return ["UNASSIGNED MOCK DUG 1", "UNASSIGNED MOCK DUG 2"];
  }

  async Update(assignmentId: string, dugName: string) {
    await sleep(mockNetworkSleep);
    moduleLogger.debug("Mock update, id: " + assignmentId + " dugName: " + dugName);
    moduleLogger.debug(JSON.stringify(assignmentId));
  }

  async Create(dugName: string, footprintId: string) {
    await sleep(mockNetworkSleep);
    moduleLogger.debug("Mock create: ");
    moduleLogger.debug(JSON.stringify(footprintId));
  }

  async Delete(assignmentId: string): Promise<boolean> {
    await sleep(mockNetworkSleep);
    moduleLogger.debug("Mock delete: " + assignmentId);
    return true;
  }

  //region [[ Singleton ]]
  protected static _instance: FootprintAssignmentsApiMock | undefined;
  static get instance(): FootprintAssignmentsApiMock {
    if (!this._instance) {
      this._instance = new FootprintAssignmentsApiMock();
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
  mockConfig: FootprintAssignmentsApiMockConfig = this.getDefaultMockConfig();
  //endregion
}

//region [[ Mock config types ]]
interface FootprintAssignmentsApiMockConfig {
  sampleText: string;
}
//endregion
