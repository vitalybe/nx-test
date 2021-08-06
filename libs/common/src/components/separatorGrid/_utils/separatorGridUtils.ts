import { DateTime } from "luxon";

export class SeparatorGridUtils {
  static isSameDay(a: number, b: number) {
    return DateTime.fromSeconds(a).hasSame(DateTime.fromSeconds(b), "day");
  }

  static getStartOfDay(timestamp: number) {
    return DateTime.fromSeconds(timestamp).startOf("day");
  }
}
