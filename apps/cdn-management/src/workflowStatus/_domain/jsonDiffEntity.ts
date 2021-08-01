import * as _ from "lodash";
import { loggerCreator } from "common/utils/logger";
import { Delta, DiffPatcher } from "jsondiffpatch";
import { OnlyData } from "common/utils/typescriptUtils";

const moduleLogger = loggerCreator(__filename);

export class JsonDiffEntity {
  left!: object | undefined;
  right!: object | undefined;
  idGetter: undefined | ((obj: Record<string, string>) => string | undefined);

  // lazily initiated
  private _delta: undefined | Delta;

  get delta(): Delta {
    if (!this._delta) {
      const diffPatcher = new DiffPatcher({
        objectHash: (obj: Record<string, string>, index: number) => {
          return this.idGetter?.(obj) || "$$index:" + index;
        },
        arrays: {
          detectMove: true,
          includeValueOnMove: false,
        },
      });

      this._delta = diffPatcher.diff(this.left ?? {}, this.right);
    }

    return this._delta ?? {};
  }

  private _changesAmount: number | undefined;

  private getChangesAmount(obj: object) {
    let arrayCount = 0;

    if (_.isArray(obj)) {
      arrayCount++;
    } else if (_.isObject(obj)) {
      for (const value of Object.values(obj)) {
        if (_.isArray(value)) {
          arrayCount++;
        } else if (_.isObject(value)) {
          arrayCount += this.getChangesAmount(value);
        }
      }
    }

    return arrayCount;
  }

  get changesAmount() {
    if (this._changesAmount === undefined) {
      this._changesAmount = this.getChangesAmount(this.delta);
    }

    return this._changesAmount;
  }

  constructor(data: Omit<OnlyData<JsonDiffEntity>, "delta" | "changesAmount">) {
    Object.assign(this, data);
    this.left = this.sortById(data.left);
    this.right = this.sortById(data.right);
  }

  private sortById(root: object | undefined) {
    let sortedRoot = root;

    if (_.isArray(root) && this.idGetter) {
      sortedRoot = _.orderBy(root, this.idGetter);
    }

    return sortedRoot;
  }

  // Mock
  static createMock(overrides?: Partial<JsonDiffEntity>) {
    return new JsonDiffEntity({
      left: { a: 1, b: 2 },
      right: { a: 1, b: 5, c: 3 },
      idGetter: undefined,
      ...overrides,
    });
  }
}
