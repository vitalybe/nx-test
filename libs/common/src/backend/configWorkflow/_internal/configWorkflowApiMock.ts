/* eslint-disable unused-imports/no-unused-vars */
import { AjaxMetadata } from "common/utils/ajax";
import { sleep } from "common/utils/sleep";
import { ConfigWorkflowApi } from "common/backend/configWorkflow";
import { ConfigWorkflowStatusApiResult } from "common/backend/configWorkflow/_types/configWorkflowTypes";
import { mockNetworkSleep } from "common/utils/mockUtils";

export class ConfigWorkflowApiMock extends ConfigWorkflowApi {
  // SAMPLE
  async status(cdnName: string, metadata: AjaxMetadata): Promise<ConfigWorkflowStatusApiResult> {
    await sleep(mockNetworkSleep);

    return {
      running: null,
      lastSuccess: null,
      lastFailure: {
        id: "step-vitalyb-vitaly-cdn-1-20190805-071120",
        status: "done",
        step: "snapshot",
        timestamp: 1564989094,
        user: "vitalyb@qwilt.com",
        cdn: "vitaly-cdn-1",
      },
    };
  }

  //region [[ Singleton ]]
  protected static _instance: ConfigWorkflowApiMock | undefined;
  static get instance(): ConfigWorkflowApiMock {
    if (!this._instance) {
      this._instance = new ConfigWorkflowApiMock();
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
  mockConfig: ConfigWorkflowApiMockConfig = this.getDefaultMockConfig();
  //endregion
}

//region [[ Mock config types ]]
interface ConfigWorkflowApiMockConfig {
  sampleText: string;
}
//endregion
