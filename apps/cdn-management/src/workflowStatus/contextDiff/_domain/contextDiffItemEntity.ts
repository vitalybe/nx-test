import { loggerCreator } from "common/utils/logger";
import { mockUtils } from "common/utils/mockUtils";
import { JsonDiffEntity } from "src/workflowStatus/_domain/jsonDiffEntity";
import { ContextDiffEntityTypeEnum } from "src/workflowStatus/contextDiff/_domain/contextEntityType";
import { ContextDiffBaseEntity } from "src/workflowStatus/contextDiff/_domain/contextDiffDomainShared";

const moduleLogger = loggerCreator(__filename);

export class ContextDiffItemEntity implements ContextDiffBaseEntity {
  id!: string;
  type!: ContextDiffEntityTypeEnum;
  diff!: JsonDiffEntity;
  name!: string;

  get isModified() {
    return this.diff.changesAmount > 0;
  }

  get isRemoved() {
    return !this.diff.right;
  }

  get isAdded() {
    return !this.diff.left;
  }

  get hasModifications() {
    return this.isAdded || this.isRemoved || this.isModified;
  }

  constructor(
    data: Omit<Required<ContextDiffItemEntity>, "isModified" | "isAdded" | "isRemoved" | "hasModifications">
  ) {
    Object.assign(this, data);
  }

  // Mock
  static createMock(overrides?: Partial<ContextDiffItemEntity>, id: number = mockUtils.sequentialId()) {
    return new ContextDiffItemEntity({
      id: id.toString(),
      diff: JsonDiffEntity.createMock(),
      type: ContextDiffEntityTypeEnum.CACHE,
      name: `ID_${id}`,
      ...overrides,
    });
  }
}
