export enum CapabilitiesEnum {
  HTTP_ERROR_CACHED_NOT_CACHED = "HTTP_ERROR_CACHED_NOT_CACHED",
  SPECIFIC_HTTP_STATUS_CODE = "SPECIFIC_HTTP_STATUS_CODE",
  TRAFFIC_SPLITTING = "TRAFFIC_SPLITTING",
}
export type CapabilitiesApiResult = CapabilityApiType[];
export interface CapabilityApiType {
  id: CapabilitiesEnum;
  allowed: boolean;
}
