import { loggerCreator } from "../../../utils/logger";
import { getOriginForApi } from "../../backendOrigin";
import { combineUrl } from "../../../utils/combineUrl";
import { UrlParams } from "../../_utils/urlParams";
import { Ajax, AjaxMetadata } from "../../../utils/ajax";
import { devToolsStore } from "../../../components/devTools/_stores/devToolsStore";
import { ConfigWorkflowApiMock } from "../../configWorkflow";
import {
  ConfigWorkflowStatusApiResult,
  ConfigWorkflowTriggerApiResult,
} from "../_types/configWorkflowTypes";

const moduleLogger = loggerCreator("__filename");
const BACKEND_URL = combineUrl(getOriginForApi("cdns"), "/api/1.0/");

export class ConfigWorkflowApi {
  protected constructor() {}

  async trigger(cdnName: string): Promise<ConfigWorkflowTriggerApiResult> {
    const path = combineUrl("config-workflow/actions/trigger", cdnName);
    const params = new UrlParams({}).stringified;

    return (await Ajax.postJson(combineUrl(BACKEND_URL, path, params), {})) as ConfigWorkflowTriggerApiResult;
  }

  async status(cdnName: string, metadata: AjaxMetadata): Promise<ConfigWorkflowStatusApiResult> {
    const path = combineUrl("config-workflow/actions/get-status");
    const params = new UrlParams({ cdn: cdnName }).stringified;

    return (await Ajax.getJson(combineUrl(BACKEND_URL, path, params), metadata)) as ConfigWorkflowStatusApiResult;
  }

  //region [[ Singleton ]]
  protected static _instance: ConfigWorkflowApi | undefined;
  static get instance(): ConfigWorkflowApi {
    if (!this._instance) {
      this._instance = !devToolsStore.isMockMode ? new ConfigWorkflowApi() : ConfigWorkflowApiMock.instance;
    }

    return this._instance;
  }
  //endregion
}
