import { loggerCreator } from "@qwilt/common/utils/logger";
import { mockUtils } from "@qwilt/common/utils/mockUtils";

const moduleLogger = loggerCreator("__filename");

interface CdnEntityParams {
  id: string;
  name: string;
  httpSubDomain: string;
  httpRootHostedZone: string;
  httpCdnSubDomain: string;
  operationalDomain: string;
  dnsSubDomain: string;
  dnsRootHostedZone: string;
  dnsCdnSubDomain: string;
  description: string;
}

export class CdnEntity {
  constructor(data: CdnEntityParams) {
    Object.assign(this, data);
  }

  // Mock
  static createMock(overrides?: Partial<CdnEntityParams>, id: number = mockUtils.sequentialId()) {
    return new CdnEntity({
      id: `id ${id}`,
      name: `name ${id}`,
      httpSubDomain: `httpSubDomain ${id}`,
      httpRootHostedZone: `httpRootHostedZone ${id}`,
      httpCdnSubDomain: `httpCdnSubDomain ${id}`,
      operationalDomain: `operationalDomain ${id}`,
      dnsSubDomain: `dnsSubDomain ${id}`,
      dnsRootHostedZone: `dnsRootHostedZone ${id}`,
      dnsCdnSubDomain: `dnsCdnSubDomain ${id}`,
      description: `description ${id}`,
      ...overrides,
    });
  }
}

// utility - merges parameters as class members
export interface CdnEntity extends CdnEntityParams {}
