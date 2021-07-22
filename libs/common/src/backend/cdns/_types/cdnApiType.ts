export interface CdnEditApiType {
  name: string;
  httpSubDomain: string;
  httpRootHostedZone: string;
  httpCdnSubDomain: string;
  operationalDomain?: string;
  dnsSubDomain: string;
  ctrSubDomain?: string | null;
  dnsRootHostedZone: string;
  dnsCdnSubDomain: string;
  description?: string;
}

export interface CdnApiType extends CdnEditApiType {
  cdnId: string;
}

export interface CdnApiResult {
  cdns: CdnApiType[];
  _links?: unknown;
}
