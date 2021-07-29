import { loggerCreator } from "@qwilt/common/utils/logger";
import { mockUtils } from "@qwilt/common/utils/mockUtils";
import { DaNetworkConnectionEntity } from "./daNetworkConnectionEntity";

const moduleLogger = loggerCreator("__filename");

export class DeliveryAgreementsGroupEntity {
  dsMetadataId!: string;
  dsMetadataCpName!: string;
  name!: string;

  networks!: DaNetworkConnectionEntity[];

  constructor(data: Required<DeliveryAgreementsGroupEntity>) {
    Object.assign(this, data);
  }

  // Mock
  static createMock(overrides?: Partial<DeliveryAgreementsGroupEntity>, id: number = mockUtils.sequentialId()) {
    return new DeliveryAgreementsGroupEntity({
      dsMetadataId: id.toString(),
      dsMetadataCpName: "CP " + id,
      name: "CP" + id,
      networks: [
        DaNetworkConnectionEntity.createMock(),
        DaNetworkConnectionEntity.createMock(),
        DaNetworkConnectionEntity.createMock(),
      ],
      ...overrides,
    });
  }
}
