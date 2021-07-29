import { loggerCreator } from "common/utils/logger";
import { mockUtils } from "common/utils/mockUtils";
import { DateTime } from "luxon";
import { OnlyData } from "common/utils/typescriptUtils";
import { ComponentTypeEnum, SystemUpdateType } from "common/backend/systemEvents/_types/systemEventsTypes";

const moduleLogger = loggerCreator(__filename);

export class SystemUpdateInternalEntity {
  id!: string;
  isCustomerFacing!: boolean;

  affectedQnDeploymentIds!: number[];
  affectedDsIds: string[] | undefined;

  kind!: SystemUpdateType;

  component!: ComponentTypeEnum;

  startTime!: DateTime;
  endTime!: DateTime;

  expectedEffect?: string = "";
  lateArrivals?: DateTime = undefined;
  externalDescription?: string = "";
  internalDescription?: string = "";

  constructor(data: OnlyData<SystemUpdateInternalEntity>) {
    Object.assign(this, data);
  }

  // Mock
  static createMock(overrides?: Partial<SystemUpdateInternalEntity>, id: string = mockUtils.sequentialId().toString()) {
    return new SystemUpdateInternalEntity({
      id: id,
      isCustomerFacing: false,
      affectedQnDeploymentIds: [1],
      component: ComponentTypeEnum.QCP_CONFIGURATION,
      affectedDsIds: undefined,
      startTime: DateTime.local(),
      endTime: DateTime.local().plus({ hour: 1 }),
      kind: "scheduled",
      ...overrides,
    });
  }
}
