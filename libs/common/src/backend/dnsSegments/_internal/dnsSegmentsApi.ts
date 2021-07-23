import { loggerCreator } from "common/utils/logger";
import { getOriginForApi } from "common/backend/backendOrigin";
import { combineUrl } from "common/utils/combineUrl";
import { UrlParams } from "common/backend/_utils/urlParams";
import { Ajax } from "common/utils/ajax";
import { devToolsStore } from "common/components/devTools/_stores/devToolsStore";
import { DnsSegmentsApiMock } from "common/backend/dnsSegments";
import { DnsSegmentsApiResult, DnsSegmentsApiType } from "common/backend/dnsSegments/_types/dnsSegmentsTypes";
import { MockWrapperProxy } from "common/backend/_utils/mockWrapperProxy/mockWrapperProxy";

const moduleLogger = loggerCreator(__filename);
const BACKEND_URL = combineUrl(getOriginForApi("cdns"), "/api/1/cdns");

export class DnsSegmentsApi {
  protected constructor() {}

  async list(cdnId: string): Promise<DnsSegmentsApiResult> {
    const params = new UrlParams({}).stringified;
    const path = combineUrl(BACKEND_URL, cdnId, params);

    const data = await Ajax.getJson(path + "/dns-routing-segments");
    return data as DnsSegmentsApiResult;
  }

  async update(cdnId: string, entity: DnsSegmentsApiType) {
    const params = new UrlParams({}).stringified;
    const path = combineUrl(BACKEND_URL, cdnId, params);

    await Ajax.putJson(path + "/dns-routing-segments/" + entity.dnsRoutingSegmentId, entity);
  }

  async create(cdnId: string, entity: DnsSegmentsApiType) {
    const params = new UrlParams({}).stringified;
    const path = combineUrl(BACKEND_URL, cdnId, params);

    await Ajax.postJson(path + "/dns-routing-segments/", entity);
  }

  async delete(cdnId: string, dnsRoutingSegmentId: string) {
    const params = new UrlParams({}).stringified;
    const path = combineUrl(BACKEND_URL, cdnId, params);

    await Ajax.deleteJson(path + "/dns-routing-segments/" + dnsRoutingSegmentId);
  }

  //region [[ Singleton ]]
  protected static _instance: DnsSegmentsApi | undefined;
  static get instance(): DnsSegmentsApi {
    if (!this._instance) {
      const realApi = new DnsSegmentsApi();
      const mockApi = MockWrapperProxy.wrap(realApi, DnsSegmentsApiMock.instance);
      this._instance = !devToolsStore.isMockMode ? realApi : mockApi;
    }
    return this._instance;
  }

  //endregion
}
