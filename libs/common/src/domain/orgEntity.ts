import { loggerCreator } from "../utils/logger";
import { mockUtils } from "../utils/mockUtils";

const moduleLogger = loggerCreator("__filename");

export class OrgEntity {
  id!: string;
  name!: string;

  constructor(data: Required<OrgEntity>) {
    Object.assign(this, data);
  }

  // Mock
  static createMock(overrides?: Partial<OrgEntity>, id: number = mockUtils.sequentialId()) {
    return new OrgEntity({
      id: id.toString(),
      name: "mockOrg" + id,
      ...overrides,
    });
  }
}
