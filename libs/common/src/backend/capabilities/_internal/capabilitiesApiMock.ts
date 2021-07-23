/* eslint-disable unused-imports/no-unused-vars */
import { mockNetworkSleep } from "../../../utils/mockUtils";
import { sleep } from "../../../utils/sleep";
import { CapabilitiesApi } from "../../capabilities";
import { CapabilitiesApiResult, CapabilitiesEnum } from "../_types/capabilitiesTypes";
import { loggerCreator } from "../../../utils/logger";

// noinspection JSUnusedLocalSymbols
const moduleLogger = loggerCreator("__filename");

export class CapabilitiesApiMock implements CapabilitiesApi {
  async cpCapabilities(): Promise<CapabilitiesApiResult> {
    return await this.getCapabilities();
  }

  async spCapabilities(): Promise<CapabilitiesApiResult> {
    return await this.getCapabilities();
  }

  async getCapabilities(): Promise<CapabilitiesApiResult> {
    await sleep(mockNetworkSleep);

    return [
      {
        id: CapabilitiesEnum.HTTP_ERROR_CACHED_NOT_CACHED,
        allowed: true,
      },
      {
        id: CapabilitiesEnum.SPECIFIC_HTTP_STATUS_CODE,
        allowed: true,
      },
    ];
  }

  //region [[ Singleton ]]
  protected static _instance: CapabilitiesApiMock | undefined;
  static get instance(): CapabilitiesApiMock {
    if (!this._instance) {
      this._instance = new CapabilitiesApiMock();
    }

    return this._instance;
  }
  //endregion
}

//region [[ Mock config types ]]
interface CapabilitiesApiMockConfig {
  sampleText: string;
}
//endregion
