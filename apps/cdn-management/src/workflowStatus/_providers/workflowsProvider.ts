import { loggerCreator } from "@qwilt/common/utils/logger";
import { AjaxMetadata } from "@qwilt/common/utils/ajax";
import { WorkflowEntity, WorkflowStateEnum } from "../_domain/workflowEntity";
import { ProvisionFlowsApi } from "@qwilt/common/backend/provisionFlows";
import { StepEntity, StepStateEnum } from "../_domain/stepEntity";
import { DateTime } from "luxon";
import { ExecutionStatusApiResult, FlowStatusApiType } from "@qwilt/common/backend/provisionFlows/_types/provisionFlowsTypes";
import { Utils } from "@qwilt/common/utils/utils";
import { Notifier } from "@qwilt/common/utils/notifications/notifier";

const moduleLogger = loggerCreator("__filename");

export class WorkflowsProvider {
  private constructor() {}

  private createWorkflowSteps(provisionFlow: FlowStatusApiType): StepEntity[] {
    // IN_PROGRESS - if provision state is "inProgress", the last operationalStep gets this status
    // PAUSED - else if provision state is "inProgressPending", the last operationalStep gets this status
    // STOPPED - else if provision status is "cancelled", the last operationalStep gets this status
    // SUCCESS - else if operationalStep
    // ERROR

    const steps = provisionFlow.operationalSteps.map((operationalStep, i) => {
      const isLast = i === provisionFlow.operationalSteps.length - 1;
      const stepId = operationalStep.name;
      const operationalStepStatus = operationalStep.status;

      let stepState: StepStateEnum;
      if (isLast && provisionFlow.state === "inProgressPending") {
        stepState = StepStateEnum.PAUSED;
      } else if (isLast && provisionFlow.status.flow === "canceled") {
        stepState = StepStateEnum.STOPPED;
      } else if (operationalStepStatus.flow === "success") {
        stepState = StepStateEnum.SUCCESS;
      } else if (operationalStepStatus.flow === "failure") {
        stepState = StepStateEnum.ERROR;
      } else {
        stepState = StepStateEnum.ERROR;
        Notifier.warn(`unexpected operational step: ${operationalStepStatus.flow}`);
      }

      let timestamp: DateTime | undefined;
      if (operationalStep.profiling?.end) {
        timestamp = Utils.getDateTimeFromSecOrMs(operationalStep.profiling.end);
      } else if (provisionFlow.endTime) {
        timestamp = Utils.getDateTimeFromSecOrMs(provisionFlow.endTime);
      } else {
        timestamp = undefined;
      }

      return new StepEntity({
        error: operationalStepStatus.errorLogs ?? undefined,
        state: stepState,
        stepId: stepId,
        timestamp: timestamp,
      });
    });

    if (provisionFlow.state === "inProgress" && provisionFlow.status.currentOperationalStep) {
      steps.push(
        new StepEntity({
          stepId: provisionFlow.status.currentOperationalStep,
          error: undefined,
          state: StepStateEnum.IN_PROGRESS,
          timestamp: undefined,
        })
      );
    }

    return steps;
  }

  private getWorkflowState(
    provisionFlow: FlowStatusApiType,
    executionStatusResult: ExecutionStatusApiResult
  ): WorkflowStateEnum {
    if (executionStatusResult.activeProvisionFlowId === provisionFlow.id) {
      return WorkflowStateEnum.ACTIVE;
    } else {
      switch (provisionFlow.state) {
        case "inProgress":
        // NOTE: inProgress status is assigned to the step
        // eslint-disable-next-line no-fallthrough
        case "inProgressPending":
          return WorkflowStateEnum.IN_PROGRESS;
        case "nonActive":
          return WorkflowStateEnum.NOT_ACTIVE;
        default:
          // NOTE: This currently happens to flows that backend incorrectly reports as active, even though only executionStatusResult
          // holds the true active state.
          return WorkflowStateEnum.NOT_ACTIVE;
      }
    }
  }

  provide = async (
    cdnId: string,
    metadata: AjaxMetadata,
    provisionFlowsApi: ProvisionFlowsApi = ProvisionFlowsApi.instance
  ): Promise<WorkflowEntity[]> => {
    const statusResult = await provisionFlowsApi.listStatus(cdnId, metadata);
    const executionStatusResult = await provisionFlowsApi.listExecutionStatus(cdnId, metadata);

    const workflows = statusResult.provisionFlows
      .map((provisionFlow) => {
        try {
          return new WorkflowEntity({
            id: provisionFlow.id,
            steps: this.createWorkflowSteps(provisionFlow),
            startTime: Utils.getDateTimeFromSecOrMs(provisionFlow.startTime), // provisionFlow.endTime is 0 when flow didn't finish
            endTime: provisionFlow.endTime ? Utils.getDateTimeFromSecOrMs(provisionFlow.endTime) : undefined,
            user: provisionFlow.user,
            state: this.getWorkflowState(provisionFlow, executionStatusResult),
          });
        } catch (e) {
          Notifier.error(`Skipping a workflow entity due to error. ID: ${provisionFlow.id}`, e);
          return undefined;
        }
      })
      .filter(Utils.isTruthy);

    return workflows;
  };

  //region [[ Singleton ]]
  private static _instance: WorkflowsProvider | undefined;
  static get instance(): WorkflowsProvider {
    if (!this._instance) {
      this._instance = new WorkflowsProvider();
    }

    return this._instance;
  }
  //endregion
}
