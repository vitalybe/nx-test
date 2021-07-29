// NOTE: Delete file when tempFlag_serversTabMoreConfigurations removed
import { loggerCreator } from "common/utils/logger";
import { ServerType } from "common/backend/trafficRoutersMonitors/_types/trafficRoutersMonitorsTypes";

const moduleLogger = loggerCreator(__filename);

export type ServerEntityStatus = "online" | "offline";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class ServerEntity {
  domain!: string;
  hostname!: string;
  httpsPort!: string;
  ipv4Address!: string;
  ipv6Address!: string;
  status!: ServerEntityStatus;
  systemId!: string;
  tcpPort!: string;
  links!: string[];
  segmentId!: string;
  groupName!: string;
  type!: ServerType;
  groupServerDsRemapConfigEnabled!: boolean | undefined;
  healthCollectorRegion!: string | undefined;

  constructor(data: Required<ServerEntity>) {
    Object.assign(this, data);
  }

  // Mock
  static createMock() {
    let type: ServerType;
    const random = Math.floor(Math.random() * 4);
    if (random == 0) {
      type = ServerType.MONITOR;
    } else if (random == 1) {
      type = ServerType.DNS_ROUTER;
    } else {
      type = ServerType.HTTP_ROUTER;
    }

    return new ServerEntity({
      domain: "qwilt",
      hostname: "tc-dng1.cqloud.com",
      httpsPort: "aws-0-router.tc-dng",
      ipv4Address: "router-0",
      ipv6Address: "80",
      status: "online",
      systemId: "1.1.1.1",
      tcpPort: "80",
      links: [],
      segmentId: "segmentID",
      groupName: "groupID",
      type: type,
      groupServerDsRemapConfigEnabled: false,
      healthCollectorRegion: undefined,
    });
  }
}
