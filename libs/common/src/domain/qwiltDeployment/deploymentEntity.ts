import { loggerCreator } from "common/utils/logger";
import { EntityTypeEnum } from "common/backend/qnDeployment/_types/entitiesApiType";
import { mockUtils } from "common/utils/mockUtils";

const moduleLogger = loggerCreator(__filename);

export class DeploymentEntity {
  name!: string;
  uniqueName!: string;
  id!: number;
  type!: EntityTypeEnum;
  attributes!: { [key: string]: string | null | undefined };

  constructor(data: Required<DeploymentEntity>) {
    Object.assign(this, data);
  }

  // Mock
  static createMock(overrides?: Partial<DeploymentEntity>, id: number = mockUtils.sequentialId()) {
    return new DeploymentEntity({
      id: id,
      name: `Network ${id}`,
      type: EntityTypeEnum.NETWORK,
      attributes: {},
      uniqueName: `nwk_${id}`,
      ...overrides,
    });
  }
}
