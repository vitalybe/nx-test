import { BarChartDataItem } from "common/components/_projectSpecific/dsDashboardComponents/barChart/_types/_types";
import { CommonColors as Colors } from "common/styling/commonColors";
import _ from "lodash";
import { HierarchyUtils } from "common/utils/hierarchyUtils";

export class BarChartModel {
  data!: BarChartDataItem[];

  constructor(data: Pick<BarChartModel, "data">) {
    Object.assign(this, data);
  }

  get maxValue() {
    return _.maxBy(HierarchyUtils.flatEntitiesHierarchy(this.data), item => item.value)?.value || 0;
  }

  get sum() {
    return _.sumBy(this.data, item => item.value || 0);
  }

  getItem(id: string | number) {
    return HierarchyUtils.flatEntitiesHierarchy(this.data).find(item => item.id === id);
  }

  // Mock
  static createMock(overrides?: Partial<BarChartModel>) {
    const mockData = mockChartBarItems();
    return new BarChartModel({
      ...overrides,
      data: mockData,
    });
  }
}

function mockChartBarItems() {
  return [
    {
      id: 1,
      name: "Charter",
      value: 55,
      color: Colors.getIspIndexColor(0),
      children: [
        {
          id: 5,
          name: "Steam Software Delivery Service",
          value: 25,
          color: Colors.NEON_BLUE,
          children: [
            {
              id: 6,
              name: "Steam_Ver_GA",
              value: 45,
              color: Colors.TURQUOISE_BLUE,
            },
          ],
        },
        {
          id: 7,
          name: "Steam Broadcasting Delivery Service",
          value: 35,
          color: Colors.NEON_BLUE,
          children: [
            {
              id: 8,
              name: "Steam_Ver_GA",
              value: 45,
              color: Colors.TURQUOISE_BLUE,
            },
          ],
        },
      ],
    },
    {
      id: 2,
      name: "Verizon Fios",
      value: 78,
      color: Colors.getIspIndexColor(1),
    },
    {
      id: 3,
      name: "PLDT",
      value: 23,
      color: Colors.getIspIndexColor(2),
    },
    {
      id: 4,
      name: "Mediacom",
      value: 48,
      color: Colors.getIspIndexColor(3),
    },
  ];
}
