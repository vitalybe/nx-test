import { loggerCreator } from "../../../utils/logger";
import { getOriginForApi } from "../../backendOrigin";
import { combineUrl } from "../../../utils/combineUrl";
import { UrlParams } from "../../_utils/urlParams";
import { Ajax, AjaxMetadata } from "../../../utils/ajax";
import { devToolsStore } from "../../../components/devTools/_stores/devToolsStore";
import { AuditLogApiMock } from "../../auditLog";
import { AuditLogApiRequest, AuditLogApiResult } from "../_types/auditLogTypes";
import { MockWrapperProxy } from "../../_utils/mockWrapperProxy/mockWrapperProxy";

const moduleLogger = loggerCreator("__filename");
const BACKEND_URL = combineUrl(getOriginForApi("audit-log"), "/api/1/");

export class AuditLogApi {
  protected constructor() {}

  async listRecords(metadata: AjaxMetadata, options: AuditLogApiRequest): Promise<AuditLogApiResult> {
    const params = new UrlParams({ ...options }).stringified;
    const path = combineUrl(BACKEND_URL, "records", params);

    const data = await Ajax.getJson(path, metadata);
    return data as AuditLogApiResult;
  }

  //region [[ Singleton ]]
  protected static _instance: AuditLogApi | undefined;
  static get instance(): AuditLogApi {
    if (!this._instance) {
      const realApi = new AuditLogApi();
      const mockApi = MockWrapperProxy.wrap(realApi, AuditLogApiMock.instance);
      this._instance = !devToolsStore.isMockMode ? realApi : mockApi;
    }

    return this._instance;
  }
  //endregion
}
