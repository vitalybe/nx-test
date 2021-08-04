export interface TrafficRoutersMonitorsApiResult {
  servers: ServerApiType[];
}

// NOTE: This should be kept, even when v1 of the API is discarded since it is used by genericServerEntity
export enum ServerType {
  MONITOR = "Monitor",
  DNS_ROUTER = "DNS Router",
  HTTP_ROUTER_GROUP = "HTTP Router Group",
  HTTP_ROUTER = "HTTP Router",
  // NOTE: Delete MANIFEST_ROUTER when tempFlag_serversTabMoreConfigurations removed
  MANIFEST_ROUTER = "Manifest Router",
  HEALTH_COLLECTOR = "Health Collector",
  HEALTH_PROVIDER = "Health Provider",
}

export enum ServerStatus {
  ONLINE = "online",
  OFFLINE = "offline",
}

// NOTE: Delete when tempFlag_serversTabMoreConfigurations removed
export interface ServerApiType {
  domain: string;
  hostname: string;
  httpsPort: string;
  ipv4Address: string;
  ipv6Address: string;
  status: string;
  systemId: string;
  tcpPort: string;
  links: string[];
  segmentId: string;
  httpRouterGroupName: string;
  type: ServerType;
  groupServerDsRemapConfigEnabled?: boolean | null;
  healthCollectorRegion?: string | null;
}

export interface ServerApiTypeV2 {
  hostname: string;
  systemId: string;
  domain: string;
  ipv4Address: string | null;
  ipv6Address: string | null;
  tcpPort: number;
  httpsPort: number;
}

export interface HealthProviderApiType {
  name: string;
  priority: number;
}

//region DNS Router
export interface ServerDnsRouterApiType {
  status: ServerStatus;
  healthProviders: HealthProviderApiType[] | null;
  dnsRoutingSegmentId: string;
  groupServerDsRemapConfigEnabled: boolean;
}

export interface ServerDnsRouterResultApiType {
  dnsRouters: (ServerDnsRouterApiType & ServerApiTypeV2)[];
}
//endregion

//region HTTP Router
export interface ServerHttpRouterApiType {
  httpRouterGroupName: string;
  groupServerDsRemapConfigEnabled: boolean;
  status: ServerStatus;
  healthProviders: HealthProviderApiType[];
}

export interface ServerHttpRouterResultApiType {
  httpRouters: (ServerHttpRouterApiType & ServerApiTypeV2)[];
}
//endregion

//region Monitors
export interface ServerMonitorApiType {
  groupServerDsRemapConfigEnabled: boolean;

  segmentId: string;
  status: ServerStatus;
}

export interface ServerMonitorResultApiType {
  monitors: (ServerMonitorApiType & ServerApiTypeV2)[];
}
//endregion

//region Health Collectors
export interface ServerHealthCollectorApiType {
  groupServerDsRemapConfigEnabled: boolean;

  healthCollectorRegion: string;
  status: ServerStatus;
}

export interface ServerHealthCollectorResultApiType {
  healthCollectors: (ServerHealthCollectorApiType & ServerApiTypeV2)[];
}
//endregion

//region Health Providers
export interface ServerHealthProviderApiType {
  status: ServerStatus;
}

export interface ServerHealthProviderResultApiType {
  healthProviders: (ServerHealthProviderApiType & ServerApiTypeV2)[];
}
//endregion

//region BGP Collectors
export interface ServerBgpCollectorResultApiType {
  bgpCollectors: ServerApiTypeV2[];
}
//endregion
