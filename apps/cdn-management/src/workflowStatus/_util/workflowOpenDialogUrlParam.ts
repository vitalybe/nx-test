import { loggerCreator } from "@qwilt/common/utils/logger";
import { ProjectUrlParams } from "../../_stores/projectUrlParams";
import { ProjectUrlStore } from "../../_stores/projectUrlStore";
import { DiffRequestEntity } from "../representationDiff/_domain/diffRequestEntity";
// noinspection JSUnusedLocalSymbols
const moduleLogger = loggerCreator("__filename");

export class WorkflowOpenDialogUrlParam {
  static clear() {
    ProjectUrlStore.getInstance().removeParam(ProjectUrlParams.openWorkflowDialog);
  }

  static setOpenHistory() {
    const value: OpenHistory = { kind: "history" };
    ProjectUrlStore.getInstance().setParam(ProjectUrlParams.openWorkflowDialog, JSON.stringify(value));
  }

  static getIsOpenHistory(): boolean {
    const param = this.getUrlParam();
    return param?.kind === "history";
  }

  static setOpenDiff(diffRequest: DiffRequestEntity) {
    const serializableRequest: DiffRequestSerializable = {
      kind: "diff",
      cdnId: diffRequest.cdnId,
      leftWorkflowId: diffRequest.leftWorkflow?.id,
      rightWorkflowId: diffRequest.rightWorkflow.id,
      stepId: diffRequest.stepId,
    };

    ProjectUrlStore.getInstance().setParam(ProjectUrlParams.openWorkflowDialog, JSON.stringify(serializableRequest));
  }

  static getOpenDiffRequest(): DiffRequestSerializable | undefined {
    const param = this.getUrlParam();
    return param?.kind === "diff" ? param : undefined;
  }

  private static getUrlParam(): OpenWorkflowUrlParamType | undefined {
    let param: OpenWorkflowUrlParamType | undefined;

    const paramString = ProjectUrlStore.getInstance().getParam(ProjectUrlParams.openWorkflowDialog);
    if (paramString) {
      param = JSON.parse(paramString) as OpenWorkflowUrlParamType;
    }

    return param;
  }

  private constructor() {}
}

export interface DiffRequestSerializable {
  kind: "diff";
  cdnId: string;
  leftWorkflowId: string | undefined;
  rightWorkflowId: string;
  stepId: string;
}

interface OpenHistory {
  kind: "history";
}

type OpenWorkflowUrlParamType = DiffRequestSerializable | OpenHistory;
