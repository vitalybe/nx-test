import { loggerCreator } from "common/utils/logger";
import { getOriginForApi } from "common/backend/backendOrigin";
import { combineUrl } from "common/utils/combineUrl";
import { UrlParams } from "common/backend/_utils/urlParams";
import { Ajax, AjaxMetadata } from "common/utils/ajax";
import { devToolsStore } from "common/components/devTools/_stores/devToolsStore";
import { AuditLogApiMock } from "common/backend/auditLog";
import { AuditLogApiRequest, AuditLogApiResult } from "common/backend/auditLog/_types/auditLogTypes";
import { MockWrapperProxy } from "common/backend/_utils/mockWrapperProxy/mockWrapperProxy";

const moduleLogger = loggerCreator(__filename);
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
