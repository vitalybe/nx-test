import { loggerCreator } from "common/utils/logger";
import {
  ServerEntity,
  ServerEntityParams,
} from "src/selectedCdn/tabs/tabMonitorsAndRouters/_domain/server/serverEntity";

const moduleLogger = loggerCreator(__filename);

export class HealthProviderEntity extends ServerEntity {
  constructor(data: ServerEntityParams) {
    super(data);
    Object.assign(this, data);
  }

  // Mock
  static createMock(overrides?: Partial<ServerEntityParams>) {
    return new HealthProviderEntity({
      ...ServerEntity.createMock(),
      ...overrides,
    });
  }
}

// utility - merges parameters as class members
export interface HealthProviderEntity extends ServerEntityParams {}
