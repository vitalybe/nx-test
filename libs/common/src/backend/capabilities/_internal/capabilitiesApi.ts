import { loggerCreator } from "../../../utils/logger";
import { getOriginForApi } from "../../backendOrigin";
import { combineUrl } from "../../../utils/combineUrl";
import { UrlParams } from "../../_utils/urlParams";
import { Ajax, AjaxMetadata } from "../../../utils/ajax";
import { devToolsStore } from "../../../components/devTools/_stores/devToolsStore";
import { CapabilitiesApiMock } from "../../capabilities";
import { CapabilitiesApiResult } from "../_types/capabilitiesTypes";
import { MockWrapperProxy } from "../../_utils/mockWrapperProxy/mockWrapperProxy";

const moduleLogger = loggerCreator("__filename");
const BACKEND_URL = combineUrl(getOriginForApi("capabilities-api"), "/api/1/capabilities");

export class CapabilitiesApi {
  protected constructor() {}

  async getCapabilities(metadata: AjaxMetadata, clientType: "sp" | "cp"): Promise<CapabilitiesApiResult> {
    const params = new UrlParams({}).stringified;
    const path = combineUrl(BACKEND_URL, clientType, params);

    const data = await Ajax.getJson(path, metadata);
    return data as CapabilitiesApiResult;
  }
  async spCapabilities(metadata: AjaxMetadata): Promise<CapabilitiesApiResult> {
    return await this.getCapabilities(metadata, "sp");
  }
  async cpCapabilities(metadata: AjaxMetadata): Promise<CapabilitiesApiResult> {
    return await this.getCapabilities(metadata, "cp");
  }

  //region [[ Singleton ]]
  protected static _instance: CapabilitiesApi | undefined;
  static get instance(): CapabilitiesApi {
    if (!this._instance) {
      const realApi = new CapabilitiesApi();
      const mockApi = MockWrapperProxy.wrap(realApi, CapabilitiesApiMock.instance);
      this._instance = !devToolsStore.isMockMode ? realApi : mockApi;
    }

    return this._instance;
  }
  //endregion
}
