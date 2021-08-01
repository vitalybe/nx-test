export enum FootprintTypeEnum {
  SUBNET = "subnets",
  ASN = "asn",
}

export interface DelegationApiEditType {
  footprintServiceName: string;
  serviceToken: string;
  cpEndpoint: string;
  footprintType: FootprintTypeEnum;
  ispId?: string;
}

export interface DelegationApiType extends DelegationApiEditType {
  id: string;
}

export interface DelegationsApiResult {
  delegations: Record<string, DelegationApiType>;
}
