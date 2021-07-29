import { loggerCreator } from "common/utils/logger";
import { mockUtils } from "common/utils/mockUtils";
import mockData from "common/backend/_utils/mockData";

const moduleLogger = loggerCreator(__filename);

export interface CdnCacheInterface {
  name: string;
  ipv4Address: string;
  ipv6Address: string;
}

interface QnEntityParams {
  systemId: string;
  networkId: number;
  interfaces: CdnCacheInterface[];
  supportName: string;
}

export class QnEntity {
  constructor(data: QnEntityParams) {
    Object.assign(this, data);
  }

  get displayName() {
    return !!this.supportName ? this.supportName : this.systemId;
  }

  // Mock
  static createMock(overrides?: Partial<QnEntityParams>, id: number = mockUtils.sequentialId()) {
    return new QnEntity({
      systemId: id.toString(),
      networkId: mockData.networksWithId[id % mockData.networksWithId.length].id,
      interfaces: [
        { name: "INTERFACE 1", ipv4Address: "1.1.1.1", ipv6Address: "" },
        { name: "INTERFACE 2", ipv4Address: "2.2.2.2", ipv6Address: "" },
      ],
      supportName: "Support Name",
      ...overrides,
    });
  }
}

// utility - merges parameters as class members
export interface QnEntity extends QnEntityParams {}
