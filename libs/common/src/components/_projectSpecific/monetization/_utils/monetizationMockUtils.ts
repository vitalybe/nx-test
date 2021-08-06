import { DateTime, Duration } from "luxon";
import { HistogramPoint } from "../../../../utils/histograms/domain/histogramPoint";
import _ from "lodash";
import { ChartSeriesData } from "../../../qwiltChart/_domain/chartSeriesData";
import { ColumnChartSeriesOptions } from "highcharts";
import { HistogramSeries } from "../../../../utils/histograms/domain/histogramSeries";
import { UnitKindEnum } from "../../../../utils/unitsFormatter";
import { CommonColors } from "../../../../styling/commonColors";
import { MonetizationColors } from "./monetizationColors";
import { darken } from "polished";
import {
  CAPACITY_UTIL_PEAK_SERIES_ID,
  CAPACITY_UTIL_REST_SERIES_ID,
} from "../reports/monetizationMiniCharts/capacityUtilizationChart/CapacityUtilizationChart";

function createMockPoints(startDate: DateTime, endDate: DateTime, interval: Duration): HistogramPoint[] {
  const data: HistogramPoint[] = [];
  let i = 0;
  let currentDate = startDate;
  while (currentDate.toMillis() <= endDate.toMillis()) {
    const point = new HistogramPoint(i, currentDate.toMillis(), (i + 1) * 73_000);
    point.date = currentDate;
    data.push(point);
    currentDate = currentDate.plus(interval);
    i++;
  }
  return data;
}

export function createYearOfMonthlyMockPoints() {
  const endDate = DateTime.local().set({ day: 15, hour: 15 }).startOf("hour");
  const startDate = endDate.minus({ months: 12 });
  return createMockPoints(startDate, endDate, Duration.fromObject({ months: 1 }));
}

/* creating an array of "years" of project data
 to dynamically display parts of the project and demonstrate phases */
export function createYearsOfMockProjectData() {
  const data: HistogramPoint[][] = [];
  const years = [2020, 2021, 2022, 2023, 2024];
  for (const year of years) {
    data.push(
      _.range(1, 13).map((n, i) => ({
        index: years.indexOf(year) * 12 + i,
        x: DateTime.fromObject({ year, month: n }).toMillis(),
        y: (years.indexOf(year) * 12 + n) * 73_000,
      }))
    );
  }
  return data;
}

export function createPeakBandwidthSeriesData(data = createYearOfMonthlyMockPoints()) {
  return new ChartSeriesData<ColumnChartSeriesOptions>({
    name: "Peak Bandwidth",
    histogram: new HistogramSeries("Peak Bandwidth", data),
    type: "column",
    stacking: "normal",
    color: CommonColors.MAYA_BLUE,
    unitType: UnitKindEnum.TRAFFIC,
    // important - must define this in when implementing provider to have hover state working
    userOptions: {
      states: {
        hover: {
          color: CommonColors.DARKEN_MAYA_BLUE,
        },
      },
    },
  });
}

export function createVolumeSeriesData(data = createYearOfMonthlyMockPoints()) {
  return new ChartSeriesData<ColumnChartSeriesOptions>({
    name: "Volume",
    histogram: new HistogramSeries("Volume", data),
    type: "column",
    stacking: "normal",
    color: CommonColors.TURQUOISE_BLUE,
    unitType: UnitKindEnum.VOLUME,
    // important - must define this in when implementing provider to have hover state working
    userOptions: {
      states: {
        hover: {
          color: CommonColors.DARKEN_TURQUOISE_BLUE,
        },
      },
    },
  });
}

export function createMockMonthlyRevenue() {
  const cqdaData = createYearOfMonthlyMockPoints();
  const ispData = createYearOfMonthlyMockPoints().map(({ y, ...point }) => ({ y: y ? y / 4 : 0, ...point }));
  return [
    createMockMonthlyRevenueSeriesData(true, cqdaData, true),
    createMockMonthlyRevenueSeriesData(false, ispData, true),
  ];
}
export function createMockMonthlyRevenueSeriesData(
  isQwiltSeries: boolean,
  data: HistogramPoint[],
  withHoverState: boolean
) {
  const color = isQwiltSeries ? MonetizationColors.CQDA_COLOR : MonetizationColors.SP_COLOR;
  const id = isQwiltSeries ? "qwilt-revenue-series" : "sp-revenue-series";
  const name = isQwiltSeries ? "CQDA" : "SP";
  return new ChartSeriesData({
    id,
    name,
    histogram: new HistogramSeries(name, data),
    type: "column",
    stacking: "normal",
    color,
    // important - must define this in when implementing provider to have hover state working
    userOptions: {
      states: {
        hover: {
          color: withHoverState ? darken(0.2, color) : color,
        },
      },
    } as ColumnChartSeriesOptions,
  });
}

export function createCapacitySeriesData(data: HistogramPoint[], configuredReserved: number) {
  return [
    new ChartSeriesData<ColumnChartSeriesOptions>({
      id: CAPACITY_UTIL_REST_SERIES_ID,
      name: "Rest of Capacity",
      histogram: new HistogramSeries(
        "Rest of Capacity",
        data.map(({ y, ...point }) => ({ y: Math.max(configuredReserved - (y ?? 0), 0), ...point }))
      ),
      type: "column",
      stacking: "percent",
      color: CommonColors.PATTENS_BLUE,
      unitType: UnitKindEnum.TRAFFIC,
      // important - must define this in when implementing provider to have hover state working
      userOptions: {
        enableMouseTracking: false,
        states: {
          hover: {
            color: CommonColors.PATTENS_BLUE,
          },
        },
      },
    }),
    new ChartSeriesData<ColumnChartSeriesOptions>({
      id: CAPACITY_UTIL_PEAK_SERIES_ID,
      name: "Peak Utilization",
      histogram: new HistogramSeries("Peak Utilization (bps)", data),
      type: "column",
      stacking: "percent",
      color: MonetizationColors.UTILIZATION_COLOR,
      unitType: UnitKindEnum.TRAFFIC,
      // important - must define this in when implementing provider to have hover state working
      userOptions: {
        states: {
          hover: {
            color: MonetizationColors.DARKEN_UTILIZATION_COLOR,
          },
        },
      },
    }),
  ];
}
