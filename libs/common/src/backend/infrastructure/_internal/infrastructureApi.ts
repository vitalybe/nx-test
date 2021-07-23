import { loggerCreator } from "common/utils/logger";
import { getOriginForApi } from "common/backend/backendOrigin";
import { combineUrl } from "common/utils/combineUrl";
import { UrlParams } from "common/backend/_utils/urlParams";
import { Ajax, AjaxMetadata } from "common/utils/ajax";
import { devToolsStore } from "common/components/devTools/_stores/devToolsStore";
import { InfrastructureApiMock } from "common/backend/infrastructure";
import { CacheApiResult, InfrastructureResponse } from "common/backend/infrastructure/_types/infrastructureTypes";

const moduleLogger = loggerCreator(__filename);
const BACKEND_URL = combineUrl(getOriginForApi("infrastructure"), "/api/1.0/");

export class InfrastructureApi {
  protected constructor() {}

  async cachesList(cdnId: string, metadata: AjaxMetadata = new AjaxMetadata()): Promise<CacheApiResult> {
    const params = new UrlParams({ cdn: cdnId }).stringified;
    const path = combineUrl(BACKEND_URL, "cdn/caches/", params);

    const data = await Ajax.getJson(path, metadata);
    return data as CacheApiResult;
  }

  async cacheAssignmentCreate(systemId: string, cdnId: string): Promise<InfrastructureResponse> {
    const params = new UrlParams({}).stringified;
    const path = combineUrl(BACKEND_URL, "cache-assignments/", params);

    const data = await Ajax.postJson(path, { systemId, cdn: cdnId });
    return data as InfrastructureResponse;
  }

  async cacheAssignmentDelete(systemId: string): Promise<InfrastructureResponse> {
    const params = new UrlParams({}).stringified;
    const path = combineUrl(BACKEND_URL, `cache-assignments/${systemId}`, params);

    const data = await Ajax.deleteJson(path);
    return data as InfrastructureResponse;
  }

  async cacheAssignmentUpdate(systemId: string, cdnId: string): Promise<InfrastructureResponse> {
    const params = new UrlParams({}).stringified;
    const path = combineUrl(BACKEND_URL, `cache-assignments/${systemId}`, params);

    const data = await Ajax.putJson(path, { cdn: cdnId });
    return data as InfrastructureResponse;
  }

  //region [[ Singleton ]]
  protected static _instance: InfrastructureApi | undefined;
  static get instance(): InfrastructureApi {
    if (!this._instance) {
      this._instance = !devToolsStore.isMockMode ? new InfrastructureApi() : InfrastructureApiMock.instance;
    }

    return this._instance;
  }
  //endregion
}
