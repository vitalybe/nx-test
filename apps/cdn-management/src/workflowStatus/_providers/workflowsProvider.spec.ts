/* eslint-disable unused-imports/no-unused-vars */
import { WorkflowsProvider } from "./workflowsProvider";
import { AjaxMetadata } from "@qwilt/common/utils/ajax";
import { ProvisionFlowsApi } from "@qwilt/common/backend/provisionFlows";
import {
  ExecutionStatusApiResult,
  FlowStatusApiResult,
} from "@qwilt/common/backend/provisionFlows/_types/provisionFlowsTypes";
import { StepStateEnum } from "../_domain/stepEntity";

function createProvisionFlow(data: {
  flowState: "inProgress" | "inProgressPending" | "active" | "nonActive";
  flowStatus: "success" | "failure" | "canceled";
  stepStatuses: ("success" | "failure")[];
  currentOperationalStep?: string | null;
}): FlowStatusApiResult {
  return {
    provisionFlows: [
      {
        id: "step-vitalyb-7efbfd22-2b18-4a03-9ec1-bc4a840b2513-20200401-151056",
        user: "vitalyb@qwilt.com",
        cdnId: "7efbfd22-2b18-4a03-9ec1-bc4a840b2513",
        cdnName: null,
        startTime: 1585753856,
        endTime: 1585753857,
        cqEnv: "royr2",
        stopAfter: "activate",
        status: {
          flow: data.flowStatus,
          errorLogs: null,
          currentOperationalStep: data.currentOperationalStep,
        },
        state: data.flowState,
        operationalSteps: data.stepStatuses.map((stepStatus, i) => ({
          name: `step_${i}`,
          status: {
            flow: stepStatus,
            errorLogs: null,
            currentTechnicalStep: null,
            currentOperationalStep: "snapshotRepresentation",
            nextOperationalStep: "parcelize",
          },
          profiling: {
            start: 1585753857095,
            end: 1585753857106,
            runTime: 0,
          },
        })),
      },
    ],
  };
}

function createExecutionStatus() {
  return {
    activeProvisionFlowId: "1234",
    cdnId: "1235",
    lastFailedProvisionFlowId: "1236",
    runningProvisionFlowId: "1237",
    flowRunning: false,
    locked: false,
  };
}

describe("workflowsProvider", function () {
  it("should return correctly success steps", async function () {
    const provisionFlowsApiMock = new (class extends ProvisionFlowsApi {
      async listStatus(): Promise<FlowStatusApiResult> {
        return createProvisionFlow({
          flowState: "active",
          flowStatus: "success",
          stepStatuses: ["success", "success"],
        });
      }
      async listExecutionStatus(cdnId: string, metadata: AjaxMetadata): Promise<ExecutionStatusApiResult> {
        return createExecutionStatus();
      }
    })();

    const workflows = await WorkflowsProvider.instance.provide("1", new AjaxMetadata(), provisionFlowsApiMock);

    expect(workflows).toHaveLength(1);
    expect(workflows[0].steps).toHaveLength(2);
    expect(workflows[0].steps[0].state).toEqual(StepStateEnum.SUCCESS);
    expect(workflows[0].steps[1].state).toEqual(StepStateEnum.SUCCESS);
  });

  it("should return correctly on error steps", async function () {
    const provisionFlowsApiMock = new (class extends ProvisionFlowsApi {
      async listStatus(): Promise<FlowStatusApiResult> {
        return createProvisionFlow({
          flowState: "active",
          flowStatus: "failure",
          stepStatuses: ["success", "failure"],
        });
      }
      async listExecutionStatus(cdnId: string, metadata: AjaxMetadata): Promise<ExecutionStatusApiResult> {
        return createExecutionStatus();
      }
    })();

    const workflows = await WorkflowsProvider.instance.provide("1", new AjaxMetadata(), provisionFlowsApiMock);

    expect(workflows).toHaveLength(1);
    expect(workflows[0].steps).toHaveLength(2);
    expect(workflows[0].steps[0].state).toEqual(StepStateEnum.SUCCESS);
    expect(workflows[0].steps[1].state).toEqual(StepStateEnum.ERROR);
  });

  it("should return correctly on in progress", async function () {
    const provisionFlowsApiMock = new (class extends ProvisionFlowsApi {
      async listStatus(): Promise<FlowStatusApiResult> {
        return createProvisionFlow({
          flowState: "inProgress",
          flowStatus: "success",
          currentOperationalStep: "parcelize",
          stepStatuses: ["success"],
        });
      }
      async listExecutionStatus(cdnId: string, metadata: AjaxMetadata): Promise<ExecutionStatusApiResult> {
        return createExecutionStatus();
      }
    })();

    const workflows = await WorkflowsProvider.instance.provide("1", new AjaxMetadata(), provisionFlowsApiMock);

    expect(workflows).toHaveLength(1);
    expect(workflows[0].steps).toHaveLength(2);
    expect(workflows[0].steps[0].state).toEqual(StepStateEnum.SUCCESS);
    expect(workflows[0].steps[1].state).toEqual(StepStateEnum.IN_PROGRESS);
  });

  it("should return correctly on cancellation", async function () {
    const provisionFlowsApiMock = new (class extends ProvisionFlowsApi {
      async listStatus(): Promise<FlowStatusApiResult> {
        return createProvisionFlow({
          flowState: "nonActive",
          flowStatus: "canceled",
          stepStatuses: ["success", "success"],
        });
      }
      async listExecutionStatus(cdnId: string, metadata: AjaxMetadata): Promise<ExecutionStatusApiResult> {
        return createExecutionStatus();
      }
    })();

    const workflows = await WorkflowsProvider.instance.provide("1", new AjaxMetadata(), provisionFlowsApiMock);

    expect(workflows).toHaveLength(1);
    expect(workflows[0].steps).toHaveLength(2);
    expect(workflows[0].steps[0].state).toEqual(StepStateEnum.SUCCESS);
    expect(workflows[0].steps[1].state).toEqual(StepStateEnum.STOPPED);
  });
});
