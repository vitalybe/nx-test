import { loggerCreator } from "../../../../utils/logger";
import { EntityTypeEnum } from "../../../../backend/qnDeployment/_types/entitiesApiType";
import { NameWithId } from "../../../../domain/nameWithId";
import { DeploymentEntityWithChildren } from "../../../../domain/qwiltDeployment/deploymentEntityWithChildren";

const moduleLogger = loggerCreator("__filename");

export class SystemUpdateFormEntity {
  networksHierarchy!: DeploymentEntityWithChildren[];
  deliveryServices!: NameWithId[];

  constructor(data: Required<SystemUpdateFormEntity>) {
    Object.assign(this, data);
  }

  // Mock
  static createMock(overrides?: Partial<SystemUpdateFormEntity>) {
    return new SystemUpdateFormEntity({
      networksHierarchy: [
        DeploymentEntityWithChildren.createMock({
          name: "Internets Ltd",
          id: 1,
          children: [
            DeploymentEntityWithChildren.createMock({ name: "QF82171", type: EntityTypeEnum.QN }),
            DeploymentEntityWithChildren.createMock({ name: "QA85171", type: EntityTypeEnum.QN }),
          ],
          type: EntityTypeEnum.NETWORK,
        }),
        DeploymentEntityWithChildren.createMock({
          name: "FastNet",
          type: EntityTypeEnum.NETWORK,
          children: [DeploymentEntityWithChildren.createMock({ name: "NF35171", type: EntityTypeEnum.QN })],
        }),
      ],
      deliveryServices: [NameWithId.createMock(), NameWithId.createMock(), NameWithId.createMock()],

      ...overrides,
    });
  }
}
