import * as _ from "lodash";
import XLSX from "xlsx";

export interface ExportColumn {
  title: string;
  values: string[];
}

export class ExportUtils {
  static exportToExcel(dataColumns: ExportColumn[], sheetName: string, fileName: string) {
    const maxColumnRows = _.max(dataColumns.map(dataColumn => dataColumn.values.length)) ?? 0;
    const data: string[][] = [[]];

    for (let i = 0; i < dataColumns.length; i++) {
      data[0][i] = dataColumns[i].title;
    }

    for (let i = 0; i < maxColumnRows; i++) {
      data.push([...dataColumns.map(dataColumn => dataColumn.values[i])]);
    }

    const workbook = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(data);
    XLSX.utils.book_append_sheet(workbook, ws, sheetName);

    XLSX.writeFile(workbook, fileName + ".xlsx");
  }
}
