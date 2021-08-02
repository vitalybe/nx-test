import { loggerCreator } from "common/utils/logger";

const moduleLogger = loggerCreator(__filename);

export interface DsgsApiDsgType {
  id: string;
  dsNames: string[];
  dsResourceIds?: number;
}

export interface DsgsApiMappingType {
  timestamp: number;
  dsgs: DsgsApiDsgType[];
}

export interface DsgsApiResultType {
  mappings: DsgsApiMappingType[];
}

export interface ConfigApiServiceType {
  priority: "high" | "medium" | "low";
}

export interface ConfigApiNetworkType {
  id: string;
  preferred: string[];
  reserved: { dsgId: string; bw: number }[];
  qservices?: {
    wire: ConfigApiServiceType;
    cds?: ConfigApiServiceType;
    "isp-cdn"?: ConfigApiServiceType;
  };
}

export interface ConfigApiConfigurationType {
  timestamp: number;
  networks: ConfigApiNetworkType[];
}

export interface ConfigApiResultType {
  configurations: ConfigApiConfigurationType[];
}

export interface CapacityApiNetworkType {
  id: string;
  capacity: { bw: number };
}

export interface CapacityApiCapacityTimestamp {
  timestamp: number;
  networks: CapacityApiNetworkType[];
}

export interface CapacityApiResultType {
  capacities: CapacityApiCapacityTimestamp[];
}
