import { loggerCreator } from "common/utils/logger";
import { DateTime } from "luxon";
import { ProvisionFlowsStepsEnum } from "common/backend/provisionFlows";

const moduleLogger = loggerCreator(__filename);

export enum StepStateEnum {
  IN_PROGRESS = "IN_PROGRESS",
  PAUSED = "PAUSED",
  SUCCESS = "SUCCESS",
  ERROR = "ERROR",
  STOPPED = "STOPPED",
}

export class StepEntity {
  state!: StepStateEnum;
  timestamp!: DateTime | undefined;
  stepId!: string;
  error!: string | undefined;

  constructor(data: Required<StepEntity>) {
    Object.assign(this, data);
  }

  // Mock
  static createMock(overrides?: Partial<StepEntity>) {
    const timestamp = DateTime.fromISO("2018-10-08T21:00:00.000+03:00");

    return new StepEntity({
      timestamp: timestamp,
      stepId: ProvisionFlowsStepsEnum.SNAPSHOT_REPRESENTATION,
      state: StepStateEnum.SUCCESS,
      error: undefined,
      ...overrides,
    });
  }
}
