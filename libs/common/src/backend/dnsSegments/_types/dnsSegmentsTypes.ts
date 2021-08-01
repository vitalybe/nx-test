export interface DnsSegmentsApiResult {
  dnsRoutingSegments: Record<string, DnsSegmentsApiType>;
}

export interface DnsSegmentsApiType {
  dnsRoutingSegmentId: string;
  subDomain: string;
}
