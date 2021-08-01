import _ from "lodash";
import { DateTime, Duration, DurationObject } from "luxon";

export class Utils {
  static calcPercent(value: number, total: number): number {
    const percent = Math.round((value / total) * 100);
    return isNaN(percent) ? 0 : percent;
  }

  static generateHashString() {
    return "_" + Math.random().toString(36).substr(2, 9);
  }

  static objectMap<V = unknown>(keys: string[], iterator: (key: string, obj: { [k: string]: V }) => V) {
    const obj: { [k: string]: V } = {};
    keys.forEach((statName) => {
      obj[statName] = iterator(statName, obj);
    });
    return obj;
  }

  static randomValueFrom<T = unknown>(array: T[]): T {
    const randomMath = Math.random();
    const randomIndex = Math.floor(randomMath * array.length);

    return array[randomIndex];
  }

  // type safe way to clear empty objects
  // to be used with filter, e.g  array.filter(ProjectUtils.notEmpty)
  static isTruthy<TValue>(value: TValue | null | undefined): value is TValue {
    return value !== null && value !== undefined;
  }

  static equalsCaseInsensitive(a: string, b: string) {
    return a.localeCompare(b, undefined, { sensitivity: "base" }) === 0;
  }

  static includesCaseInsensitive(mainString: string, subset: string) {
    return mainString.toLowerCase().includes(subset.toLowerCase());
  }

  static trimObjectValues<T extends object>(obj: T): T {
    // iterates through object's values and trim string fields.
    // in case of typeof values is object, iterates through it as well.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const anyObject = obj as any;
    Object.keys(obj).forEach((key) => {
      if (_.isString(anyObject[key])) {
        anyObject[key] = String(anyObject[key]).trim();
      } else if (_.isObject(anyObject[key])) {
        anyObject[key] = this.trimObjectValues(Object(anyObject[key]));
      }
    });

    return obj;
  }

  static async fetchAllPages<T>(
    callback: (itemsPerPage: number, pageNumber: number) => Promise<T[]>,
    itemsPerPage = 100
  ) {
    let pageNumber = 0;
    let allItems: T[] = [];
    let isDone = false;

    while (!isDone) {
      const items = await callback(itemsPerPage, pageNumber);
      if (items.length < itemsPerPage) {
        isDone = true;
      }
      allItems = [...allItems, ...items];
      pageNumber++;
    }
    return allItems;
  }

  static walkObjectRecursively(
    jsonObject: Record<string, unknown>,
    onLiteralValueCallback: (
      obj: Record<string, unknown>,
      keys: { last: string; all: string[] },
      value: string | number
    ) => void,
    keys: string[] = []
  ) {
    Object.keys(jsonObject).forEach((key) => {
      const value = jsonObject[key];
      if (_.isString(value) || _.isNumber(value)) {
        onLiteralValueCallback(jsonObject, { last: key, all: keys.concat(key) }, value);
      } else if (_.isObject(value)) {
        this.walkObjectRecursively(value as Record<string, unknown>, onLiteralValueCallback, keys.concat(key));
      }
    });
  }

  static getDateTimeFromSecOrMs(value: number) {
    if (Math.log10(value) > 10) {
      return DateTime.fromMillis(value);
    } else {
      return DateTime.fromSeconds(value);
    }
  }

  static toggleSetItem<T>(set: Set<T>, item: T) {
    if (set.has(item)) {
      set.delete(item);
    } else {
      set.add(item);
    }
  }

  static toMillis(object: DurationObject): number {
    return Duration.fromObject(object).as("milliseconds");
  }
}
