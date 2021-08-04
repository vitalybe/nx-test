import * as _ from "lodash";
import XLSX from "xlsx";
import { HistogramSeries } from "./histograms/domain/histogramSeries";
import { FeatureSectionColumnsData } from "../components/_projectSpecific/monetization/_utils/export/_types";
import { DateTime } from "luxon";

export interface ExportColumn {
  title: string;
  values: string[];
}

export class ExportUtils {
  static exportToExcel(dataColumns: ExportColumn[], sheetName: string, fileName: string) {
    const maxColumnRows = _.max(dataColumns.map((dataColumn) => dataColumn.values.length)) ?? 0;
    const data: string[][] = [[]];

    for (let i = 0; i < dataColumns.length; i++) {
      data[0][i] = dataColumns[i].title;
    }

    for (let i = 0; i < maxColumnRows; i++) {
      data.push([...dataColumns.map((dataColumn) => dataColumn.values[i])]);
    }

    const workbook = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(data);
    XLSX.utils.book_append_sheet(workbook, ws, sheetName);

    XLSX.writeFile(workbook, fileName + ".xlsx");
  }

  static histogramSeriesToColumnsData(
    histograms: HistogramSeries[],
    options: { unitText?: string; totalColumn?: boolean; dateColumn?: boolean } = {},
    timeFormat: string
  ): FeatureSectionColumnsData {
    const { unitText, totalColumn, dateColumn = true } = options;
    const columnsData: FeatureSectionColumnsData = [];

    if (dateColumn) {
      columnsData.push({
        header: `Date (${timeFormat})`,
        values:
          histograms[0]?.timestamps
            .map((t) => {
              const date = DateTime.fromMillis(t);
              return date.toFormat(timeFormat);
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
}
