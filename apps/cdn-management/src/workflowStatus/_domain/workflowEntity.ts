import { loggerCreator } from "@qwilt/common/utils/logger";
import { mockUtils } from "@qwilt/common/utils/mockUtils";
import { StepEntity, StepStateEnum } from "./stepEntity";
import { DateTime } from "luxon";
import { ProvisionFlowsStepsEnum } from "@qwilt/common/backend/provisionFlows";

const moduleLogger = loggerCreator("__filename");

export enum WorkflowStateEnum {
  IN_PROGRESS = "In Progress",
  ACTIVE = "Active",
  NOT_ACTIVE = "Not Active",
}

export class WorkflowEntity {
  id!: string;
  user!: string;
  state!: WorkflowStateEnum;
  steps!: StepEntity[];
  startTime!: DateTime;
  endTime!: DateTime | undefined;

  constructor(data: Required<WorkflowEntity>) {
    Object.assign(this, data);
  }

  // Mock
  static createMock(overrides?: Partial<WorkflowEntity>, id: number = mockUtils.sequentialId()) {
    const timestamp = DateTime.fromISO("2018-10-08T21:00:00.000+03:00");

    return new WorkflowEntity({
      id: id.toString(),
      user: "ShmulikA",
      state: WorkflowStateEnum.IN_PROGRESS,
      startTime: timestamp,
      endTime: undefined,
      steps: [
        {
          state: StepStateEnum.SUCCESS,
          timestamp: timestamp.plus({ minutes: 5 }),
          stepId: ProvisionFlowsStepsEnum.SNAPSHOT_REPRESENTATION,
          error: undefined,
        },
        {
          state: StepStateEnum.IN_PROGRESS,
          timestamp: timestamp,
          stepId: ProvisionFlowsStepsEnum.SNAPSHOT_PARCELIZE,
          error: undefined,
        },
      ],
      ...overrides,
    });
  }
}
