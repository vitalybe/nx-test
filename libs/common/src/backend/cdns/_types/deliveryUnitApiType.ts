export enum CacheOperationalModeApiEnum {
  ONLINE = "online",
  OFFLINE = "offline",
  FORCE_ONLINE = "force-online",
  OUT_OF_SERVICE = "out-of-service",
}

export interface DeliveryUnitHealthProfileApiType {
  healthMinAvailableBwKbpsEnabled: boolean;
  healthMinAvailableBwKbps: number;
  healthMaxLoadAverage: number;
  healthMaxQueryTimeMs: number;
  healthConnectionTimeoutMs: number;
  healthHistoryCount: number;
  healthPollUrlTemplate: string | null;
  healthSampleTimeMs: number;
  healthReportTimeMs: number;
  healthRequestTimeoutMs: number;
  healthRequestTimeWarnMs: number;
}

export interface DeliveryUnitInterfaceApiType {
  interfaceName: string;
  routingName: string;
  hashId: string | null;
  hashCount: number | null;
  hashCountOffset: number | null;
}

export interface DeliveryUnitEditApiType extends DeliveryUnitHealthProfileApiType {
  name: string;
  systemId: string;
  cacheHashId: string;
  operationalMode: CacheOperationalModeApiEnum;
  duGroupId: string;
  deliveryUnitInterfaces: {
    [key: string]: DeliveryUnitInterfaceApiType;
  };
  monitoringSegmentId: string | undefined;
}

export interface DeliveryUnitApiType extends DeliveryUnitEditApiType {
  cdnId: string;
  deliveryUnitId: string;
  numericId: number;
  networkId: number | null;
}

export interface DeliveryUnitApiResult {
  deliveryUnits: DeliveryUnitApiType[];
}
