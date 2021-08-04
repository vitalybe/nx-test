import XLSX from "xlsx";
import _ from "lodash";
import {
  ExportDataType,
  FeatureSectionData,
} from "common/components/_projectSpecific/monetization/_utils/export/_types";

export class ExportFeaturesData {
  data: ExportDataType = {};
  properties: XLSX.FullProperties;
  constructor(properties: XLSX.FullProperties = {}) {
    this.properties = {
      CreatedDate: new Date(Date.now()),
      Author: "Qwilt",
      ...properties,
    };
  }
  // This function appends a sheet's data sections into an export data object.
  // This function mutates the data object.
  append(feature: string, sections: FeatureSectionData[]) {
    // padding is used between sections
    const paddingCells = ["", ""];

    if (!this.data[feature]) {
      Object.assign(this.data, { [feature]: [] });

      if (sections.some(({ title }) => title !== undefined)) {
        // creating a row for sections titles if there are any
        this.data[feature]!.push(
          sections.flatMap(({ title, columnsData }) => {
            const whiteSpace = _.range(columnsData.length + paddingCells.length - 1).map(() => "");
            // section title cell
            return [title ?? "", ...whiteSpace];
          })
        );
      }
      // creating a row for sections columns header
      this.data[feature]!.push(
        sections.flatMap(({ columnsData }) => [...columnsData.map(({ header }) => header), ...paddingCells])
      );
    }
    // counting the longest rows count column for rows iteration
    const maxColumnRows =
      _.max(
        sections.flatMap(({ columnsData }) => {
          return columnsData.map(({ values }) => values.length);
        })
      ) ?? 0;

    for (let i = 0; i < maxColumnRows; i++) {
      // each iteration creates a row with all sections values under their columns
      this.data[feature]!.push(
        sections.flatMap(({ columnsData }) => {
          return [...columnsData.map(({ values }) => values[i]?.toString() ?? ""), ...paddingCells];
        })
      );
    }
  }

  exportXlsx(fileName = "export.xlsx") {
    const workbook = XLSX.utils.book_new();
    workbook.Props = this.properties;

    for (const feature of Object.keys(this.data)) {
      const worksheet = XLSX.utils.aoa_to_sheet(this.data[feature] ?? []);
      XLSX.utils.book_append_sheet(workbook, worksheet, feature);
    }

    XLSX.writeFile(workbook, fileName, { bookType: "xlsx" });
  }
}
