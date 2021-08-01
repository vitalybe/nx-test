import { loggerCreator } from "common/utils/logger";

const moduleLogger = loggerCreator(__filename);

export class Constants {
  static CACHE_DELETED_INTERFACES =
    "ERROR: Cache interface is missing in QN infrastructure - Saving this Cache will remove additional interface data";

  private constructor() {}
}
