import { DateTime } from "luxon";
import { ComponentTypeEnum, SystemUpdateType } from "../../backend/systemEvents/_types/systemEventsTypes";
import { loggerCreator } from "../../utils/logger";
import { OnlyData } from "../../utils/typescriptUtils";
import { mockUtils } from "../../utils/mockUtils";
import { SystemEventExternalEntity } from "./systemEventExternalEntity";

const moduleLogger = loggerCreator("__filename");

export class SystemUpdateExternalEntity {
  id!: string;
  kind!: SystemUpdateType;
  component!: ComponentTypeEnum;
  startTime!: DateTime;
  endTime!: DateTime;
  expectedEffect!: string;
  description?: string;
  systemEvents!: SystemEventExternalEntity[];

  constructor(data: OnlyData<SystemUpdateExternalEntity>) {
    Object.assign(this, data);
  }

  // Mock
  static createMock(overrides?: Partial<SystemUpdateExternalEntity>, id: string = mockUtils.sequentialId().toString()) {
    return new SystemUpdateExternalEntity({
      id: id,
      component: ComponentTypeEnum.QCP_CONFIGURATION,
      startTime: DateTime.local(),
      endTime: DateTime.local().plus({ hour: 1 }),
      kind: "scheduled",
      expectedEffect: "No Effect",
      systemEvents: [SystemEventExternalEntity.createMock()],
      ...overrides,
    });
  }
}
