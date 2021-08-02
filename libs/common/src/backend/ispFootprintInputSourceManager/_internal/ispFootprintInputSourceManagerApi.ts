import { loggerCreator } from "common/utils/logger";
import { getOriginForApi } from "common/backend/backendOrigin";
import { combineUrl } from "common/utils/combineUrl";
import { UrlParams } from "common/backend/_utils/urlParams";
import { Ajax, AjaxMetadata } from "common/utils/ajax";
import { devToolsStore } from "common/components/devTools/_stores/devToolsStore";
import { IspFootprintInputSourceManagerApiMock } from "common/backend/ispFootprintInputSourceManager";
import { MockWrapperProxy } from "common/backend/_utils/mockWrapperProxy/mockWrapperProxy";
import {
  BgpInputApiType,
  BgpInputResultApiType,
} from "common/backend/ispFootprintInputSourceManager/_types/ispFootprintInputSourceManagerTypes";

const moduleLogger = loggerCreator(__filename);

const BACKEND_URL = combineUrl(getOriginForApi("isp-footprint-input-source-manager"), `/api/2/input-sources/bgp`);

export class IspFootprintInputSourceManagerApi {
  protected constructor() {}

  async list(metadata: AjaxMetadata): Promise<BgpInputResultApiType> {
    const params = new UrlParams({}).stringified;
    const path = combineUrl(BACKEND_URL, params);

    const result = await Ajax.getJson(path, metadata);

    return result as BgpInputResultApiType;
  }

  async update(id: string, entity: BgpInputApiType): Promise<BgpInputApiType> {
    const params = new UrlParams({}).stringified;
    const path = combineUrl(BACKEND_URL, id, params);

    return (await Ajax.putJson(path, entity)) as BgpInputApiType;
  }

  async create(entity: BgpInputApiType): Promise<BgpInputApiType> {
    const params = new UrlParams({}).stringified;
    const path = combineUrl(BACKEND_URL, params);

    return (await Ajax.postJson(path, entity)) as BgpInputApiType;
  }

  async delete(id: string) {
    const params = new UrlParams({}).stringified;
    const path = combineUrl(BACKEND_URL, id, params);

    await Ajax.deleteJson(path);
  }

  //region [[ Singleton ]]
  protected static _instance: IspFootprintInputSourceManagerApi | undefined;
  static get instance(): IspFootprintInputSourceManagerApi {
    if (!this._instance) {
      const realApi = new IspFootprintInputSourceManagerApi();
      const mockApi = MockWrapperProxy.wrap(realApi, IspFootprintInputSourceManagerApiMock.instance);
      this._instance = !devToolsStore.isMockMode ? realApi : mockApi;
    }

    return this._instance;
  }
  //endregion
}
