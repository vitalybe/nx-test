import { loggerCreator } from "../../../../utils/logger";
import { getOriginForApi } from "../../../backendOrigin";
import { combineUrl } from "../../../../utils/combineUrl";
import { UrlParams } from "../../../_utils/urlParams";
import { Ajax } from "../../../../utils/ajax";
import { devToolsStore } from "../../../../components/devTools/_stores/devToolsStore";
import { FootprintAssignmentsApiMock } from "../index";
import { FootprintAssignmentsApiResult } from "../_types/footprintAssignmentsTypes";

const moduleLogger = loggerCreator("__filename");
const BACKEND_URL = combineUrl(getOriginForApi("coverage"), "/api/1.0.0/coverage/config/");

export class FootprintAssignmentsApi {
  protected constructor() {}

  async List(): Promise<FootprintAssignmentsApiResult> {
    const params = new UrlParams({}).stringified;
    const path = combineUrl(BACKEND_URL, "assignments", params);

    const data = await Ajax.getJson(path);
    return data as FootprintAssignmentsApiResult;
  }

  async ListUnassigned(): Promise<string[]> {
    const params = new UrlParams({}).stringified;
    const path = combineUrl(BACKEND_URL, "unassigned", params);

    const data = await Ajax.getJson(path);
    return data as string[];
  }

  async Update(assignmentId: string, dugName: string) {
    const params = new UrlParams({ "dug-name": dugName }).stringified;
    const path = combineUrl(BACKEND_URL, "assignments", assignmentId, params);

    await Ajax.patchJson(path, {});
  }

  async Create(dugName: string, footprintId: string) {
    const params = new UrlParams({ "dug-name": dugName, "ref-footprint-element-id": footprintId }).stringified;
    const path = combineUrl(BACKEND_URL, "assignments", params);

    await Ajax.postJson(path, {});
  }

  async Delete(assignmentId: string): Promise<boolean> {
    const params = new UrlParams({}).stringified;
    const path = combineUrl(BACKEND_URL, "assignments", assignmentId, params);

    await Ajax.deleteJson(path);
    return true;
  }

  //region [[ Singleton ]]
  protected static _instance: FootprintAssignmentsApi | undefined;
  static get instance(): FootprintAssignmentsApi {
    if (!this._instance) {
      this._instance = !devToolsStore.isMockMode ? new FootprintAssignmentsApi() : FootprintAssignmentsApiMock.instance;
    }

    return this._instance;
  }
  //endregion
}
