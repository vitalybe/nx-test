import { loggerCreator } from "../../../utils/logger";
import { getOriginForApi } from "../../backendOrigin";
import { combineUrl } from "../../../utils/combineUrl";
import { UrlParams } from "../../_utils/urlParams";
import { Ajax, AjaxMetadata } from "../../../utils/ajax";
import { devToolsStore } from "../../../components/devTools/_stores/devToolsStore";
import { MonitorSegmentsApiMock } from "../../monitorSegments";
import {
  MonitorSegmentsApiResult,
  MonitorSegmentsApiType,
} from "../_types/monitorSegmentsTypes";
import { MockWrapperProxy } from "../../_utils/mockWrapperProxy/mockWrapperProxy";

const moduleLogger = loggerCreator("__filename");
const BACKEND_URL = combineUrl(getOriginForApi("cdns"), "/api/1/cdns");

export class MonitorSegmentsApi {
  protected constructor() {}

  async list(cdnId: string): Promise<MonitorSegmentsApiResult> {
    const params = new UrlParams({}).stringified;
    const path = combineUrl(BACKEND_URL, cdnId, params);

    const data = await Ajax.getJson(path + "/monitoring-segments", new AjaxMetadata());
    return data as MonitorSegmentsApiResult;
  }

  async update(cdnId: string, entity: MonitorSegmentsApiType) {
    const params = new UrlParams({}).stringified;
    const path = combineUrl(BACKEND_URL, cdnId, params);

    await Ajax.putJson(path + "/monitoring-segments/" + entity.monitoringSegmentId, entity);
  }

  async create(cdnId: string, entity: MonitorSegmentsApiType) {
    const params = new UrlParams({}).stringified;
    const path = combineUrl(BACKEND_URL, cdnId, params);

    await Ajax.postJson(path + "/monitoring-segments/", entity);
  }

  async delete(cdnId: string, monitoringSegmentId: string) {
    const params = new UrlParams({}).stringified;
    const path = combineUrl(BACKEND_URL, cdnId, params);

    await Ajax.deleteJson(path + "/monitoring-segments/" + monitoringSegmentId);
  }

  //region [[ Singleton ]]
  protected static _instance: MonitorSegmentsApi | undefined;
  static get instance(): MonitorSegmentsApi {
    if (!this._instance) {
      const realApi = new MonitorSegmentsApi();
      const mockApi = MockWrapperProxy.wrap(realApi, MonitorSegmentsApiMock.instance);
      this._instance = !devToolsStore.isMockMode ? realApi : mockApi;
    }
    return this._instance;
  }

  //endregion
}
