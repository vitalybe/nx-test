import { loggerCreator } from "@qwilt/common/utils/logger";
import { WorkflowEntity } from "../../_domain/workflowEntity";
import { ProvisionFlowsStepsEnum } from "@qwilt/common/backend/provisionFlows";

const moduleLogger = loggerCreator("__filename");

export class DiffRequestEntity {
  cdnId!: string;
  leftWorkflow!: WorkflowEntity | undefined;
  rightWorkflow!: WorkflowEntity;
  stepId!: string;

  constructor(data: Required<DiffRequestEntity>) {
    Object.assign(this, data);
  }

  // Mock
  static createMock(overrides?: Partial<DiffRequestEntity>) {
    return new DiffRequestEntity({
      cdnId: "1",
      leftWorkflow: WorkflowEntity.createMock(),
      rightWorkflow: WorkflowEntity.createMock(),
      stepId: ProvisionFlowsStepsEnum.SNAPSHOT_REPRESENTATION,

      ...overrides,
    });
  }
}
