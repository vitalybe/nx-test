import { DeploymentEntity } from "common/domain/qwiltDeployment/deploymentEntity";
import { loggerCreator } from "common/utils/logger";

const moduleLogger = loggerCreator(__filename);

export class DeploymentEntityWithChildren extends DeploymentEntity {
  children!: DeploymentEntityWithChildren[];

  constructor(data: Required<DeploymentEntityWithChildren> & Required<DeploymentEntity>) {
    super(data);
    Object.assign(this, data);
  }

  // Mock
  static createMock(overrides?: Partial<DeploymentEntityWithChildren>) {
    return new DeploymentEntityWithChildren({
      attributes: {},
      id: 0,
      name: "",
      type: undefined,
      uniqueName: "",
      get systemId(): string | undefined {
        return undefined;
      },
      get uiSystemId(): string | undefined {
        return undefined;
      },
      ...DeploymentEntity.createMock(),
      children: [],
      ...overrides,
    });
  }
}
