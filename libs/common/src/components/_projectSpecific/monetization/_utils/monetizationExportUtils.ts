import { HistogramSeries } from "../../../../utils/histograms/domain/histogramSeries";
import { DateTime } from "luxon";
import { FeatureSectionColumnsData } from "./export/_types";
import { loggerCreator } from "../../../../utils/logger";

const moduleLogger = loggerCreator("__filename");

const MONTHLY_TIME_FORMAT = "MMM yyyy";

export class MonetizationExportUtils {
  static getMonthlyHistogramsColumnsData(
    histograms: HistogramSeries[],
    options: { unitText?: string; totalColumn?: boolean; dateColumn?: boolean } = {}
  ): FeatureSectionColumnsData {
    const { unitText, totalColumn, dateColumn = true } = options;
    const columnsData: FeatureSectionColumnsData = [];

    if (dateColumn) {
      columnsData.push({
        header: `Date (${MONTHLY_TIME_FORMAT})`,
        values:
          histograms[0]?.timestamps
            .map((t) => {
              const date = DateTime.fromMillis(t);
              return date.toFormat(MONTHLY_TIME_FORMAT);
            })
            .reverse() ?? [],
      });
    }

    if (totalColumn && histograms.length > 1) {
      columnsData.push({
        header: "Total" + (unitText ? ` (${unitText})` : ""),
        values: HistogramSeries.fromMultipleSeriesSum(histograms)
          .points.map(({ y }) => y ?? 0)
          .reverse(),
      });
    }

    for (const { points, name } of histograms) {
      columnsData.push({
        header: name + (unitText ? ` (${unitText})` : ""),
        values: points.map(({ y }) => y ?? 0).reverse(),
      });
    }

    return columnsData;
  }

  static getMonthlyCapacityUtilizationColumnsData(data: HistogramSeries[]) {
    let capacityColumns: FeatureSectionColumnsData;
    try {
      capacityColumns = MonetizationExportUtils.getMonthlyHistogramsColumnsData(data, {
        dateColumn: false,
      });
    } catch (e) {
      moduleLogger.error("Error in Monthly Capacity export", e);
      capacityColumns = [
        {
          header: e.name ?? "Error",
          values: [e.message ?? ""],
        },
      ];
    }
    return capacityColumns;
  }
}
