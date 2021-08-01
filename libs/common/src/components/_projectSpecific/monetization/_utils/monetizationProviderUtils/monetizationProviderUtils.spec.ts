import { MonetizationApiSpMonthSampleType } from "common/backend/monetizationReports/_types/monetizationReportsTypes";
import { DateTime } from "luxon";
import { MonetizationProviderUtils } from "common/components/_projectSpecific/monetization/_utils/monetizationProviderUtils/monetizationProviderUtils";
import { QwiltPieChartPart } from "common/components/qwiltPieChart/_types";
import { MonetizationColors } from "common/components/_projectSpecific/monetization/_utils/monetizationColors";

describe("MonetizationProviderUtils", function () {
  it("should fill empty data points for monthly graphs", function () {
    const data: MonetizationApiSpMonthSampleType[] = [
      {
        reportId: "1",
        month: "12-2019",
        spRevenue: 17420.0,
        cqdaRevenue: 31980.0,
        overallRevenue: 49400.0,
        spRevenueFromProjectStart: 17420,
        cqdaRevenueFromProjectStart: 31980,
        overallRevenueFromProjectStart: 49400,
        volume: 39000000000,
      },
    ];

    const result = MonetizationProviderUtils.fillMissingSamples(
      data.length,
      13,
      DateTime.fromFormat(data[0].month, MonetizationProviderUtils.API_MONTH_FORMAT),
      "months"
    );
    const resultNulls = MonetizationProviderUtils.fillMissingSamples(
      data.length,
      13,
      DateTime.fromFormat(data[0].month, MonetizationProviderUtils.API_MONTH_FORMAT),
      "months",
      null
    );
    expect(result).toStrictEqual([
      { y: 0, index: 0, x: 1543615200000 }, // 12-2018
      { y: 0, index: 1, x: 1546293600000 }, // 1-2019
      { y: 0, index: 2, x: 1548972000000 }, // 2-2019
      { y: 0, index: 3, x: 1551391200000 }, // 3-2019
      { y: 0, index: 4, x: 1554066000000 }, // 4-2019
      { y: 0, index: 5, x: 1556658000000 }, // 5-2019
      { y: 0, index: 6, x: 1559336400000 }, // 6-2019
      { y: 0, index: 7, x: 1561928400000 }, // 7-2019
      { y: 0, index: 8, x: 1564606800000 }, // 8-2019
      { y: 0, index: 9, x: 1567285200000 }, // 9-2019
      { y: 0, index: 10, x: 1569877200000 }, // 10-2019
      { y: 0, index: 11, x: 1572559200000 }, // 11-2019
    ]);
    expect(resultNulls).toStrictEqual([
      { y: null, index: 0, x: 1543615200000 }, // 12-2018
      { y: null, index: 1, x: 1546293600000 }, // 1-2019
      { y: null, index: 2, x: 1548972000000 }, // 2-2019
      { y: null, index: 3, x: 1551391200000 }, // 3-2019
      { y: null, index: 4, x: 1554066000000 }, // 4-2019
      { y: null, index: 5, x: 1556658000000 }, // 5-2019
      { y: null, index: 6, x: 1559336400000 }, // 6-2019
      { y: null, index: 7, x: 1561928400000 }, // 7-2019
      { y: null, index: 8, x: 1564606800000 }, // 8-2019
      { y: null, index: 9, x: 1567285200000 }, // 9-2019
      { y: null, index: 10, x: 1569877200000 }, // 10-2019
      { y: null, index: 11, x: 1572559200000 }, // 11-2019
    ]);
  });

  it("should provide top 5 entities revenue distribution pie parts, with 'others' part", function () {
    const providerResult = MonetizationProviderUtils.generateOthersForPieParts(
      [
        {
          name: "ISP 1",
          y: 150,
          color: MonetizationColors.getIndexColor(0),
        },
        {
          name: "ISP 2",
          y: 200,
          color: MonetizationColors.getIndexColor(1),
        },
        {
          name: "ISP 3",
          y: 300,
          color: MonetizationColors.getIndexColor(2),
        },
        {
          name: "ISP 4",
          y: 400,
          color: MonetizationColors.getIndexColor(3),
        },
        {
          name: "ISP 5",
          y: 500,
          color: MonetizationColors.getIndexColor(4),
        },
        {
          name: "ISP 6",
          y: 600,
          color: MonetizationColors.getIndexColor(5),
        },
        {
          name: "ISP 7",
          y: 700,
          color: MonetizationColors.getIndexColor(5),
        },
      ],
      5
    );
    const expectedResult: QwiltPieChartPart[] = [
      {
        name: "ISP 7",
        y: 700,
        color: MonetizationColors.getIndexColor(0),
      },
      {
        name: "ISP 6",
        y: 600,
        color: MonetizationColors.getIndexColor(1),
      },
      {
        name: "ISP 5",
        y: 500,
        color: MonetizationColors.getIndexColor(2),
      },
      {
        name: "ISP 4",
        y: 400,
        color: MonetizationColors.getIndexColor(3),
      },
      {
        name: "ISP 3",
        y: 300,
        color: MonetizationColors.getIndexColor(4),
      },
      {
        name: "Others",
        y: 350,
        color: MonetizationColors.getIndexColor(5),
        children: [
          {
            name: "ISP 2",
            y: 200,
          },
          {
            name: "ISP 1",
            y: 150,
          },
        ],
      },
    ];
    expect(providerResult).toStrictEqual(expectedResult);
  });

  it("should provide top 5 entities revenue distribution pie parts, with 1 other correctly, showing the entity name", function () {
    const providerResult = MonetizationProviderUtils.generateOthersForPieParts(
      [
        {
          name: "ISP 1",
          y: 100,
          color: MonetizationColors.getIndexColor(1),
        },
        {
          name: "ISP 2",
          y: 200,
          color: MonetizationColors.getIndexColor(2),
        },
        {
          name: "ISP 3",
          y: 300,
          color: MonetizationColors.getIndexColor(3),
        },
        {
          name: "ISP 4",
          y: 400,
          color: MonetizationColors.getIndexColor(4),
        },
        {
          name: "ISP 5",
          y: 500,
          color: MonetizationColors.getIndexColor(5),
        },
        {
          name: "ISP 6",
          y: 600,
          color: MonetizationColors.getIndexColor(5),
        },
      ],
      5
    );
    const expectedResult: QwiltPieChartPart[] = [
      {
        name: "ISP 6",
        y: 600,
        color: MonetizationColors.getIndexColor(0),
      },
      {
        name: "ISP 5",
        y: 500,
        color: MonetizationColors.getIndexColor(1),
      },
      {
        name: "ISP 4",
        y: 400,
        color: MonetizationColors.getIndexColor(2),
      },
      {
        name: "ISP 3",
        y: 300,
        color: MonetizationColors.getIndexColor(3),
      },
      {
        name: "ISP 2",
        y: 200,
        color: MonetizationColors.getIndexColor(4),
      },
      {
        name: "ISP 1",
        y: 100,
        color: MonetizationColors.getIndexColor(5),
      },
    ];
    expect(providerResult).toStrictEqual(expectedResult);
  });
});
