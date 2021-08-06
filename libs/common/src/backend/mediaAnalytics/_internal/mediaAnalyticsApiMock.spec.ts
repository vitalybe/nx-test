import * as _ from "lodash";

import { TimeConfig } from "../../../utils/timeConfig";
import { MediaAnalyticsSeries } from "../mediaAnalyticsSeries";
import { MediaAnalyticsApiMock } from "../../mediaAnalytics";
import { DateTime, Duration } from "luxon";
import {
  ApiHistogramBin,
  ApiHistogramGroupBin,
  ApiHistogramType,
} from "../mediaAnalyticsTypes";

const allPossibleFilters = {
  dsgs: ["dsg1", "dsg2"],
  geos: ["geo1", "geo2"],
  systems: ["system1", "system2"],
  sites: ["site1", "site2"],
};

describe("mediaAnalyticsApiMock", function() {
  it("should return a histogram with one series", async () => {
    const mediaAnalyticsApi = MediaAnalyticsApiMock.instance;

    mediaAnalyticsApi.mockConfigOfMediaAnalytics = {
      ...mediaAnalyticsApi.mockConfigOfMediaAnalytics,
      // base of bin values for the minimum interval of the series
      valueForMinBinInterval: 1,
      minBinInterval: Duration.fromObject({ second: 1 }),
      autoAdjustTimeConfig: false,
    };

    const fromDate = DateTime.fromSeconds(0);
    const toDate = DateTime.fromSeconds(10);
    const binInterval = Duration.fromObject({ second: 1 });

    const result = await mediaAnalyticsApi.getHistogram(new TimeConfig(fromDate, toDate, binInterval), [
      MediaAnalyticsSeries.L2_BW_DELIVERED,
    ]);

    const resultReport = result.report as ApiHistogramType;
    expect(resultReport.reports.overtime.histogram.bins).toHaveLength(10);
    expect(
      resultReport.reports.overtime.histogram.bins.every(
        bin => bin.series[MediaAnalyticsSeries.L2_BW_DELIVERED.name] === 1
      )
    ).toBeTruthy();
  });

  it("should return a larger value for larger binInterval but will have same sum", async () => {
    const mediaAnalyticsApi = MediaAnalyticsApiMock.instance;

    mediaAnalyticsApi.mockConfigOfMediaAnalytics = {
      ...mediaAnalyticsApi.mockConfigOfMediaAnalytics,
      // base of bin values for the minimum interval of the series
      valueForMinBinInterval: 1,
      minBinInterval: Duration.fromObject({ second: 1 }),
      autoAdjustTimeConfig: false,
    };

    const fromDate = DateTime.fromSeconds(0);
    const toDate = DateTime.fromSeconds(10);

    const binInterval1 = Duration.fromObject({ second: 1 });
    const resultBinInterval1 = await mediaAnalyticsApi.getHistogram(new TimeConfig(fromDate, toDate, binInterval1), [
      MediaAnalyticsSeries.L2_BW_DELIVERED,
    ]);

    const binInterval2 = Duration.fromObject({ second: 2 });
    const resultBinInterval2 = await mediaAnalyticsApi.getHistogram(new TimeConfig(fromDate, toDate, binInterval2), [
      MediaAnalyticsSeries.L2_BW_DELIVERED,
    ]);

    const bins1 = resultBinInterval1.report.reports.overtime.histogram.bins as ApiHistogramBin[];
    const bins2 = resultBinInterval2.report.reports.overtime.histogram.bins as ApiHistogramBin[];
    expect(bins1).toHaveLength(10);
    expect(bins2).toHaveLength(5);

    const bin1Sum = _.sumBy(bins1, bin => bin.series[MediaAnalyticsSeries.L2_BW_DELIVERED.name]);
    const bin2Sum = _.sumBy(bins1, bin => bin.series[MediaAnalyticsSeries.L2_BW_DELIVERED.name]);
    expect(bin1Sum).toEqual(bin2Sum);
  });

  it("should return a histogram grouped by dsg", async () => {
    const mediaAnalyticsApi = MediaAnalyticsApiMock.instance;

    const BIN_VALUE = 10;
    mediaAnalyticsApi.mockConfigOfMediaAnalytics = {
      ...mediaAnalyticsApi.mockConfigOfMediaAnalytics,
      // base of bin values for the minimum interval of the series
      valueForMinBinInterval: BIN_VALUE,
      minBinInterval: Duration.fromObject({ second: 1 }),
      possibleFilters: allPossibleFilters,
      autoAdjustTimeConfig: false,
    };

    const fromDate = DateTime.fromSeconds(0);
    const toDate = DateTime.fromSeconds(10);
    const binInterval = Duration.fromObject({ second: 1 });

    const result = await mediaAnalyticsApi.getHistogram(
      new TimeConfig(fromDate, toDate, binInterval),
      [MediaAnalyticsSeries.L2_BW_DELIVERED],
      { group_by: "dsgs" }
    );

    const bins = result.report.reports.overtime.histogram.bins as ApiHistogramGroupBin[];
    expect(bins).toHaveLength(10);
    expect(bins[0].group.dsg![allPossibleFilters.dsgs[0]]!.series[MediaAnalyticsSeries.L2_BW_DELIVERED.name]).toEqual(
      BIN_VALUE / 2
    );
    expect(bins[0].group.dsg![allPossibleFilters.dsgs[1]]!.series[MediaAnalyticsSeries.L2_BW_DELIVERED.name]).toEqual(
      BIN_VALUE / 2
    );
  });

  it("should return data restricted by SystemId", async () => {
    const mediaAnalyticsApi = MediaAnalyticsApiMock.instance;

    mediaAnalyticsApi.mockConfigOfMediaAnalytics = {
      ...mediaAnalyticsApi.mockConfigOfMediaAnalytics,
      // base of bin values for the minimum interval of the series
      valueForMinBinInterval: 1,
      minBinInterval: Duration.fromObject({ second: 1 }),
      autoAdjustTimeConfig: false,
      possibleFilters: allPossibleFilters,
    };

    const fromDate = DateTime.fromSeconds(0);
    const toDate = DateTime.fromSeconds(10);
    const binInterval = Duration.fromObject({ second: 1 });

    const result = await mediaAnalyticsApi.getHistogram(
      new TimeConfig(fromDate, toDate, binInterval),
      [MediaAnalyticsSeries.L2_BW_DELIVERED],
      { systems: [allPossibleFilters.systems[0]] }
    );

    const resultReport = result.report as ApiHistogramType;
    expect(resultReport.reports.overtime.histogram.bins).toHaveLength(10);
    expect(
      resultReport.reports.overtime.histogram.bins.every(
        bin => bin.series[MediaAnalyticsSeries.L2_BW_DELIVERED.name] === 0.5
      )
    ).toBeTruthy();
  });

  it("should return data restricted by both DSG 1 and SystemId 1", async () => {
    const mediaAnalyticsApi = MediaAnalyticsApiMock.instance;

    mediaAnalyticsApi.mockConfigOfMediaAnalytics = {
      ...mediaAnalyticsApi.mockConfigOfMediaAnalytics,
      // base of bin values for the minimum interval of the series
      valueForMinBinInterval: 1,
      minBinInterval: Duration.fromObject({ second: 1 }),
      autoAdjustTimeConfig: false,
      possibleFilters: allPossibleFilters,
    };

    const fromDate = DateTime.fromSeconds(0);
    const toDate = DateTime.fromSeconds(10);
    const binInterval = Duration.fromObject({ second: 1 });

    const result = await mediaAnalyticsApi.getHistogram(
      new TimeConfig(fromDate, toDate, binInterval),
      [MediaAnalyticsSeries.L2_BW_DELIVERED],
      { systems: [allPossibleFilters.systems[0]], dsgs: [allPossibleFilters.dsgs[0]] }
    );

    const resultReport = result.report as ApiHistogramType;
    expect(resultReport.reports.overtime.histogram.bins).toHaveLength(10);
    expect(
      resultReport.reports.overtime.histogram.bins.every(
        bin => bin.series[MediaAnalyticsSeries.L2_BW_DELIVERED.name] === 0.25
      )
    ).toBeTruthy();
  });

  it("should return data restricted by both DSG 1 and SystemId 2", async () => {
    const mediaAnalyticsApi = MediaAnalyticsApiMock.instance;

    mediaAnalyticsApi.mockConfigOfMediaAnalytics = {
      ...mediaAnalyticsApi.mockConfigOfMediaAnalytics,
      // base of bin values for the minimum interval of the series
      valueForMinBinInterval: 1,
      minBinInterval: Duration.fromObject({ second: 1 }),
      autoAdjustTimeConfig: false,
      possibleFilters: allPossibleFilters,
    };

    const fromDate = DateTime.fromSeconds(0);
    const toDate = DateTime.fromSeconds(10);
    const binInterval = Duration.fromObject({ second: 1 });

    const result = await mediaAnalyticsApi.getHistogram(
      new TimeConfig(fromDate, toDate, binInterval),
      [MediaAnalyticsSeries.L2_BW_DELIVERED],
      { systems: [allPossibleFilters.systems[0]], dsgs: [allPossibleFilters.dsgs[1]] }
    );

    const resultReport = result.report as ApiHistogramType;
    expect(resultReport.reports.overtime.histogram.bins).toHaveLength(10);
    expect(
      resultReport.reports.overtime.histogram.bins.every(
        bin => bin.series[MediaAnalyticsSeries.L2_BW_DELIVERED.name] === 0.25
      )
    ).toBeTruthy();
  });

  it("should return all data by specifiying ALL DSGs manually", async () => {
    const BIN_VALUE = 1;

    const mediaAnalyticsApi = MediaAnalyticsApiMock.instance;

    mediaAnalyticsApi.mockConfigOfMediaAnalytics = {
      ...mediaAnalyticsApi.mockConfigOfMediaAnalytics,
      // base of bin values for the minimum interval of the series
      valueForMinBinInterval: BIN_VALUE,
      minBinInterval: Duration.fromObject({ second: 1 }),
      autoAdjustTimeConfig: false,
      possibleFilters: allPossibleFilters,
    };

    const fromDate = DateTime.fromSeconds(0);
    const toDate = DateTime.fromSeconds(10);
    const binInterval = Duration.fromObject({ second: 1 });

    const result = await mediaAnalyticsApi.getHistogram(
      new TimeConfig(fromDate, toDate, binInterval),
      [MediaAnalyticsSeries.L2_BW_DELIVERED],
      { dsgs: [allPossibleFilters.dsgs[0], allPossibleFilters.dsgs[1]] }
    );

    const resultReport = result.report as ApiHistogramType;
    expect(resultReport.reports.overtime.histogram.bins).toHaveLength(10);
    expect(
      resultReport.reports.overtime.histogram.bins.every(
        bin => bin.series[MediaAnalyticsSeries.L2_BW_DELIVERED.name] === BIN_VALUE
      )
    ).toBeTruthy();
  });

  it("should return a histogram grouped by dsg and limited by systemId", async () => {
    const BIN_VALUE = 10;
    // 2 dsgs and 2 systems
    // we're grouping by dsg, so each bin value would be 1/2
    // then we're also filtering by specific system id, this: 1/4
    const EXPECTED_PART_OF_BIN = 1 / 4;

    const mediaAnalyticsApi = MediaAnalyticsApiMock.instance;

    mediaAnalyticsApi.mockConfigOfMediaAnalytics = {
      ...mediaAnalyticsApi.mockConfigOfMediaAnalytics,
      // base of bin values for the minimum interval of the series
      valueForMinBinInterval: BIN_VALUE,
      minBinInterval: Duration.fromObject({ second: 1 }),
      possibleFilters: allPossibleFilters,
      autoAdjustTimeConfig: false,
    };

    const fromDate = DateTime.fromSeconds(0);
    const toDate = DateTime.fromSeconds(10);
    const binInterval = Duration.fromObject({ second: 1 });

    const result = await mediaAnalyticsApi.getHistogram(
      new TimeConfig(fromDate, toDate, binInterval),
      [MediaAnalyticsSeries.L2_BW_DELIVERED],
      { group_by: "dsgs", systems: [allPossibleFilters.systems[0]] }
    );

    const bins = result.report.reports.overtime.histogram.bins as ApiHistogramGroupBin[];
    expect(bins).toHaveLength(10);
    expect(bins[0].group.dsg![allPossibleFilters.dsgs[0]]!.series[MediaAnalyticsSeries.L2_BW_DELIVERED.name]).toEqual(
      BIN_VALUE * EXPECTED_PART_OF_BIN
    );
    expect(bins[0].group.dsg![allPossibleFilters.dsgs[1]]!.series[MediaAnalyticsSeries.L2_BW_DELIVERED.name]).toEqual(
      BIN_VALUE * EXPECTED_PART_OF_BIN
    );
  });
});
