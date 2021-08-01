import { loggerCreator } from "@qwilt/common/utils/logger";
import { mockUtils } from "@qwilt/common/utils/mockUtils";

const moduleLogger = loggerCreator("__filename");

interface HealthProviderEntityParams {
  hostname: string;
  priority: number;
}

export class HealthProviderEntity {
  constructor(data: HealthProviderEntityParams) {
    Object.assign(this, data);
  }

  // Mock
  static createMock(overrides?: Partial<HealthProviderEntityParams>, id: number = mockUtils.sequentialId()) {
    return new HealthProviderEntity({
      hostname: id.toString(),
      priority: id % 5,
      ...overrides,
    });
  }
}

// utility - merges parameters as class members
export interface HealthProviderEntity extends HealthProviderEntityParams {}
