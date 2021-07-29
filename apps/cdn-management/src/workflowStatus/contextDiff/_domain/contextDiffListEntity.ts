import { loggerCreator } from "@qwilt/common/utils/logger";
import { mockUtils } from "@qwilt/common/utils/mockUtils";
import { ContextDiffEntityTypeEnum } from "./contextEntityType";
import { ContextDiffItemEntity } from "./contextDiffItemEntity";
import { ContextDiffBaseEntity } from "./contextDiffDomainShared";
import { JsonDiffEntity } from "../../_domain/jsonDiffEntity";

const moduleLogger = loggerCreator("__filename");

export class ContextDiffListEntity implements ContextDiffBaseEntity {
  id!: string;
  type!: ContextDiffEntityTypeEnum;
  name!: string;
  modifiedCount!: number;
  addedCount!: number;
  removedCount!: number;

  content!:
    | { kind: "known"; children: ContextDiffItemEntity[] }
    | { kind: "unknown"; children: ContextDiffItemEntity[] };

  constructor(data: Omit<Required<ContextDiffListEntity>, "isReviewed" | "hasModifications">) {
    Object.assign(this, data);
  }

  get hasModifications() {
    return this.modifiedCount + this.addedCount + this.removedCount > 0;
  }

  // Mock
  static createMock(overrides?: Partial<ContextDiffListEntity>, id: number = mockUtils.sequentialId()) {
    return new ContextDiffListEntity({
      id: id.toString(),
      name: "Caches",
      type: ContextDiffEntityTypeEnum.CACHE,
      addedCount: 4,
      modifiedCount: 2,
      removedCount: 1,
      content: {
        kind: "known",
        children: [
          ContextDiffItemEntity.createMock(),
          ContextDiffItemEntity.createMock(),
          ContextDiffItemEntity.createMock({ diff: JsonDiffEntity.createMock({ right: { a: 1 }, left: { a: 1 } }) }),
        ],
      },
      ...overrides,
    });
  }
}
