/* eslint-disable unused-imports/no-unused-vars */
import { AjaxMetadata } from "common/utils/ajax";
import { sleep } from "common/utils/sleep";
import { QnConfigManagementApi } from "common/backend/qnConfigManagement";
import { loggerCreator } from "common/utils/logger";
import {
  QnConfigHierarchyApiResult,
  QnConfigMappingApiResult,
} from "common/backend/qnConfigManagement/_types/qnConfigManagementTypes";
import { mockNetworkSleep } from "common/utils/mockUtils";

const moduleLogger = loggerCreator(__filename);

export class QnConfigManagementApiMock extends QnConfigManagementApi {
  async hierarchyGet(qnDeploymentId: string, metadata: AjaxMetadata): Promise<QnConfigHierarchyApiResult> {
    await sleep(mockNetworkSleep);
    return {
      hierarchies: [
        {
          mappings: ["f07a8170-8e22-428c-8df4-6e5da25ad8ea"],
          qnDeploymentId: "rgnAmerica_cnUsa_nwkVerizonFios_mktDelaware_stMiddletown_qnHVBSMD2",
          phase: {
            config: {
              fragmentBody: '{"reporter": {"enabled": false}}',
              completeFragmentBody:
                '{\n  "reporter" : {\n    "poll-interval" : 5,\n    "enabled" : false\n  },\n  "uploader" : {\n    "enabled" : true\n  }\n}',
              completeFragmentSourceMapping:
                '{\n  "reporter" : {\n    "poll-interval" : "default",\n    "enabled" : "f07a8170-8e22-428c-8df4-6e5da25ad8ea"\n  },\n  "uploader" : {\n    "enabled" : "00e0156b-3a72-4e49-9161-452172c839b4"\n  }\n}',
            },
          },
          inherits: [
            {
              mappings: ["00e0156b-3a72-4e49-9161-452172c839b4"],
              qnDeploymentId: "rgnAmerica_cnUsa_nwkVerizonFios_mktDelaware",
              phase: {
                config: {
                  fragmentBody: '{"uploader": {"enabled": true}}',
                  completeFragmentBody:
                    '{\n  "reporter" : {\n    "poll-interval" : 5\n  },\n  "uploader" : {\n    "enabled" : true\n  }\n}',
                  completeFragmentSourceMapping:
                    '{\n  "reporter" : {\n    "poll-interval" : "default"\n  },\n  "uploader" : {\n    "enabled" : "00e0156b-3a72-4e49-9161-452172c839b4"\n  }\n}',
                },
              },
              inherits: [
                {
                  mappings: ["default"],
                  qnDeploymentId: null,
                  phase: {
                    config: {
                      fragmentBody: '{"reporter": {"poll-interval": 5}}',
                      completeFragmentBody: '{"reporter": {"poll-interval": 5}}',
                      completeFragmentSourceMapping: '{\n  "reporter" : {\n    "poll-interval" : "default"\n  }\n}',
                    },
                  },
                  inherits: [null],
                },
              ],
            },
          ],
        },
      ],
    };
  }

  async hierarchyDefaultGet(): Promise<QnConfigHierarchyApiResult> {
    await sleep(mockNetworkSleep);
    return {
      hierarchies: [
        {
          mappings: ["default"],
          qnDeploymentId: null,
          phase: {
            config: {
              fragmentBody: '{"reporter": {"poll-interval": 5}}',
              completeFragmentBody: '{"reporter": {"poll-interval": 5}}',
              completeFragmentSourceMapping: '{\n  "reporter" : {\n    "poll-interval" : "default"\n  }\n}',
            },
          },
          inherits: [null],
        },
      ],
    };
  }

  async mappingList(): Promise<QnConfigMappingApiResult> {
    await sleep(mockNetworkSleep);
    return {
      mappings: [
        {
          mappingId: "f07a8170-8e22-428c-8df4-6e5da25ad8ea",
          qnDeploymentId: "rgnDt-man-region_nwkDt-man-network_qnQW0119421146",
          phase: {
            config: {
              fragmentBody: '{"reporter": {"enabled": false}}',
            },
          },
        },
        {
          mappingId: "default",
          qnDeploymentId: null,
          phase: {
            config: {
              fragmentBody: '{"reporter": {"poll-interval": 5}}',
            },
          },
        },
        {
          mappingId: "00e0156b-3a72-4e49-9161-452172c839b4",
          qnDeploymentId: "rgnAmerica_cnUsa_nwkVerizonFios_mktDelaware",
          phase: {
            config: {
              fragmentBody: '{"uploader": {"enabled": true}}',
            },
          },
        },
        {
          mappingId: "3091b76c-8bb9-478d-af3e-68022759aaf8",
          qnDeploymentId: "rgnSystem-test-region_nwkSystem-test-network",
          phase: {
            config: {
              fragmentBody: '{"reporter": {"enabled": false}}',
            },
          },
        },
      ],
    };
  }

  async mappingUpdate() {
    await sleep(mockNetworkSleep);
  }

  async mappingCreate() {
    await sleep(mockNetworkSleep);
  }

  async mappingDelete() {
    await sleep(mockNetworkSleep);
  }

  //region [[ Singleton ]]
  protected static _instance: QnConfigManagementApiMock | undefined;
  static get instance(): QnConfigManagementApiMock {
    if (!this._instance) {
      this._instance = new QnConfigManagementApiMock();
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
  mockConfig: QnConfigManagementApiMockConfig = this.getDefaultMockConfig();
  //endregion
}

//region [[ Mock config types ]]
interface QnConfigManagementApiMockConfig {
  sampleText: string;
}
//endregion
