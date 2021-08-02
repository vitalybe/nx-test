import _ from "lodash";
import { ColumnChartSeriesOptions } from "highcharts";
import { GlobalFontStore } from "../../../../GlobalFontProvider";
import { DateTime, DurationObject } from "luxon";
import { HistogramPoint } from "../../../../../utils/histograms/domain/histogramPoint";
import { MonetizationProjectEntity } from "../../_domain/monetizationProjectEntity";
import { QwiltPieChartPart } from "../../../../qwiltPieChart/_types";
import { MonetizationColors } from "../monetizationColors";

export interface ProjectEventData {
  date: DateTime;
  spName: string;
  project: MonetizationProjectEntity;
  description: string;
}

export class MonetizationProviderUtils {
  static readonly API_MONTH_FORMAT = "MM-yyyy";

  private static readonly minValidCurrencyValue: number = 0.01;

  static processCurrencyValue(value: number): number {
    return value > this.minValidCurrencyValue ? value : 0;
  }

  static processChartYValue(value: number | null): number | null {
    return value === 0 ? null : value;
  }

  static getLastTwelveMonthsSamples<T extends { month: string }>(currentMonth: string, samples: T[]) {
    const sortedSamples = _.sortBy(samples, ({ month }) =>
      DateTime.fromFormat(month, this.API_MONTH_FORMAT).toMillis()
    );
    const index = _.findIndex(sortedSamples, (sample) => sample.month === currentMonth);
    return sortedSamples.slice(0, index + 1).slice(-13);
  }
  static getHoverStateOptionForColumns(color: string) {
    return { userOptions: { states: { hover: { color } } } as ColumnChartSeriesOptions };
  }
  static getColumnIndexProperties(lastIndexColor: string, lastIndexWidthRem: number, isLastIndex: boolean) {
    return {
      pointWidth: isLastIndex ? GlobalFontStore.instance.remToPixels(lastIndexWidthRem) : undefined,
      color: isLastIndex ? lastIndexColor : undefined,
    };
  }

  static handleColumnChartPoints(
    points: { x: number; y: number | null }[],
    options: { lastIndexWidthRem: number; lastIndexColor: string }
  ): HistogramPoint[] {
    const missingDataPoints = points[0]
      ? this.fillMissingSamples(points.length, 13, DateTime.fromMillis(points[0].x).startOf("month"), "months", null)
      : [];
    const data = [...missingDataPoints];
    for (let i = 0; i < points.length; i++) {
      const { x, y } = points[i];
      const isLastPoint = i === points.length - 1;
      const date = DateTime.fromMillis(x);
      const xAxisValue = date.startOf("month").toMillis();
      const pointProperties = this.getColumnIndexProperties(
        options.lastIndexColor,
        options.lastIndexWidthRem,
        isLastPoint
      );
      data.push({
        ...pointProperties,
        index: i + missingDataPoints.length,
        y: this.processChartYValue(y),
        x: xAxisValue,
        date,
      });
    }
    return data;
  }

  static fillMissingSamples(
    initialCount: number,
    minimumCount: number,
    firstDate: DateTime,
    intervalUnit: keyof DurationObject,
    yValue: number | null = 0
  ) {
    const points: HistogramPoint[] = [];
    if (initialCount < minimumCount) {
      const missingMonthsCount = minimumCount - initialCount;
      for (let i = 0; i < missingMonthsCount; i++) {
        const x = firstDate
          .minus({ [intervalUnit]: missingMonthsCount - i })
          .startOf("month")
          .toMillis();
        points.push({ y: yValue, index: i, x });
      }
    }
    return points;
  }

  static collectProjectEvents(
    projects: MonetizationProjectEntity[],
    isps?: { id: string; name?: string }[]
  ): ProjectEventData[] {
    const allEvents: ProjectEventData[] = projects.flatMap((project) => {
      const { startDate, financingPhaseData, spId } = project;
      const ispEntity = isps?.find(({ id }) => spId === id);
      const spName = ispEntity?.name ?? spId;
      const projectEvents = [
        {
          date: startDate,
          spName,
          project: project,
          description: "New Project",
        },
      ];
      if (financingPhaseData.endDate) {
        projectEvents.push({
          date: financingPhaseData.endDate,
          spName,
          project: project,
          description: "Actual end of financing phase",
        });
      }
      return projectEvents;
    });
    return _.orderBy(allEvents, ({ date }) => date.toSeconds(), "asc");
  }

  static generateOthersForPieParts(
    parts: QwiltPieChartPart[],
    topCount: number,
    label = "Others"
  ): QwiltPieChartPart[] {
    // re-setting parts colors after sorting
    const sortedParts = _.orderBy(parts, ({ y }) => y, "desc").map((part, i) => {
      return { ...part, color: MonetizationColors.getIndexColor(i) };
    });
    const shouldHaveOthersPart = sortedParts.length > topCount + 1;
    const nextParts = shouldHaveOthersPart ? sortedParts.slice(0, topCount) : sortedParts.slice();
    if (shouldHaveOthersPart) {
      const othersPart = sortedParts.slice(topCount);
      nextParts.push({
        name: label,
        y: _.sumBy(othersPart, ({ y }) => y),
        color: MonetizationColors.getIndexColor(nextParts.length),
        children: othersPart.map(({ name, y }) => {
          return { name, y };
        }),
      });
    }
    return nextParts;
  }
}
