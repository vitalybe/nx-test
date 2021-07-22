import { loggerCreator } from "common/utils/logger";
import { mockUtils } from "common/utils/mockUtils";
import { DateTime } from "luxon";
import { CurrencyUnitEnum } from "common/components/_projectSpecific/monetization/_utils/currencyUtils";

const moduleLogger = loggerCreator(__filename);

export interface FinancingPhaseData {
  endDate: DateTime | undefined;
  expectedEndDate: DateTime | undefined;
  threshold: number;
}

export enum ProjectPhaseEnum {
  FINANCING = "financing",
  REVENUE_STREAM = "revenueStream",
}
export class MonetizationProjectEntity {
  projectId!: string;
  name!: string;
  startDate!: DateTime;
  endDate!: DateTime;
  financingPhaseData!: FinancingPhaseData;
  currency!: CurrencyUnitEnum;
  spId!: string;
  capacity!: number;
  currentPhase!: ProjectPhaseEnum;

  constructor(data: Required<MonetizationProjectEntity>) {
    Object.assign(this, data);
  }

  // Mock
  static createMock(overrides?: Partial<MonetizationProjectEntity>, id: number = mockUtils.sequentialId() + 1) {
    return new MonetizationProjectEntity({
      projectId: "project_" + id,
      name: "Project " + id,
      spId: "british-telecom",
      currentPhase: ProjectPhaseEnum.FINANCING,
      startDate: DateTime.fromObject({ year: 2020, month: 1 }),
      endDate: DateTime.fromObject({ year: 2025, month: 1 }),
      currency: CurrencyUnitEnum.US_DOLLAR,
      capacity: 500_000_000_000_000,
      financingPhaseData: {
        endDate: DateTime.fromObject({ year: 2021, month: 12 }),
        expectedEndDate: DateTime.fromObject({ year: 2021, month: 11 }),
        threshold: 2_200_000,
      },
      ...overrides,
    });
  }
}
