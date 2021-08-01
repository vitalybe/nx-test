import * as _ from "lodash";
import { loggerCreator } from "@qwilt/common/utils/logger";
import { AjaxMetadata } from "@qwilt/common/utils/ajax";
import { WorkflowsProvider } from "./workflowsProvider";
import { WorkflowEntity, WorkflowStateEnum } from "../_domain/workflowEntity";

const moduleLogger = loggerCreator("__filename");

export class ActiveWorkflowProvider {
  private constructor() {}

  provide = async (cdnId: string, metadata: AjaxMetadata): Promise<WorkflowEntity | undefined> => {
    let activeWorkflow: WorkflowEntity | undefined;

    const workflows = await WorkflowsProvider.instance.provide(cdnId, metadata);

    const activeWorkflows = workflows.filter((workflow) => workflow.state === WorkflowStateEnum.ACTIVE);
    if (activeWorkflows.length > 0) {
      const activeWorkflowsByEndTime = _.orderBy(
        activeWorkflows,
        (workflow) => workflow.endTime?.toSeconds() ?? 0,
        "desc"
      );
      activeWorkflow = activeWorkflowsByEndTime[0];
    }

    return activeWorkflow;
  };

  //region [[ Singleton ]]
  private static _instance: ActiveWorkflowProvider | undefined;
  static get instance(): ActiveWorkflowProvider {
    if (!this._instance) {
      this._instance = new ActiveWorkflowProvider();
    }

    return this._instance;
  }
  //endregion
}
