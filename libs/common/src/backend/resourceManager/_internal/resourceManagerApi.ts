import { loggerCreator } from "common/utils/logger";
import {
  CapacityApiResultType,
  ConfigApiResultType,
  DsgsApiResultType,
} from "common/backend/resourceManager/_types/resourceManagerTypes";
import { getOriginForApi } from "common/backend/backendOrigin";
import { combineUrl } from "common/utils/combineUrl";
import { UrlParams } from "common/backend/_utils/urlParams";
import { Ajax, AjaxMetadata } from "common/utils/ajax";
import { ResourceManagerApiMock } from "common/backend/resourceManager";
import { devToolsStore } from "common/components/devTools/_stores/devToolsStore";

const moduleLogger = loggerCreator(__filename);

const BACKEND_URL = combineUrl(getOriginForApi("resource-mng-config-mng"), "/api/1/");

export class ResourceManagerApi {
  protected constructor() {}

  async getDsgs(from: number, to: number, metadata: AjaxMetadata): Promise<DsgsApiResultType> {
    const params = new UrlParams({ from: from, to: to }).stringified;
    const path = combineUrl(BACKEND_URL, "dsgs/", params);

    const data = await Ajax.getJson(path, metadata);
    return data as DsgsApiResultType;
  }

  async getConfig(
    from: number,
    to: number,
    networkIds: string[],
    metadata: AjaxMetadata
  ): Promise<ConfigApiResultType> {
    const params = new UrlParams({ from: from, to: to, networks: networkIds }).stringified;
    const path = combineUrl(BACKEND_URL, "config/", params);

    const data = await Ajax.getJson(path, metadata);
    return data as ConfigApiResultType;
  }

  async getCapacity(
    from: number,
    to: number,
    networkIds: string[],
    metadata: AjaxMetadata
  ): Promise<CapacityApiResultType> {
    const params = new UrlParams({ from: from, to: to, networks: networkIds }).stringified;
    const path = combineUrl(BACKEND_URL, "capacity/", params);

    const data = await Ajax.getJson(path, metadata);
    return data as CapacityApiResultType;
  }

  //region [[ Singleton ]]
  protected static _instance: ResourceManagerApi | undefined;
  static get instance(): ResourceManagerApi {
    if (!this._instance) {
      this._instance = !devToolsStore.isMockMode ? new ResourceManagerApi() : ResourceManagerApiMock.instance;
    }

    return this._instance;
  }
  //endregion
}
