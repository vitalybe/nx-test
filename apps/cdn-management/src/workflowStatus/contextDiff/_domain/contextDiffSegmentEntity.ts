import { loggerCreator } from "@qwilt/common/utils/logger";
import { mockUtils } from "@qwilt/common/utils/mockUtils";
import { ContextDiffEntityTypeEnum } from "./contextEntityType";
import { ContextDiffListEntity } from "./contextDiffListEntity";
import { ContextDiffItemEntity } from "./contextDiffItemEntity";
import { ContextDiffBaseEntity } from "./contextDiffDomainShared";

const moduleLogger = loggerCreator("__filename");

export class ContextDiffSegmentEntity implements ContextDiffBaseEntity {
  id!: string;
  type!: ContextDiffEntityTypeEnum;
  name!: string;
  changeCount!: number;

  content!:
    | { kind: "known"; children: ContextDiffListEntity[] }
    | { kind: "unknown"; children: ContextDiffItemEntity[] };

  constructor(data: Omit<Required<ContextDiffSegmentEntity>, "hasModifications">) {
    Object.assign(this, data);
  }

  get hasModifications() {
    return this.changeCount > 0;
  }

  // Mock
  static createMock(overrides?: Partial<ContextDiffSegmentEntity>, id: number = mockUtils.sequentialId()) {
    return new ContextDiffSegmentEntity({
      id: "ID_" + id.toString(),
      name: `Network ${id}`,
      type: ContextDiffEntityTypeEnum.DS,
      changeCount: 5,
      content: {
        kind: "known",
        children: [
          ContextDiffListEntity.createMock(),
          ContextDiffListEntity.createMock(),
          ContextDiffListEntity.createMock({ addedCount: 0, modifiedCount: 0, removedCount: 0 }),
        ],
      },
      ...overrides,
    });
  }
}
