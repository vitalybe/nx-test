import { loggerCreator } from "../../../utils/logger";
import { getOriginForApi } from "../../backendOrigin";
import { combineUrl } from "../../../utils/combineUrl";
import { ParamValue, UrlParams } from "../../_utils/urlParams";
import { Ajax, AjaxMetadata } from "../../../utils/ajax";
import { devToolsStore } from "../../../components/devTools/_stores/devToolsStore";
import { SystemEventsExternalApiMock } from "../../systemEvents";
import {
  SystemEventsApiResult,
  SystemUpdatesExternalResult,
  SystemEventsExternalSearchParams,
} from "../_types/systemEventsTypes";

const moduleLogger = loggerCreator("__filename");
const BACKEND_URL = combineUrl(getOriginForApi("system-updates"), "/api/1");

export class SystemEventsExternalApi {
  protected constructor() {}

  async listSystemUpdates(
    metadata: AjaxMetadata,
    searchParams: SystemEventsExternalSearchParams = {}
  ): Promise<SystemUpdatesExternalResult> {
    const params = new UrlParams(searchParams).stringified;
    const path = combineUrl(BACKEND_URL, "system-updates", params);

    const data = await Ajax.getJson(path, metadata);
    return data as SystemUpdatesExternalResult;
  }

  async listSystemEvents(
    metadata: AjaxMetadata,
    params: string | { [key: string]: ParamValue } = {}
  ): Promise<SystemEventsApiResult> {
    const urlParams = new UrlParams(params).stringified;
    const path = combineUrl(BACKEND_URL, "system-events", urlParams);

    const data = await Ajax.getJson(path, metadata);
    return data as SystemEventsApiResult;
  }

  //region [[ Singleton ]]
  protected static _instance: SystemEventsExternalApi | undefined;
  static get instance(): SystemEventsExternalApi {
    if (!this._instance) {
      this._instance = !devToolsStore.isMockMode ? new SystemEventsExternalApi() : SystemEventsExternalApiMock.instance;
    }

    return this._instance;
  }
  //endregion
}
