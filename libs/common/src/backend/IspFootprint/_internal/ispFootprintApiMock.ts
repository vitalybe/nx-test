/* eslint-disable unused-imports/no-unused-vars,unused-imports/no-unused-vars */
import { AjaxMetadata } from "common/utils/ajax";
import { sleep } from "common/utils/sleep";

import { loggerCreator } from "common/utils/logger";
import { IspFootprintApi } from "common/backend/IspFootprint";
import { mockNetworkSleep } from "common/utils/mockUtils";

const moduleLogger = loggerCreator(__filename);

export class IspFootprintApiMock extends IspFootprintApi {
  async getNetworks(asn: string, metadata: AjaxMetadata): Promise<string[]> {
    await sleep(mockNetworkSleep);

    return ["verizon_11"];
  }

  async getDevices(asn: string, source: string, metadata: AjaxMetadata): Promise<string[]> {
    await sleep(mockNetworkSleep);

    return ["bla"];
  }

  //region [[ Singleton ]]
  protected static _instance: IspFootprintApiMock | undefined;
  static get instance(): IspFootprintApiMock {
    if (!this._instance) {
      this._instance = new IspFootprintApiMock();
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
  mockConfig: IspFootprintApiMockConfig = this.getDefaultMockConfig();
  //endregion
}

//region [[ Mock config types ]]
interface IspFootprintApiMockConfig {
  sampleText: string;
}
//endregion
