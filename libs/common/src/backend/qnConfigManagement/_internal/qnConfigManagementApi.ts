import { loggerCreator } from "../../../utils/logger";
import { getOriginForApi } from "../../backendOrigin";
import { combineUrl } from "../../../utils/combineUrl";
import { UrlParams } from "../../_utils/urlParams";
import { Ajax, AjaxMetadata } from "../../../utils/ajax";
import { devToolsStore } from "../../../components/devTools/_stores/devToolsStore";
import { QnConfigManagementApiMock } from "../../qnConfigManagement";
import {
  QnConfigHierarchyApiResult,
  QnConfigMappingApiEditType,
  QnConfigMappingApiResult,
} from "../_types/qnConfigManagementTypes";

const moduleLogger = loggerCreator("__filename");
const BACKEND_URL = combineUrl(getOriginForApi("qn-config-management-api"), "/api/1/");

export class QnConfigManagementApi {
  constructor() {}

  async hierarchyGet(qnDeploymentId: string, metadata: AjaxMetadata): Promise<QnConfigHierarchyApiResult> {
    const params = new UrlParams({ qnDeploymentId: qnDeploymentId }).stringified;
    const path = combineUrl(BACKEND_URL, "config", "hierarchies", params);

    const data = await Ajax.getJson(path, metadata);
    return data as QnConfigHierarchyApiResult;
  }

  async hierarchyDefaultGet(metadata: AjaxMetadata): Promise<QnConfigHierarchyApiResult> {
    const params = new UrlParams({}).stringified;
    const path = combineUrl(BACKEND_URL, "config", "hierarchies", params);

    const data = await Ajax.getJson(path, metadata);
    return data as QnConfigHierarchyApiResult;
  }

  async mappingList(metadata: AjaxMetadata): Promise<QnConfigMappingApiResult> {
    const params = new UrlParams({}).stringified;
    const path = combineUrl(BACKEND_URL, "config", "mappings", params);

    const data = await Ajax.getJson(path, metadata);
    return data as QnConfigMappingApiResult;
  }

  async mappingUpdate(id: string, entity: QnConfigMappingApiEditType) {
    const params = new UrlParams({}).stringified;
    const path = combineUrl(BACKEND_URL, "config", "mappings", id, params);

    await Ajax.putJson(path, entity);
  }

  async mappingCreate(entity: QnConfigMappingApiEditType) {
    const params = new UrlParams({}).stringified;
    const path = combineUrl(BACKEND_URL, "config", "mappings", params);

    await Ajax.postJson(path, entity);
  }

  async mappingDelete(id: string) {
    const params = new UrlParams({}).stringified;
    const path = combineUrl(BACKEND_URL, "config", "mappings", id, params);

    await Ajax.deleteJson(path);
  }

  //region [[ Singleton ]]
  protected static _instance: QnConfigManagementApi | undefined;
  static get instance(): QnConfigManagementApi {
    if (!this._instance) {
      this._instance = !devToolsStore.isMockMode ? new QnConfigManagementApi() : QnConfigManagementApiMock.instance;
    }

    return this._instance;
  }
  //endregion
}
