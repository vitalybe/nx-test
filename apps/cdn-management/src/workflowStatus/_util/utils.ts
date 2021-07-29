import { loggerCreator } from "common/utils/logger";
import { DateTime } from "luxon";

const moduleLogger = loggerCreator(__filename);

export class Utils {
  static formatDateTime(dateTime: DateTime) {
    const isSameDay = dateTime.startOf("day").equals(DateTime.local().startOf("day"));
    return dateTime.toFormat(isSameDay ? "T" : "D T");
  }

  static shortenId(id: string) {
    const MAX_SIZE = 5;

    if (id.length > MAX_SIZE) {
      return "..." + id.substr(-5);
    } else {
      return id;
    }
  }

  private constructor() {}
}
