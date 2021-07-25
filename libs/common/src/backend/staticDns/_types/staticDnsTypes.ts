export interface StaticDnsApiResult {
  staticDnsResponseList: StaticDnsApiType[];
}

export interface StaticDnsApiType extends StaticDnsEditApiType {
  orgId: string;
}

export interface StaticDnsEditApiType {
  deliveryServiceId: string;
  cdnId: string;
  type: string;
  name: string;
  ttl: string;
  value: string;
  dnsRecordId: string;
}
