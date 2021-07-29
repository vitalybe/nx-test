import { loggerCreator } from "@qwilt/common/utils/logger";
import {
  ServerEntity,
  ServerEntityParams,
} from "../../../_domain/server/serverEntity";

const moduleLogger = loggerCreator("__filename");

interface MonitorEntityParams extends ServerEntityParams {
  segmentId: string;
}

export class MonitorEntity extends ServerEntity {
  constructor(data: MonitorEntityParams) {
    super(data);
    Object.assign(this, data);
  }

  // Mock
  static createMock(overrides?: Partial<MonitorEntityParams>) {
    return new MonitorEntity({
      ...ServerEntity.createMock(),
      segmentId: "segment",
      ...overrides,
    });
  }
}

// utility - merges parameters as class members
export interface MonitorEntity extends MonitorEntityParams {}
