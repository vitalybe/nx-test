import { loggerCreator } from "../../../utils/logger";
import { getOriginForApi } from "../../backendOrigin";
import { combineUrl } from "../../../utils/combineUrl";
import { UrlParams } from "../../_utils/urlParams";
import { Ajax, AjaxMetadata } from "../../../utils/ajax";
import { devToolsStore } from "../../../components/devTools/_stores/devToolsStore";
import { ProvisionFlowsApiMock } from "../../provisionFlows";
import {
  ExecutionStatusApiResult,
  FlowStatusApiResult,
  StepOutputApiResult,
  StepsApiResult,
} from "../_types/provisionFlowsTypes";

const moduleLogger = loggerCreator("__filename");

export enum ProvisionFlowsStepsEnum {
  SNAPSHOT_PREVIEW = "preview",
  SNAPSHOT_REPRESENTATION = "snapshotRepresentation",
  SNAPSHOT_PARCELIZE = "parcelize",

  // The preview of ALL the data that's in the configuration when the step was run
  PREVIEW_OUTPUT_ALL = "preview-representation-context",

  // The preview of the segments chosen by user
  PREVIEW_OUTPUT_APPLIED = "update-representation-context",
}

export class ProvisionFlowsApi {
  async listOperationalSteps(cdnId: string, metadata: AjaxMetadata): Promise<StepsApiResult> {
    const params = new UrlParams({}).stringified;
    const path = combineUrl(getBackendUrl(cdnId), "provision-flows/operational-steps", params);

    const data = await Ajax.getJson(path, metadata);
    return data as StepsApiResult;
  }

  async listStatus(cdnId: string, metadata: AjaxMetadata): Promise<FlowStatusApiResult> {
    const params = new UrlParams({ profiling: true }).stringified;
    const path = combineUrl(getBackendUrl(cdnId), "cdns", cdnId, "provision-flows", params);

    const data = await Ajax.getJson(path, metadata);
    return data as FlowStatusApiResult;
  }

  async listExecutionStatus(cdnId: string, metadata: AjaxMetadata): Promise<ExecutionStatusApiResult> {
    const params = new UrlParams({}).stringified;
    const path = combineUrl(getBackendUrl(cdnId), "debug", "cdns", cdnId, "execution-status", params);

    const data = await Ajax.getJson(path, metadata);
    return data as ExecutionStatusApiResult;
  }

  async listStepOutput(
    cdnId: string,
    flowId: string,
    stepId: string,
    metadata: AjaxMetadata
  ): Promise<StepOutputApiResult> {
    const params = new UrlParams({ profiling: true }).stringified;
    const path = combineUrl(getBackendUrl(cdnId), "cdns", cdnId, "provision-flows", flowId, stepId, params);

    const data = await Ajax.getJson(path, metadata);
    return data as StepOutputApiResult;
  }

  async createActionExecute(cdnId: string, stopAfter: string) {
    const params = new UrlParams({ stopAfter }).stringified;
    const path = combineUrl(getBackendUrl(cdnId), "cdns", cdnId, "provision-flows/actions/execute", params);

    await Ajax.postJson(path, {});
  }

  async createActionResume(cdnId: string, flowId: string, stopAfter: string | undefined, contextIds: string[]) {
    const params = new UrlParams({ stopAfter }).stringified;

    const path = combineUrl(getBackendUrl(cdnId), "cdns", cdnId, "provision-flows", flowId, "actions/resume", params);
    const body = contextIds.length ? { updateContexts: contextIds } : {};

    await Ajax.postJson(path, body);
  }

  async createActionCancel(cdnId: string, flowId: string) {
    const params = new UrlParams({}).stringified;
    const path = combineUrl(getBackendUrl(cdnId), "cdns", cdnId, "provision-flows", flowId, "actions/cancel", params);

    await Ajax.postJson(path, {});
  }

  //region [[ Singleton ]]
  protected static _instance: ProvisionFlowsApi | undefined;
  static get instance(): ProvisionFlowsApi {
    if (!this._instance) {
      this._instance = !devToolsStore.isMockMode ? new ProvisionFlowsApi() : ProvisionFlowsApiMock.instance;
    }

    return this._instance;
  }
  //endregion
}

function getBackendUrl(cdnId: string | undefined): string {
  let prefix = "";
  // Specific for na-e2-cdn in stage
  if (cdnId && ["a655f1e5-975d-4476-8870-507a2cc54b67", "1b9e60d2-c162-4b2c-8747-9fb988944b91"].includes(cdnId)) {
    prefix = "qwtest-";
  } else if (cdnId && ["1724dc11-6596-4354-9a08-e67e9777a4c3"].includes(cdnId)) {
    prefix = "qwprod-";
  } else if (cdnId && ["31be9fd0-f94a-45cc-8971-511380767470"].includes(cdnId)) {
    prefix = "qwcds-";
  }

  return combineUrl(getOriginForApi(prefix + "provision-controller"), "/api/1.0/");
}
