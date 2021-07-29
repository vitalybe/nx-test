let lastMockId = 0;

export class DnsSegmentEntity {
  constructor(public readonly id: string, public readonly subDomain: string) {}

  static createMock(id: number = (lastMockId += 1)) {
    const dnsSegmentEntity = new DnsSegmentEntity("DNS_Segment" + id.toString(), "north");
    return dnsSegmentEntity;
  }

  static createEmpty() {
    const dnsSegmentEntity = new DnsSegmentEntity("", "");
    return dnsSegmentEntity;
  }
}
