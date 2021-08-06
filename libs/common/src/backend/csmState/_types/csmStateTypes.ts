export enum ParcelStateSeverity {
  CONFIGURED_UNSATISFIED = "configured-unsatisfied",
  UNSATISFIED = "unsatisfied",
  CONFIGURED_IN_PROGRESS = "configured-inProgress",
  IN_PROGRESS = "inProgress",
  SATISFIED = "satisfied",
}

export enum SystemType {
  EDGE_OCN = "edge-ocn",
  MID_OCN = "mid-ocn",
  TRAFFIC_MONITOR = "traffic-monitor",
  DNS_TRAFFIC_ROUTER = "dns-traffic-router",
  MANIFEST_ROUTER = "manifest-router",
  DNS_MANAGER = "dns-manager",
}

export interface DependencyVerticalsApiResult {
  [planeName: string]: {
    verticalToSupportingVerticals: DependencyVerticalsApiType;
  };
}

export interface DependencyVerticalsApiType {
  [verticalName: string]: string[];
}

export interface ParcelMetadataApiType {
  id: string;
  description: string;
  tags: {
    [key: string]: string;
  };
  target: string;
  "add-dependency-data": {
    phase: string;
    vertical: string;
  };
}

export interface ParcelStoreData {
  data: {
    [key: string]: {
      cacheGroup: string;
      fqdn: string;
      hashCount: number;
      hashId: string;
      httpsPort: number;
      interfaceName: string;
      ip: string;
      ip6: string;
      locationId: string;
      port: number;
      profile: string;
      status: string;
      tunnelPort: number;
      type: string;
    };
  };
  rank: string;
  scope: string;
  type: string;
}

export interface CsmStateParcelApiType {
  id: string;
  description: string;
  target: string;
  systemType: string;
  tags: CsmStateTagsApiType;
  numSecondsUnsatisfied: number | null;
  numSecondsConfiguredUnsatisfied: number | null;
  dependencyVertical: string;
  priorityLevel: number;
  configured: boolean;
  desired: boolean;
  actual: boolean;
}

export interface CsmStateDevicesStatusApiType {
  systemId: string;
  getParcelsTimestamps: string[];
  updateStatusTimestamps: string[];
}

export type CsmStateTagApiType = string | number;
export type CsmStateTagsApiType = { [tag: string]: CsmStateTagApiType };
