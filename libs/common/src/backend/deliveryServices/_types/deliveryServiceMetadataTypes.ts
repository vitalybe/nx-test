import { Optional } from "../../../utils/typescriptUtils";

export interface DeliveryServiceMetadataEditApiType {
  reportingName: string;
  contentGroupId: number;
  userFriendlyName: string;
  type: MetadataServiceTypeEnum;
}

export interface DeliveryServiceMetadataIconType {
  iconData: string | null;
}

export interface DeliveryServiceMetadataApiResult extends DeliveryServiceMetadataEditApiType {
  metadataId: string;
  ownerOrgId: string;
  delegationTargets: string[];
}

export enum MetadataServiceTypeEnum {
  LIVE = "live",
  VOD = "vod",
  MUSIC = "music",
  SOFTWARE_DOWNLOAD = "software_download",
}

export type DeliveryServiceMetadataCreateApiType = DeliveryServiceMetadataEditApiType &
  Optional<DeliveryServiceMetadataIconType>;

// region [[ Overtime ]]
