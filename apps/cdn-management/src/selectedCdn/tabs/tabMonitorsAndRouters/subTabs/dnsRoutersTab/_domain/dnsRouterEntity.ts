import { loggerCreator } from "@qwilt/common/utils/logger";
import { HealthProviderEntity } from "../../../_domain/healthProvider/healthProviderEntity";
import {
  ServerEntity,
  ServerEntityParams,
} from "../../../_domain/server/serverEntity";

const moduleLogger = loggerCreator("__filename");

interface DnsRouterEntityParams extends ServerEntityParams {
  healthProviders: HealthProviderEntity[];
  dnsRoutingSegmentId: string;
}

export class DnsRouterEntity extends ServerEntity {
  constructor(data: DnsRouterEntityParams) {
    super(data);
    Object.assign(this, data);
  }

  // Mock
  static createMock(overrides?: Partial<DnsRouterEntityParams>) {
    return new DnsRouterEntity({
      ...ServerEntity.createMock(),
      healthProviders: [HealthProviderEntity.createMock(), HealthProviderEntity.createMock()],
      dnsRoutingSegmentId: "segment.cqloud",
      ...overrides,
    });
  }
}

// utility - merges parameters as class members
export interface DnsRouterEntity extends DnsRouterEntityParams {}
