let lastMockId = 0;

export class MonitorSegmentEntity {
  constructor(public readonly id: string, public readonly healthCollectorIds: string[]) {}

  static createMock(id: number = (lastMockId += 1)) {
    return new MonitorSegmentEntity("Montior_Segment" + id.toString(), []);
  }
}
