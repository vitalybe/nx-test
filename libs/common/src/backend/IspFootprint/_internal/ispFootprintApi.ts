import { loggerCreator } from "common/utils/logger";
import { getOriginForApi } from "common/backend/backendOrigin";
import { combineUrl } from "common/utils/combineUrl";
import { UrlParams } from "common/backend/_utils/urlParams";
import { Ajax, AjaxMetadata } from "common/utils/ajax";
import { devToolsStore } from "common/components/devTools/_stores/devToolsStore";
import { IspFootprintApiMock } from "common/backend/IspFootprint";

const moduleLogger = loggerCreator(__filename);
const BACKEND_URL = combineUrl(getOriginForApi("isp-footprint"), "/");

export class IspFootprintApi {
  protected constructor() {}

  async getDevices(asn: string, source: string, metadata: AjaxMetadata): Promise<string[]> {
    const params = new UrlParams({}).stringified;
    const path = combineUrl(BACKEND_URL, "/devices/", asn + "/", source, params);

    const data = await Ajax.getJson(path, metadata);
    return data as string[];
  }

  async getNetworks(asn: string, metadata: AjaxMetadata): Promise<string[]> {
    const params = new UrlParams({}).stringified;
    const path = combineUrl(BACKEND_URL, "/networks/", asn, params);

    const data = await Ajax.getJson(path, metadata);
    return data as string[];
  }

  //region [[ Singleton ]]
  protected static _instance: IspFootprintApi | undefined;
  static get instance(): IspFootprintApi {
    if (!this._instance) {
      this._instance = !devToolsStore.isMockMode ? new IspFootprintApi() : IspFootprintApiMock.instance;
    }

    return this._instance;
  }
  //endregion
}
