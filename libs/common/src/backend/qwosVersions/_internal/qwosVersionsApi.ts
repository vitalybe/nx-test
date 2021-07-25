import { loggerCreator } from "common/utils/logger";
import { getOriginForApi } from "common/backend/backendOrigin";
import { combineUrl } from "common/utils/combineUrl";
import { UrlParams } from "common/backend/_utils/urlParams";
import { Ajax, AjaxMetadata } from "common/utils/ajax";
import { devToolsStore } from "common/components/devTools/_stores/devToolsStore";
import { QwosVersionsApiResult } from "common/backend/qwosVersions/_types/qwosVersionsTypes";
import { QwosVersionsApiMock } from "./qwosVersionsApiMock";

const moduleLogger = loggerCreator(__filename);
const BACKEND_URL = combineUrl(getOriginForApi("deployment-data-adapter"), "/api/1/systems/");

export class QwosVersionsApi {
  protected constructor() {}

  //region Servers
  async listSystems(metadata: AjaxMetadata): Promise<QwosVersionsApiResult> {
    // eslint-disable-next-line unused-imports/no-unused-vars
    const params = new UrlParams({}).stringified;

    const data = await Ajax.getJson(BACKEND_URL, metadata);
    return data as QwosVersionsApiResult;
  }
  //endregion Servers

  //region [[ Singleton ]]
  protected static _instance: QwosVersionsApi | undefined;
  static get instance(): QwosVersionsApi {
    if (!this._instance) {
      this._instance = !devToolsStore.isMockMode ? new QwosVersionsApi() : QwosVersionsApiMock.instance;
    }

    return this._instance;
  }
  //endregion
}
