import { loggerCreator } from "common/utils/logger";
import { getOriginForApi } from "common/backend/backendOrigin";
import { combineUrl } from "common/utils/combineUrl";
import { UrlParams } from "common/backend/_utils/urlParams";
import { Ajax, AjaxMetadata } from "common/utils/ajax";
import { QidRepositoryApiMock } from "common/backend/qidRepository";
import { devToolsStore } from "common/components/devTools/_stores/devToolsStore";
import { QidMetadata } from "common/backend/qidRepository/_types/qidRepositoryTypes";
import { MockWrapperProxy } from "common/backend/_utils/mockWrapperProxy/mockWrapperProxy";

const moduleLogger = loggerCreator(__filename);
const BACKEND_URL = combineUrl(getOriginForApi("qid-repository"), "/api/1/");

export class QidRepositoryApi {
  protected constructor() {}

  async list(metadata: AjaxMetadata): Promise<QidMetadata[]> {
    const params = new UrlParams({}).stringified;
    const path = combineUrl(BACKEND_URL, "qids", params);

    const data = await Ajax.getJson(path, metadata);
    return data as QidMetadata[];
  }

  //region [[ Singleton ]]
  protected static _instance: QidRepositoryApi | undefined;
  static get instance(): QidRepositoryApi {
    if (!this._instance) {
      const realApi = new QidRepositoryApi();
      const mockApi = MockWrapperProxy.wrap(realApi, QidRepositoryApiMock.instance);
      this._instance = !devToolsStore.isMockMode ? realApi : mockApi;
    }

    return this._instance;
  }
  //endregion
}
