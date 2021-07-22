import { loggerCreator } from "common/utils/logger";
import { mockUtils } from "common/utils/mockUtils";

const moduleLogger = loggerCreator(__filename);

export class VersionEntity {
  versionQnNames!: string[];
  supportedQnNames!: string[];
  id!: string;
  constructor(data: Required<VersionEntity>) {
    Object.assign(this, data);
  }

  // Mock
  static createMock(overrides?: Partial<VersionEntity>, id: number = mockUtils.sequentialId()) {
    return new VersionEntity({
      versionQnNames: [id + ""],
      supportedQnNames: [id + ""],
      id: "6.2.0",
      ...overrides,
    });
  }
}
