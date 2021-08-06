/* eslint-disable unused-imports/no-unused-vars,unused-imports/no-unused-vars */
import { AjaxMetadata } from "../../../utils/ajax";
import { ProvisionFlowsApi, ProvisionFlowsStepsEnum } from "../../provisionFlows";
import {
  ExecutionStatusApiResult,
  FlowStatusApiResult,
  StepOutputApiResult,
  StepsApiResult,
} from "../_types/provisionFlowsTypes";
import { loggerCreator } from "../../../utils/logger";
import { sleep } from "../../../utils/sleep";
import { mockNetworkSleep } from "../../../utils/mockUtils";

const moduleLogger = loggerCreator("__filename");

export class ProvisionFlowsApiMock extends ProvisionFlowsApi {
  async listOperationalSteps(): Promise<StepsApiResult> {
    await sleep(mockNetworkSleep);
    return {
      operationalSteps: ["preview", "snapshotRepresentation", "parcelize", "activate"],
    };
  }

  async listStatus(cdnId: string, metadata: AjaxMetadata): Promise<FlowStatusApiResult> {
    await sleep(mockNetworkSleep);
    return {
      provisionFlows: [
        {
          id: "step-vitalyb-7efbfd22-2b18-4a03-9ec1-bc4a840b2513-20200401-151056",
          user: "mock@mock.com",
          cdnId: "7efbfd22-2b18-4a03-9ec1-bc4a840b2513",
          cdnName: null,
          startTime: 1585753856,
          endTime: 1585753857,
          cqEnv: "royr2",
          stopAfter: "activate",
          status: {
            flow: "success",
            errorLogs: null,
            currentTechnicalStep: null,
            currentOperationalStep: "activate",
            nextOperationalStep: null,
          },
          state: "nonActive",
          operationalSteps: [
            {
              name: "preview",
              status: {
                flow: "success",
                errorLogs: null,
                currentTechnicalStep: null,
                currentOperationalStep: "preview",
                nextOperationalStep: "snapshotRepresentation",
              },
              profiling: {
                start: 1585753857095,
                end: 1585753857106,
                runTime: 0,
              },
            },
            {
              name: "snapshotRepresentation",
              status: {
                flow: "success",
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
            },
            {
              name: "parcelize",
              status: {
                flow: "success",
                errorLogs: null,
                currentTechnicalStep: null,
                currentOperationalStep: null,
                nextOperationalStep: null,
              },
              profiling: {
                start: 1585753857124,
                end: 1585753857124,
                runTime: 0,
              },
            },
            {
              name: "activate",
              status: {
                flow: "success",
                errorLogs: null,
                currentTechnicalStep: null,
                currentOperationalStep: null,
                nextOperationalStep: null,
              },
              profiling: null,
            },
          ],
          technicalSteps: [
            {
              name: "snapshot",
              status: {
                flow: "success",
                errorLogs: null,
                currentTechnicalStep: "snapshot",
                currentOperationalStep: null,
                nextOperationalStep: null,
              },
              profiling: {
                start: 1585753857095,
                end: 1585753857096,
                runTime: 0,
              },
            },
            {
              name: "representation",
              status: {
                flow: "success",
                errorLogs: null,
                currentTechnicalStep: "representation",
                currentOperationalStep: null,
                nextOperationalStep: null,
              },
              profiling: {
                start: 1585753857106,
                end: 1585753857106,
                runTime: 0,
              },
            },
            {
              name: "parcelize",
              status: {
                flow: "success",
                errorLogs: null,
                currentTechnicalStep: null,
                currentOperationalStep: null,
                nextOperationalStep: null,
              },
              profiling: {
                start: 1585753857124,
                end: 1585753857124,
                runTime: 0,
              },
            },
          ],
        },
        {
          id: "step-vitalyb-7efbfd22-2b18-4a03-9ec1-bc4a840b2513-20200401-151057",
          user: "mock@mock.com",
          cdnId: "7efbfd22-2b18-4a03-9ec1-bc4a840b2513",
          cdnName: null,
          startTime: 1585753856,
          endTime: 1585753857,
          cqEnv: "royr2",
          stopAfter: "activate",
          status: {
            flow: "success",
            errorLogs: null,
            currentTechnicalStep: null,
            currentOperationalStep: "activate",
            nextOperationalStep: null,
          },
          state: "nonActive",
          operationalSteps: [
            {
              name: "preview",
              status: {
                flow: "success",
                errorLogs: null,
                currentTechnicalStep: null,
                currentOperationalStep: "preview",
                nextOperationalStep: "snapshotRepresentation",
              },
              profiling: {
                start: 1585753857095,
                end: 1585753857106,
                runTime: 0,
              },
            },
            {
              name: "snapshotRepresentation",
              status: {
                flow: "success",
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
            },
            {
              name: "parcelize",
              status: {
                flow: "success",
                errorLogs: null,
                currentTechnicalStep: null,
                currentOperationalStep: null,
                nextOperationalStep: null,
              },
              profiling: {
                start: 1585753857124,
                end: 1585753857124,
                runTime: 0,
              },
            },
            {
              name: "activate",
              status: {
                flow: "success",
                errorLogs: null,
                currentTechnicalStep: null,
                currentOperationalStep: null,
                nextOperationalStep: null,
              },
              profiling: null,
            },
          ],
          technicalSteps: [
            {
              name: "snapshot",
              status: {
                flow: "success",
                errorLogs: null,
                currentTechnicalStep: "snapshot",
                currentOperationalStep: null,
                nextOperationalStep: null,
              },
              profiling: {
                start: 1585753857095,
                end: 1585753857096,
                runTime: 0,
              },
            },
            {
              name: "representation",
              status: {
                flow: "success",
                errorLogs: null,
                currentTechnicalStep: "representation",
                currentOperationalStep: null,
                nextOperationalStep: null,
              },
              profiling: {
                start: 1585753857106,
                end: 1585753857106,
                runTime: 0,
              },
            },
            {
              name: "parcelize",
              status: {
                flow: "success",
                errorLogs: null,
                currentTechnicalStep: null,
                currentOperationalStep: null,
                nextOperationalStep: null,
              },
              profiling: {
                start: 1585753857124,
                end: 1585753857124,
                runTime: 0,
              },
            },
          ],
        },
        {
          id: "step-vitalyb-7efbfd22-2b18-4a03-9ec1-bc4a840b2513-20200401-151058",
          user: "mock@mock.com",
          cdnId: "7efbfd22-2b18-4a03-9ec1-bc4a840b2513",
          cdnName: null,
          startTime: 1585753856,
          endTime: 1585753857,
          cqEnv: "royr2",
          stopAfter: "activate",
          status: {
            flow: "success",
            errorLogs: null,
            currentTechnicalStep: null,
            currentOperationalStep: "activate",
            nextOperationalStep: null,
          },
          state: "nonActive",
          operationalSteps: [
            {
              name: "preview",
              status: {
                flow: "success",
                errorLogs: null,
                currentTechnicalStep: null,
                currentOperationalStep: "preview",
                nextOperationalStep: "snapshotRepresentation",
              },
              profiling: {
                start: 1585753857095,
                end: 1585753857106,
                runTime: 0,
              },
            },
            {
              name: "snapshotRepresentation",
              status: {
                flow: "success",
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
            },
            {
              name: "parcelize",
              status: {
                flow: "success",
                errorLogs: null,
                currentTechnicalStep: null,
                currentOperationalStep: null,
                nextOperationalStep: null,
              },
              profiling: {
                start: 1585753857124,
                end: 1585753857124,
                runTime: 0,
              },
            },
            {
              name: "activate",
              status: {
                flow: "success",
                errorLogs: null,
                currentTechnicalStep: null,
                currentOperationalStep: null,
                nextOperationalStep: null,
              },
              profiling: null,
            },
          ],
          technicalSteps: [
            {
              name: "snapshot",
              status: {
                flow: "success",
                errorLogs: null,
                currentTechnicalStep: "snapshot",
                currentOperationalStep: null,
                nextOperationalStep: null,
              },
              profiling: {
                start: 1585753857095,
                end: 1585753857096,
                runTime: 0,
              },
            },
            {
              name: "representation",
              status: {
                flow: "success",
                errorLogs: null,
                currentTechnicalStep: "representation",
                currentOperationalStep: null,
                nextOperationalStep: null,
              },
              profiling: {
                start: 1585753857106,
                end: 1585753857106,
                runTime: 0,
              },
            },
            {
              name: "parcelize",
              status: {
                flow: "success",
                errorLogs: null,
                currentTechnicalStep: null,
                currentOperationalStep: null,
                nextOperationalStep: null,
              },
              profiling: {
                start: 1585753857124,
                end: 1585753857124,
                runTime: 0,
              },
            },
          ],
        },
        {
          id: "step-vitalyb-7efbfd22-2b18-4a03-9ec1-bc4a840b2513-20200401-151059",
          user: "mock@mock.com",
          cdnId: "7efbfd22-2b18-4a03-9ec1-bc4a840b2513",
          cdnName: null,
          startTime: 1585753856,
          endTime: 1585753857,
          cqEnv: "royr2",
          stopAfter: "activate",
          status: {
            flow: "success",
            errorLogs: null,
            currentTechnicalStep: null,
            currentOperationalStep: "activate",
            nextOperationalStep: null,
          },
          state: "nonActive",
          operationalSteps: [
            {
              name: "preview",
              status: {
                flow: "success",
                errorLogs: null,
                currentTechnicalStep: null,
                currentOperationalStep: "preview",
                nextOperationalStep: "snapshotRepresentation",
              },
              profiling: {
                start: 1585753857095,
                end: 1585753857106,
                runTime: 0,
              },
            },
            {
              name: "snapshotRepresentation",
              status: {
                flow: "success",
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
            },
            {
              name: "parcelize",
              status: {
                flow: "success",
                errorLogs: null,
                currentTechnicalStep: null,
                currentOperationalStep: null,
                nextOperationalStep: null,
              },
              profiling: {
                start: 1585753857124,
                end: 1585753857124,
                runTime: 0,
              },
            },
            {
              name: "activate",
              status: {
                flow: "success",
                errorLogs: null,
                currentTechnicalStep: null,
                currentOperationalStep: null,
                nextOperationalStep: null,
              },
              profiling: null,
            },
          ],
          technicalSteps: [
            {
              name: "snapshot",
              status: {
                flow: "success",
                errorLogs: null,
                currentTechnicalStep: "snapshot",
                currentOperationalStep: null,
                nextOperationalStep: null,
              },
              profiling: {
                start: 1585753857095,
                end: 1585753857096,
                runTime: 0,
              },
            },
            {
              name: "representation",
              status: {
                flow: "success",
                errorLogs: null,
                currentTechnicalStep: "representation",
                currentOperationalStep: null,
                nextOperationalStep: null,
              },
              profiling: {
                start: 1585753857106,
                end: 1585753857106,
                runTime: 0,
              },
            },
            {
              name: "parcelize",
              status: {
                flow: "success",
                errorLogs: null,
                currentTechnicalStep: null,
                currentOperationalStep: null,
                nextOperationalStep: null,
              },
              profiling: {
                start: 1585753857124,
                end: 1585753857124,
                runTime: 0,
              },
            },
          ],
        },
        {
          id: "step-vitalyb-7efbfd22-2b18-4a03-9ec1-bc4a840b2513-20200401-151060",
          user: "mock@mock.com",
          cdnId: "7efbfd22-2b18-4a03-9ec1-bc4a840b2513",
          cdnName: null,
          startTime: 1585753856,
          endTime: 1585753857,
          cqEnv: "royr2",
          stopAfter: "activate",
          status: {
            flow: "success",
            errorLogs: null,
            currentTechnicalStep: null,
            currentOperationalStep: "activate",
            nextOperationalStep: null,
          },
          state: "nonActive",
          operationalSteps: [
            {
              name: "preview",
              status: {
                flow: "success",
                errorLogs: null,
                currentTechnicalStep: null,
                currentOperationalStep: "preview",
                nextOperationalStep: "snapshotRepresentation",
              },
              profiling: {
                start: 1585753857095,
                end: 1585753857106,
                runTime: 0,
              },
            },
            {
              name: "snapshotRepresentation",
              status: {
                flow: "success",
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
            },
            {
              name: "parcelize",
              status: {
                flow: "success",
                errorLogs: null,
                currentTechnicalStep: null,
                currentOperationalStep: null,
                nextOperationalStep: null,
              },
              profiling: {
                start: 1585753857124,
                end: 1585753857124,
                runTime: 0,
              },
            },
            {
              name: "activate",
              status: {
                flow: "success",
                errorLogs: null,
                currentTechnicalStep: null,
                currentOperationalStep: null,
                nextOperationalStep: null,
              },
              profiling: null,
            },
          ],
          technicalSteps: [
            {
              name: "snapshot",
              status: {
                flow: "success",
                errorLogs: null,
                currentTechnicalStep: "snapshot",
                currentOperationalStep: null,
                nextOperationalStep: null,
              },
              profiling: {
                start: 1585753857095,
                end: 1585753857096,
                runTime: 0,
              },
            },
            {
              name: "representation",
              status: {
                flow: "success",
                errorLogs: null,
                currentTechnicalStep: "representation",
                currentOperationalStep: null,
                nextOperationalStep: null,
              },
              profiling: {
                start: 1585753857106,
                end: 1585753857106,
                runTime: 0,
              },
            },
            {
              name: "parcelize",
              status: {
                flow: "success",
                errorLogs: null,
                currentTechnicalStep: null,
                currentOperationalStep: null,
                nextOperationalStep: null,
              },
              profiling: {
                start: 1585753857124,
                end: 1585753857124,
                runTime: 0,
              },
            },
          ],
        },
        {
          id: "step-vitalyb-7efbfd22-2b18-4a03-9ec1-bc4a840b2513-20200401-151061",
          user: "mock@mock.com",
          cdnId: "7efbfd22-2b18-4a03-9ec1-bc4a840b2513",
          cdnName: null,
          startTime: 1585753856,
          endTime: 1585753857,
          cqEnv: "royr2",
          stopAfter: "activate",
          status: {
            flow: "success",
            errorLogs: null,
            currentTechnicalStep: null,
            currentOperationalStep: "activate",
            nextOperationalStep: null,
          },
          state: "nonActive",
          operationalSteps: [
            {
              name: "preview",
              status: {
                flow: "success",
                errorLogs: null,
                currentTechnicalStep: null,
                currentOperationalStep: "preview",
                nextOperationalStep: "snapshotRepresentation",
              },
              profiling: {
                start: 1585753857095,
                end: 1585753857106,
                runTime: 0,
              },
            },
            {
              name: "snapshotRepresentation",
              status: {
                flow: "success",
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
            },
            {
              name: "parcelize",
              status: {
                flow: "success",
                errorLogs: null,
                currentTechnicalStep: null,
                currentOperationalStep: null,
                nextOperationalStep: null,
              },
              profiling: {
                start: 1585753857124,
                end: 1585753857124,
                runTime: 0,
              },
            },
            {
              name: "activate",
              status: {
                flow: "success",
                errorLogs: null,
                currentTechnicalStep: null,
                currentOperationalStep: null,
                nextOperationalStep: null,
              },
              profiling: null,
            },
          ],
          technicalSteps: [
            {
              name: "snapshot",
              status: {
                flow: "success",
                errorLogs: null,
                currentTechnicalStep: "snapshot",
                currentOperationalStep: null,
                nextOperationalStep: null,
              },
              profiling: {
                start: 1585753857095,
                end: 1585753857096,
                runTime: 0,
              },
            },
            {
              name: "representation",
              status: {
                flow: "success",
                errorLogs: null,
                currentTechnicalStep: "representation",
                currentOperationalStep: null,
                nextOperationalStep: null,
              },
              profiling: {
                start: 1585753857106,
                end: 1585753857106,
                runTime: 0,
              },
            },
            {
              name: "parcelize",
              status: {
                flow: "success",
                errorLogs: null,
                currentTechnicalStep: null,
                currentOperationalStep: null,
                nextOperationalStep: null,
              },
              profiling: {
                start: 1585753857124,
                end: 1585753857124,
                runTime: 0,
              },
            },
          ],
        },
        {
          id: "step-vitalyb-7efbfd22-2b18-4a03-9ec1-bc4a840b2513-20200401-152101",
          user: "mock@mock.com",
          cdnId: "7efbfd22-2b18-4a03-9ec1-bc4a840b2513",
          cdnName: null,
          startTime: 1585754461,
          endTime: 0,
          cqEnv: "royr2",
          stopAfter: "preview",
          status: {
            flow: "success",
            errorLogs: null,
            currentTechnicalStep: "preview",
            currentOperationalStep: "preview",
            nextOperationalStep: "representation",
          },
          state: "inProgressPending",
          operationalSteps: [
            {
              name: "preview",
              status: {
                flow: "success",
                errorLogs: null,
                currentTechnicalStep: null,
                currentOperationalStep: "preview",
                nextOperationalStep: "parcelize",
              },
              profiling: {
                start: 1585754461702,
                end: 1585754461705,
                runTime: 0,
              },
            },
          ],
          technicalSteps: [
            {
              name: "snapshot",
              status: {
                flow: "success",
                errorLogs: null,
                currentTechnicalStep: "snapshot",
                currentOperationalStep: null,
                nextOperationalStep: null,
              },
              profiling: {
                start: 1585754461702,
                end: 1585754461702,
                runTime: 0,
              },
            },
            {
              name: "representation",
              status: {
                flow: "success",
                errorLogs: null,
                currentTechnicalStep: "representation",
                currentOperationalStep: null,
                nextOperationalStep: null,
              },
              profiling: {
                start: 1585754461705,
                end: 1585754461705,
                runTime: 0,
              },
            },
          ],
        },
      ],
    };
  }

  async listExecutionStatus(cdnId: string, metadata: AjaxMetadata): Promise<ExecutionStatusApiResult> {
    await sleep(mockNetworkSleep);
    return {
      cdnId: cdnId,
      runningProvisionFlowId: "123-123",
      activeProvisionFlowId: "123-123",
      lastFailedProvisionFlowId: "123-123",
      locked: false,
      flowRunning: false,
    };
  }

  async listStepOutput(
    cdnId: string,
    flowId: string,
    stepId: string,
    metadata: AjaxMetadata
  ): Promise<StepOutputApiResult> {
    await sleep(mockNetworkSleep);
    if (stepId === ProvisionFlowsStepsEnum.SNAPSHOT_REPRESENTATION) {
      return {
        snapshotRepresentation: {
          status: { flow: "success", errorLogs: "" },
          output: JSON.stringify({
            main: {
              "all-servers": [
                {
                  hostName: "qn-1234-qn-e1-1",
                  id: "14083b32-7e38-4ca4-b6fb-c8fc498c04ac-1",
                  virtualReferenceSystemId: "QW1020252221",
                },
                {
                  hostName: "qn-1234-qn-02-1",
                  id: "17cf214c-d1b3-4e2d-bff4-43e73ce195eb-1",
                  virtualReferenceSystemId: "QW1020012033",
                },
              ],
            },
          }),
        },
      };
    } else if (stepId === ProvisionFlowsStepsEnum.PREVIEW_OUTPUT_APPLIED) {
      return {
        ["representationContext"]: {
          status: { flow: "success", errorLogs: "" },
          output: JSON.stringify(require("./previewMockData.json")),
        },
      };
    } else if (stepId === ProvisionFlowsStepsEnum.PREVIEW_OUTPUT_ALL) {
      return {
        ["representationContext"]: {
          status: { flow: "success", errorLogs: "" },
          output: JSON.stringify(require("./previewMockData.json")),
        },
      };
    } else {
      throw new Error(`Unsupported step ID`);
    }
  }

  async createActionExecute(cdnId: string, stopAfter: string) {
    await sleep(mockNetworkSleep);
  }

  async createActionResume(cdnId: string, flowId: string, stopAfter: string) {
    await sleep(mockNetworkSleep);
  }

  async createActionCancel(cdnId: string, flowId: string) {
    await sleep(mockNetworkSleep);
  }

  //region [[ Singleton ]]
  protected static _instance: ProvisionFlowsApiMock | undefined;
  static get instance(): ProvisionFlowsApiMock {
    if (!this._instance) {
      this._instance = new ProvisionFlowsApiMock();
    }

    return this._instance;
  }
  //endregion
}
