import { ParamsMetadataType } from "common/components/applicationParameters/_types/paramsMetadataTypes";

export enum Params {
  SELECTED_CDN_ID = "selectedCdnId",
  //general app params
  SELECTED_CDN_ENDPOINT = "cdnEndpoint",
  SELECTED_PLANE = "planeId",
  SELECTED_SYSTEM = "systemId",
  SELECTED_SYSTEM_GROUP = "systemTypeGroup",
  //parcels page
  SELECTED_PARCEL = "parcelId",
  //hostname prefixes
  CSM_HOSTNAME_PREFIX = "csmHostnamePrefix",
  TRANSPORT_HOSTNAME_PREFIX = "transportHostnamePrefix",
}

export const Metadata: { [key in Params]?: ParamsMetadataType } = {};
