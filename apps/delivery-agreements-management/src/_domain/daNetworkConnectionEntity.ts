import { loggerCreator } from "@qwilt/common/utils/logger";
import { mockUtils } from "@qwilt/common/utils/mockUtils";

const moduleLogger = loggerCreator("__filename");

export class DaNetworkConnectionEntity {
  deliveryAgreementId!: string;
  networkId!: number;
  name!: string;

  constructor(data: Required<DaNetworkConnectionEntity>) {
    Object.assign(this, data);
  }

  // Mock
  static createMock(overrides?: Partial<DaNetworkConnectionEntity>, id: number = mockUtils.sequentialId()) {
    return new DaNetworkConnectionEntity({
      deliveryAgreementId: "da_" + id.toString(),
      networkId: id * 100,
      name: "Network" + id,
      ...overrides,
    });
  }
}
