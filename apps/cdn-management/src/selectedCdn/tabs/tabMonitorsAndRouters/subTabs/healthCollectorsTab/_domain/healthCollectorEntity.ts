import { loggerCreator } from "@qwilt/common/utils/logger";
import {
  ServerEntity,
  ServerEntityParams,
} from "../../../_domain/server/serverEntity";

const moduleLogger = loggerCreator("__filename");

interface HealthCollectorEntityParams extends ServerEntityParams {
  healthCollectorRegion: string;
}

export class HealthCollectorEntity extends ServerEntity {
  constructor(data: HealthCollectorEntityParams) {
    super(data);
    Object.assign(this, data);
  }

  // Mock
  static createMock(overrides?: Partial<HealthCollectorEntityParams>) {
    return new HealthCollectorEntity({
      ...ServerEntity.createMock(),
      healthCollectorRegion: "healthCollectorRegion",
      ...overrides,
    });
  }
}

// utility - merges parameters as class members
export interface HealthCollectorEntity extends HealthCollectorEntityParams {}
