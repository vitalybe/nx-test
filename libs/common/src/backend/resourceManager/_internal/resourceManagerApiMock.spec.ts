import { ResourceManagerApiMock } from "common/backend/resourceManager";
import { AjaxMetadata } from "common/utils/ajax";
import { Duration } from "luxon";
import mockData from "common/backend/_utils/mockData";

describe("ResourceManagerApiMock", function() {
  it("should return capacity", async () => {
    const BW_1 = 100;
    const BW_2 = 50;
    const NETWORK = mockData.networks[0];

    const FROM = 0;
    const TO = 10;

    ResourceManagerApiMock.instance.mockConfig = {
      ...ResourceManagerApiMock.instance.mockConfig,
      cycle: Duration.fromObject({ second: 10 }),
      capacity: [
        { percentOfCycle: 0, bw: BW_1 },
        { percentOfCycle: 70, bw: BW_2 },
      ],
    };
    const result = await ResourceManagerApiMock.instance.getCapacity(FROM, TO, [NETWORK], new AjaxMetadata());
    expect(result.capacities.length).toBe(2);
    expect(result.capacities[0]).toMatchObject({ timestamp: 0, networks: [{ id: NETWORK, capacity: { bw: BW_1 } }] });
    expect(result.capacities[1]).toMatchObject({ timestamp: 7, networks: [{ id: NETWORK, capacity: { bw: BW_2 } }] });
  });

  it("should return cycling capacity for longer cycle", async () => {
    const BW_1 = 100;
    const BW_2 = 50;
    const NETWORK = mockData.networks[0];

    const FROM = 0;
    const TO = 20;

    ResourceManagerApiMock.instance.mockConfig = {
      ...ResourceManagerApiMock.instance.mockConfig,
      cycle: Duration.fromObject({ second: 10 }),
      capacity: [
        { percentOfCycle: 0, bw: BW_1 },
        { percentOfCycle: 70, bw: BW_2 },
      ],
    };
    const result = await ResourceManagerApiMock.instance.getCapacity(FROM, TO, [NETWORK], new AjaxMetadata());
    expect(result.capacities.length).toBe(4);
    expect(result.capacities[0]).toMatchObject({ timestamp: 0, networks: [{ id: NETWORK, capacity: { bw: BW_1 } }] });
    expect(result.capacities[1]).toMatchObject({ timestamp: 7, networks: [{ id: NETWORK, capacity: { bw: BW_2 } }] });
    expect(result.capacities[2]).toMatchObject({ timestamp: 10, networks: [{ id: NETWORK, capacity: { bw: BW_1 } }] });
    expect(result.capacities[3]).toMatchObject({ timestamp: 17, networks: [{ id: NETWORK, capacity: { bw: BW_2 } }] });
  });

  it("should return only percents within requested to/from", async () => {
    const BW_1 = 100;
    const BW_2 = 50;
    const NETWORK = mockData.networks[0];

    const CYCLE = 10;
    const FROM = 5;
    const TO = 15;

    ResourceManagerApiMock.instance.mockConfig = {
      ...ResourceManagerApiMock.instance.mockConfig,
      cycle: Duration.fromObject({ second: CYCLE }),
      capacity: [
        { percentOfCycle: 0, bw: BW_1 },
        { percentOfCycle: 70, bw: BW_2 },
      ],
    };
    const result = await ResourceManagerApiMock.instance.getCapacity(FROM, TO, [NETWORK], new AjaxMetadata());
    expect(result.capacities.length).toBe(2);
    expect(result.capacities[0]).toMatchObject({ timestamp: 7, networks: [{ id: NETWORK, capacity: { bw: BW_2 } }] });
    expect(result.capacities[1]).toMatchObject({ timestamp: 10, networks: [{ id: NETWORK, capacity: { bw: BW_1 } }] });
  });
});
