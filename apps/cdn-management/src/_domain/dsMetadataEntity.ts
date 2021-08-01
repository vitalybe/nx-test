import { loggerCreator } from "common/utils/logger";
import { mockUtils } from "common/utils/mockUtils";
import { OrgEntity } from "common/domain/orgEntity";
import { MissingAgreementLinkEntity } from "src/_domain/missingAgreementLinkEntity";
import { MetadataServiceTypeEnum } from "common/backend/deliveryServices/_types/deliveryServiceMetadataTypes";

// noinspection JSUnusedLocalSymbols
const moduleLogger = loggerCreator(__filename);

export const defaultIcon = require("common/images/no-cp.svg");

interface DsMetadataEntityParams {
  id: string;
  name: string;
  reportingName: string;
  contentProvider: OrgEntity | undefined;
  contentGroupId: number;
  type: MetadataServiceTypeEnum;
  missingAgreementLinks: MissingAgreementLinkEntity[];
}

export class DsMetadataEntity {
  constructor(data: DsMetadataEntityParams) {
    Object.assign(this, data);
  }

  // Mock
  static createMock(overrides?: Partial<DsMetadataEntityParams>, id: number = mockUtils.sequentialId()) {
    return new DsMetadataEntity({
      contentProvider: OrgEntity.createMock(undefined, id),
      id: id.toString(),
      name: "mockMetadata" + id,
      contentGroupId: id,
      type: MetadataServiceTypeEnum.VOD,
      reportingName: "mockReportingName",
      missingAgreementLinks: [],
      ...overrides,
    });
  }
}

// utility - merges parameters as class members
export interface DsMetadataEntity extends DsMetadataEntityParams {}
