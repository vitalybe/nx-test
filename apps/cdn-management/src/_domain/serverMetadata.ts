import { loggerCreator } from "@qwilt/common/utils/logger";
import { ServerType } from "@qwilt/common/backend/trafficRoutersMonitors/_types/trafficRoutersMonitorsTypes";
// noinspection JSUnusedLocalSymbols
const moduleLogger = loggerCreator("__filename");

interface ServerMetadataType {
  title: string;
}

export const ServerMetadata: Record<ServerType, ServerMetadataType> = {
  [ServerType.MONITOR]: {
    title: "Monitors",
  },
  [ServerType.DNS_ROUTER]: {
    title: "DNS Routers",
  },
  [ServerType.HTTP_ROUTER_GROUP]: {
    title: "HTTP Router Groups",
  },
  [ServerType.HTTP_ROUTER]: {
    title: "HTTP Routers",
  },
  [ServerType.MANIFEST_ROUTER]: {
    title: "Manifest Routers",
  },
  [ServerType.HEALTH_COLLECTOR]: {
    title: "Health Collectors",
  },
  [ServerType.HEALTH_PROVIDER]: {
    title: "Health Providers",
  },
};
