import { loggerCreator } from "../../../utils/logger";
import { getOriginForApi } from "../../backendOrigin";
import { combineUrl } from "../../../utils/combineUrl";
import { UrlParams } from "../../_utils/urlParams";
import { Ajax, AjaxMetadata } from "../../../utils/ajax";
import { devToolsStore } from "../../../components/devTools/_stores/devToolsStore";
import { ContentManagementApiMock } from "../../contentManagement";
import { PurgeRuleApi, PurgeRuleApiEdit } from "../_types/contentManagementTypes";

const moduleLogger = loggerCreator("__filename");
const BACKEND_URL = combineUrl(getOriginForApi("content-management"), "/api/1/content-management/rules/");

export class ContentManagementApi {
  protected constructor() {}

  async list(metadata: AjaxMetadata): Promise<PurgeRuleApi[]> {
    const params = new UrlParams({}).stringified;
    const path = combineUrl(BACKEND_URL, params);

    const data = await Ajax.getJson(path, metadata);
    return data as PurgeRuleApi[];
  }

  async create(entity: PurgeRuleApiEdit) {
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
  protected static _instance: ContentManagementApi | undefined;
  static get instance(): ContentManagementApi {
    if (!this._instance) {
      this._instance = !devToolsStore.isMockMode ? new ContentManagementApi() : ContentManagementApiMock.instance;
    }

    return this._instance;
  }
  //endregion
}
