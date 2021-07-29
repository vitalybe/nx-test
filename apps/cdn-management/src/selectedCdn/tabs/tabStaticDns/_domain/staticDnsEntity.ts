let lastMockId = 1;

export class StaticDnsEntity {
  constructor(
    public readonly cdnId: string,
    public readonly type: string,
    public readonly name: string,
    public readonly ttl: string,
    public readonly value: string,
    public readonly dnsRecordId: string,
    public readonly orgId: string,
    public readonly deliveryServiceId: string
  ) {}

  static createMock(id: number = (lastMockId += 1)) {
    return new StaticDnsEntity(
      "cdn_id",
      id.toString(),
      "http://test.steam-content-dnld-1.opencaching.tc-cdn-i.tc-rnd.cqloud.com/",
      "300",
      "17.9.19.83",
      "c89ebe93-5e0e-4068-a645-7d2d7d738109",
      "devorg",
      "2"
    );
  }
}
