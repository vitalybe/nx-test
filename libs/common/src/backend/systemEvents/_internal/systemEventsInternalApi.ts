import { loggerCreator } from "../../../utils/logger";
import { getOriginForApi } from "../../backendOrigin";
import { combineUrl } from "../../../utils/combineUrl";
import { UrlParams } from "../../_utils/urlParams";
import { Ajax, AjaxMetadata } from "../../../utils/ajax";
import { devToolsStore } from "../../../components/devTools/_stores/devToolsStore";
import { SystemEventsInternalApiMock } from "../../systemEvents";
import {
  SystemUpdateInternalApiPayloadType,
  SystemUpdatesInternalResult,
} from "../_types/systemEventsTypes";

const moduleLogger = loggerCreator("__filename");
const BACKEND_URL = combineUrl(getOriginForApi("system-updates"), "/api/1");

export class SystemEventsInternalApi {
  protected constructor() {}

  async listSystemUpdates(metadata: AjaxMetadata): Promise<SystemUpdatesInternalResult> {
    const path = combineUrl(BACKEND_URL, "ops", "system-updates");

    const data = await Ajax.getJson(path, metadata);
    return data as SystemUpdatesInternalResult;
  }

  async updateSystemUpdates(
    id: string,
    entity: SystemUpdateInternalApiPayloadType
  ): Promise<SystemUpdatesInternalResult> {
    const params = new UrlParams({ updateId: id }).stringified;
    const path = combineUrl(BACKEND_URL, "ops", "system-updates", params);

    const result = await Ajax.putJson(path, entity);
    return result as Promise<SystemUpdatesInternalResult>;
  }

  async createSystemUpdate(entity: SystemUpdateInternalApiPayloadType): Promise<SystemUpdatesInternalResult> {
    const params = new UrlParams({}).stringified;
    const path = combineUrl(BACKEND_URL, "ops", "system-updates", params);

    const result = await Ajax.postJson(path, entity);
    return result as Promise<SystemUpdatesInternalResult>;
  }

  async deleteSystemUpdate(id: string) {
    const params = new UrlParams({ updateIds: id }).stringified;
    const path = combineUrl(BACKEND_URL, "ops", "system-updates", params);

    await Ajax.deleteJson(path);
  }

  //region [[ Singleton ]]
  protected static _instance: SystemEventsInternalApi | undefined;
  static get instance(): SystemEventsInternalApi {
    if (!this._instance) {
      this._instance = !devToolsStore.isMockMode ? new SystemEventsInternalApi() : SystemEventsInternalApiMock.instance;
    }

    return this._instance;
  }
  //endregion
}
