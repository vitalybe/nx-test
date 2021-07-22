import { MetadataServiceTypeEnum } from "../../deliveryServices/_types/deliveryServiceMetadataTypes";

export interface DeliveryAgreementNetworkApiType {
  uniqueName: string;
  uiName: string;
  country: string;
}

export interface DeliveryAgreementSpApiType {
  orgId: string;
  uiName: string;
}

export interface DeliveryAgreementCpApiType {
  orgId: string;
  uiName: string;
}

export interface DeliveryAgreementDsMetadataApiType {
  reportingName: string;
  contentGroupId: number;
  userFriendlyName: string;
  type: MetadataServiceTypeEnum;
}

export interface DeliveryAgreementApiEntity {
  daId: string;
  dsMetadataId: string;
  networkId: number;
  cpOrgId?: string;
  spOrgId?: string;
  dsMetadata?: DeliveryAgreementDsMetadataApiType;
  network?: DeliveryAgreementNetworkApiType;
  contentPublisher?: DeliveryAgreementCpApiType;
  serviceProvider?: DeliveryAgreementSpApiType;
}

export interface DeliveryAgreementUpdateApiEntity {
  dsMetadataId: string;
  networkId: number;
}
