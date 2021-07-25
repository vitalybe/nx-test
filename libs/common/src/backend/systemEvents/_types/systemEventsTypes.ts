import { ParamValue } from "common/backend/_utils/urlParams";

// region [[common types]]
export enum SystemUpdateTypeEnum {
  SCHEDULED = "scheduled",
  TIMELY = "timely",
}

export type SystemUpdateType = SystemUpdateTypeEnum | MethodType;

export interface ScopeTypeDs {
  scopeType: "deliveryService";
  dsScopeDetails?: {
    ids: string[];
  };
}

export interface ScopeTypeQn {
  scopeType: "qnDeployment";
  qnDeploymentScopeDetails?: {
    ids: number[];
  };
}

export enum ComponentTypeEnum {
  QCP_VERSION = "qcpVersion",
  QCP_CONFIGURATION = "qcpConfiguration",
  DS_UPDATE = "dsUpdate",
}

type SystemUpdateExposureType = "public" | "internal";
type MethodType = "scheduled" | "timely";
//endregion

// region [[internal api]]
export interface SystemUpdateInternalApiPayloadType {
  startTimeEpoch: number;
  expectedDuration: number;
  lateArrivalDuration: number;
  component: ComponentTypeEnum;
  method: MethodType;
  expectedEffect: string;
  exposure: SystemUpdateExposureType;
  externalDescription: string;
  internalDescription: string;
  metaData: {
    deliveryServices?: null;
    qcp?: unknown;
  };
  links?: unknown;
  scope: (ScopeTypeQn | ScopeTypeDs)[];
}

export interface SystemUpdateInternalApiType extends SystemUpdateInternalApiPayloadType {
  updateId: string;
}

export interface SystemUpdatesInternalResult {
  updates: SystemUpdateInternalApiType[];
}
//endregion

// region [[external api]]
export interface SystemEventsExternalSearchParams {
  [key: string]: ParamValue;
  from?: number;
  to?: number;
  qnIds?: string[];
  itemsPerPage?: number;
  pageNumber?: number;
}

export interface SystemUpdateExternalApiType {
  updateId: string;
  startTimeEpoch: number;
  startTime: string;
  endTimeEpoch: number;
  endTime: string;
  component: ComponentTypeEnum;
  method: MethodType;
  expectedEffect: string;
  description: string;
  metaData: {
    deliveryServices?: string[];
    qcp?: unknown;
  };
}

export interface SystemEventApiType {
  eventId: string;
  updateId: string | null;
  timestampEpoch: number;
  timestamp: string;
  systemId: string;
  qnName: string;
  location: string;
  component: ComponentTypeEnum;
  updateMethod: MethodType;
  expectedEffect: string | null;
  description: string | null;
  metaData: {
    deliveryServices?:
      | null
      | {
          name: string;
        }[];
  };
}

export interface SystemUpdatesExternalResult {
  updates: SystemUpdateExternalApiType[];
}

export interface SystemEventsApiResult {
  events: SystemEventApiType[];
}
//endregion
