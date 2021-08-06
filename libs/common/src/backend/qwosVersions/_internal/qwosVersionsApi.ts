import { loggerCreator } from "../../../utils/logger";
import { getOriginForApi } from "../../backendOrigin";
import { combineUrl } from "../../../utils/combineUrl";
import { UrlParams } from "../../_utils/urlParams";
import { Ajax, AjaxMetadata } from "../../../utils/ajax";
import { devToolsStore } from "../../../components/devTools/_stores/devToolsStore";
import { QwosVersionsApiResult } from "../_types/qwosVersionsTypes";
import { QwosVersionsApiMock } from "./qwosVersionsApiMock";

const moduleLogger = loggerCreator("__filename");
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
