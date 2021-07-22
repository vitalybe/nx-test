export enum GeoDeploymentParamsEnum {
  CONTAINED_IN_RECURSIVE = "contained_in_recursive",
  CONTAINS_RECURSIVE = "contains_recursive",

  IDS = "ids",
  ISPS = "isps",
  ENTITIES_LIST_FORMAT = "entitiesListFormat",
  CONTAINS_LIST_FORMAT = "containsListFormat",
  CONTAINS_LIST_RECURSIVE = "containsListRecursive",
}

export type GeoEntitiesParams = { [key in GeoDeploymentParamsEnum]?: string | boolean } & {
  types?: ApiGeoEntityType;
  notTypes?: ApiGeoEntityType;
};

export interface ApiGeoEntities {
  entities: ApiGeoEntity[];
  debugSection?: ApiGeoDebug;
}
export interface ApiIspEntities {
  isps: ApiIspEntity[];
  debugSection?: ApiIspsDebug;
}

export interface ApiCoverageAggregation {
  ids: string[];
  coveragePercentage: number;
}

export interface ApiGeoEntity {
  id: string;
  displayName: string;
  isoName: string;
  type: ApiGeoEntityType;
  coveragePercentage: number;
  isps: ApiContainedIsp[];
  contains: ApiGeoEntity[];
  lat: number;
  lng: number;
}

export enum ApiGeoEntityType {
  AREA = "area",
  CONTINENT = "continent",
  COUNTRY = "country",
  STATE = "state",
  ISP = "isp",
}

export interface ApiIspEntity {
  id: string;
  displayName: string;
  autonomousSystems: ApiContainedAsn[];
}

export interface ApiContainedAsn {
  asn: string;
  description: string;
}
export interface ApiContainedIsp {
  id: string;
  coveragePercent: number;
  coordinates: { x: number; y: number }[];
}

export interface ApiLocationCoordinates {
  lat: number;
  lng: number;
}

export interface ApiDebug {
  request: string;
}
interface ApiIspsDebug extends ApiDebug {
  ispsLastUpdated: string;
}
interface ApiGeoDebug extends ApiDebug {
  geoLastUpdated: string;
  ispsLastUpdated: string;
  coverageLastUpdated: string;
}
