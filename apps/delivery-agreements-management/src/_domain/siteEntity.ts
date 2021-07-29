import { loggerCreator } from "@qwilt/common/utils/logger";
import { mockUtils } from "@qwilt/common/utils/mockUtils";

const moduleLogger = loggerCreator("__filename");

export class SiteEntity {
  id!: string;
  name!: string;

  constructor(data: Required<SiteEntity>) {
    Object.assign(this, data);
  }

  // Mock
  static createMock(overrides?: Partial<SiteEntity>, id: number = mockUtils.sequentialId()) {
    return new SiteEntity({
      id: id.toString(),
      name: "Site" + id,
      ...overrides,
    });
  }
}
