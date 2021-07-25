import { DateTime } from "luxon";
import {
  ComponentTypeEnum,
  SystemUpdateType,
  SystemUpdateTypeEnum,
} from "common/backend/systemEvents/_types/systemEventsTypes";
import { loggerCreator } from "common/utils/logger";
import { OnlyData } from "common/utils/typescriptUtils";
import { mockUtils } from "common/utils/mockUtils";

const moduleLogger = loggerCreator(__filename);

export class SystemEventExternalEntity {
  id!: string;
  update!: string;
  dateTime!: DateTime;
  qnId!: string;
  qnName!: string;
  type!: SystemUpdateType;
  component!: string;
  description?: string;
  impact?: string;

  constructor(data: OnlyData<SystemEventExternalEntity>) {
    Object.assign(this, data);
  }

  // Mock
  static createMock(overrides?: Partial<SystemEventExternalEntity>, id: string = mockUtils.sequentialId().toString()) {
    return new SystemEventExternalEntity({
      update: "902af79c-5f0c-4d0f-b76d-45c788bd344b",
      id: id,
      qnId: "systemId0",
      qnName: "QN-0",
      dateTime: DateTime.fromSeconds(1593595619),
      component: ComponentTypeEnum.QCP_VERSION,
      type: SystemUpdateTypeEnum.SCHEDULED,
      impact: "No effect 1",
      description: "QCP Agent upgrade",
      ...overrides,
    });
  }
}
