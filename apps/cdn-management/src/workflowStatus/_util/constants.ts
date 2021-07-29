import { loggerCreator } from "@qwilt/common/utils/logger";

const moduleLogger = loggerCreator("__filename");

export class Constants {
  static ICON_SIZE = "1.2rem";

  static TEXT_REASON_LOCKED = "Starting/Resuming workflows is disabled in this CDN";

  private constructor() {}
}
