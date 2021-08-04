import { loggerCreator } from "../logger";
import { NotificationLevel } from "./_domain/notificationEntity";

const moduleLogger = loggerCreator("__filename");

export class NotifierShared {
  static readonly AUTO_CLOSE_AFTER_MS = 10_000;
  static readonly MAX_TOASTS = 2;

  static readonly COLOR_ERROR = "#ff2254";
  static readonly COLOR_WARN = "#ffa022";
  static readonly COLOR_INFO = "#8ca4ad";

  static getTitleForLevel(level: NotificationLevel) {
    let title: string;

    if (level === NotificationLevel.ERROR) {
      title = "Error";
    } else if (level === NotificationLevel.WARN) {
      title = "Warning";
    } else if (level === NotificationLevel.INFO) {
      title = "Info";
    } else {
      moduleLogger.warn(`unexpected level: ${level}`);
      title = "Warning";
    }

    return title;
  }

  private constructor() {}
}
