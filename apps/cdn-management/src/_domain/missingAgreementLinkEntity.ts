import { loggerCreator } from "@qwilt/common/utils/logger";
import { mockUtils } from "@qwilt/common/utils/mockUtils";

// noinspection JSUnusedLocalSymbols
const moduleLogger = loggerCreator("__filename");

interface MissingAgreementLinkEntityParams {
  dsMetadataId: string;
  dsMetadataName: string;

  networkId: number;
  networkName: string;
}

export class MissingAgreementLinkEntity {
  constructor(data: MissingAgreementLinkEntityParams) {
    Object.assign(this, data);
  }

  // Mock
  static createMock(overrides?: Partial<MissingAgreementLinkEntityParams>, id: number = mockUtils.sequentialId()) {
    return new MissingAgreementLinkEntity({
      dsMetadataId: id.toString(),
      dsMetadataName: "DS Metadata " + id,
      networkId: id,
      networkName: "Network " + id,
      ...overrides,
    });
  }
}

// utility - merges parameters as class members
export interface MissingAgreementLinkEntity extends MissingAgreementLinkEntityParams {}
