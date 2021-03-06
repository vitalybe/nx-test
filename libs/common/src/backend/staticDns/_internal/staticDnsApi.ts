import { loggerCreator } from "../../../utils/logger";
import { getOriginForApi } from "../../backendOrigin";
import { combineUrl } from "../../../utils/combineUrl";
import { UrlParams } from "../../_utils/urlParams";
import { Ajax, AjaxMetadata } from "../../../utils/ajax";
import { devToolsStore } from "../../../components/devTools/_stores/devToolsStore";
import { StaticDnsApiMock } from "../../staticDns";
import { StaticDnsApiResult, StaticDnsEditApiType } from "../_types/staticDnsTypes";
import { MockWrapperProxy } from "../../_utils/mockWrapperProxy/mockWrapperProxy";

const moduleLogger = loggerCreator("__filename");
const BACKEND_URL = combineUrl(getOriginForApi("static-dns"), "/api/1.0/records");

export class StaticDnsApi {
  protected constructor() {}

  async list(metadata: AjaxMetadata = new AjaxMetadata()): Promise<StaticDnsApiResult> {
    const params = new UrlParams({}).stringified;
    const path = combineUrl(BACKEND_URL, params);

    const data = await Ajax.getJson(path, metadata);
    return data as StaticDnsApiResult;
  }

  async update(id: string, entity: StaticDnsEditApiType) {
    const params = new UrlParams({}).stringified;
    const path = combineUrl(BACKEND_URL, id, params);

    await Ajax.putJson(path, entity);
  }

  async create(entity: StaticDnsEditApiType) {
    const params = new UrlParams({}).stringified;
    const path = combineUrl(BACKEND_URL, params);

    await Ajax.postJson(path, entity);
  }

  async delete(id: string) {
    const params = new UrlParams({}).stringified;
    const path = combineUrl(BACKEND_URL, id, params);

    await Ajax.deleteJson(path);
  }

  //region [[ Singleton ]]
  protected static _instance: StaticDnsApi | undefined;
  static get instance(): StaticDnsApi {
    if (!this._instance) {
      const realApi = new StaticDnsApi();
      const mockApi = MockWrapperProxy.wrap(realApi, StaticDnsApiMock.instance);
      this._instance = !devToolsStore.isMockMode ? realApi : mockApi;
    }

    return this._instance;
  }
  //endregion
}
