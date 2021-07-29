import * as _ from "lodash";
import { loggerCreator } from "@qwilt/common/utils/logger";
import { UnknownObject } from "@qwilt/common/utils/typescriptUtils";
import { Utils } from "@qwilt/common/utils/utils";

const moduleLogger = loggerCreator("__filename");

interface CollectedId {
  id: string;
  name: string;
  sourceObject: unknown;
}

export class IdReplacer {
  private constructor() {}

  static PREFIX_UUID_OF = "uuid-of-";

  private static collectIdsFinalAddressObject(
    data: Record<string, { toString: () => string }>,
    idProperty: string,
    nameProperty: string
  ) {
    const collectedIds: CollectedId[] = [];

    const id = data[idProperty];
    const name = data[nameProperty];

    if (id && name) {
      collectedIds.push({ id: id.toString(), name: name.toString(), sourceObject: data });
    }

    return collectedIds;
  }

  private static collectIdsFinalAddress(
    data: Record<string, { toString: () => string }>,
    idProperty: string,
    nameProperty: string
  ): CollectedId[] {
    if (_.isArray(data)) {
      return data.flatMap((item) => this.collectIdsFinalAddressObject(item, idProperty, nameProperty));
    } else if (_.isObject(data)) {
      return this.collectIdsFinalAddressObject(data, idProperty, nameProperty);
    } else {
      throw new Error(`end of address is expected to be an object or an array`);
    }
  }

  private static collectIds(
    data: UnknownObject,
    address: (string | RegExp)[],
    idProperty: string,
    nameProperty: string
  ): CollectedId[] {
    const collectedIds: CollectedId[] = [];

    const topAddress = address.shift()!;
    if (topAddress instanceof RegExp) {
      collectedIds.push(
        ...Object.keys(data)
          .filter((key) => key.match(topAddress))
          .flatMap((matchingTopAddress) =>
            this.collectIds(data, [matchingTopAddress, ...address], idProperty, nameProperty)
          )
      );
    } else if (address.length > 0) {
      collectedIds.push(...this.collectIds(data[topAddress], address, idProperty, nameProperty));
    } else if (_.isString(topAddress)) {
      collectedIds.push(...this.collectIdsFinalAddress(data[topAddress], idProperty, nameProperty));
    }

    return collectedIds;
  }

  static replaceIds(data: UnknownObject, address: (string | RegExp)[], idProperty: string, nameProperty: string) {
    const dataCopy = _.cloneDeep(data);
    try {
      const idsData = this.collectIds(dataCopy, address, idProperty, nameProperty);

      Utils.walkObjectRecursively(dataCopy, (obj, keys, maybeId) => {
        const idData = idsData.find((idData) => idData.id === maybeId.toString());
        if (idData && obj !== idData.sourceObject) {
          obj[keys.last + "_debugFriendyName"] = IdReplacer.PREFIX_UUID_OF + idData.name;
        }
      });
    } catch (e) {
      moduleLogger.warn("failed to replace IDs", e);
    }

    return dataCopy;
  }
}
