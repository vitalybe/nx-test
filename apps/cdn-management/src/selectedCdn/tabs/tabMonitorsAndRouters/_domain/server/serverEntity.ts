import { loggerCreator } from "common/utils/logger";
import { ServerStatus } from "common/backend/trafficRoutersMonitors/_types/trafficRoutersMonitorsTypes";

const moduleLogger = loggerCreator(__filename);

export interface ServerEntityParams {
  hostname: string;
  systemId: string;
  domain: string;
  ipv4Address: string;
  ipv6Address: string;
  tcpPort: number;
  httpsPort: number;
  status: ServerStatus;
}

export class ServerEntity {
  protected constructor(data: ServerEntityParams) {
    Object.assign(this, data);
  }

  // Mock
  static createMock(overrides?: Partial<ServerEntityParams>) {
    return new ServerEntity({
      domain: "qwilt",
      hostname: "tc-dng1.cqloud.com",
      httpsPort: 443,
      ipv4Address: "router-0",
      ipv6Address: "80",
      status: ServerStatus.ONLINE,
      systemId: "1.1.1.1",
      tcpPort: 80,
      ...overrides,
    });
  }
}

// utility - merges parameters as class members
export interface ServerEntity extends ServerEntityParams {}
