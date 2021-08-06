import { loggerCreator } from "../../../../utils/logger";
import { getOriginForApi } from "../../../backendOrigin";
import { combineUrl } from "../../../../utils/combineUrl";
import { UrlParams } from "../../../_utils/urlParams";
import { Ajax, AjaxMetadata } from "../../../../utils/ajax";
import { devToolsStore } from "../../../../components/devTools/_stores/devToolsStore";
import { FootprintElementsApiMock } from "../index";
import {
  FootprintApiType,
  FootprintElementsApiResult,
  FootprintElementsApiType,
} from "../_types/footprintElementsTypes";

const moduleLogger = loggerCreator("__filename");
const BACKEND_URL = combineUrl(getOriginForApi("coverage"), "/api/1.0.0/coverage/config/");

export class FootprintElementsApi {
  protected constructor() {}

  async list(metadata: AjaxMetadata): Promise<FootprintElementsApiResult> {
    const params = new UrlParams({}).stringified;
    const path = combineUrl(BACKEND_URL, "footprint-elements", params);

    const data = await Ajax.getJson(path, metadata);
    return data as FootprintElementsApiResult;
  }

  async update(id: string, entity: FootprintElementsApiType): Promise<boolean> {
    const params = new UrlParams({}).stringified;
    const path = combineUrl(BACKEND_URL, "footprint-elements", id, params);

    const data = await Ajax.putJson(path, entity);
    return data as boolean;
  }

  async create(entity: FootprintElementsApiType): Promise<FootprintApiType | string> {
    const params = new UrlParams({}).stringified;
    const path = combineUrl(BACKEND_URL, "footprint-elements", params);

    const data = Ajax.postJson(path, entity);
    return data as Promise<FootprintApiType | string>;
  }

  async delete(id: string): Promise<boolean> {
    const params = new UrlParams({}).stringified;
    const path = combineUrl(BACKEND_URL, "footprint-elements", id, params);

    const data = await Ajax.deleteJson(path);
    return data as boolean;
  }

  //region [[ Singleton ]]
  protected static _instance: FootprintElementsApi | undefined;
  static get instance(): FootprintElementsApi {
    if (!this._instance) {
      this._instance = !devToolsStore.isMockMode ? new FootprintElementsApi() : FootprintElementsApiMock.instance;
    }

    return this._instance;
  }
  //endregion
}
