import { loggerCreator } from "../../logger";

const moduleLogger = loggerCreator("__filename");

export enum NotificationLevel {
  INFO,
  WARN,
  ERROR,
  MODAL,
}

export class NotificationEntity {
  level!: NotificationLevel;
  title!: string;
  text!: string;
  errorText: string = "";
  constructor(data: Omit<NotificationEntity, "errorText">) {
    Object.assign(this, data);
  }
}
