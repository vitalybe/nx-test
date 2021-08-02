import { DeploymentEntity } from "common/domain/qwiltDeployment/deploymentEntity";
import { loggerCreator } from "common/utils/logger";
import { mockUtils } from "common/utils/mockUtils";

const moduleLogger = loggerCreator(__filename);

export class QnDeploymentEntity {
  id!: number;
  name!: string;
  uniqueName!: string;
  network?: DeploymentEntity | undefined;
  attributes!: { [key: string]: string | undefined };

  // NOTE: This system ID may be used for display purposes only as it may be obfuscated. To fetch data, use `systemId` instead.
  private _uiSystemId?: string | undefined;

  get uiSystemId(): string | undefined {
    return this._uiSystemId ?? this.systemId;
  }

  set uiSystemId(uiSystemId: string | undefined) {
    this._uiSystemId = uiSystemId;
  }

  get systemId(): string | undefined {
    return this.attributes.systemId;
  }

  constructor(data: Partial<Required<QnDeploymentEntity>>) {
    Object.assign(this, data);
  }

  // Mock
  static createMock(overrides?: Partial<QnDeploymentEntity>, id: number = mockUtils.sequentialId()) {
    return new QnDeploymentEntity({
      id: id,
      name: "System",
      uniqueName: `qn_${id}`,
      network: DeploymentEntity.createMock({ name: "Charter" }),
      attributes: {
        systemId: "G2HK2KL" + id,
      },
      ...overrides,
    });
  }
}
