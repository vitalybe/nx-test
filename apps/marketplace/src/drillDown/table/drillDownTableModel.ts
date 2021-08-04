import { loggerCreator } from "common/utils/logger";
import { mockUtils } from "common/utils/mockUtils";
import { DrillDownTableRowModel } from "src/drillDown/table/row/drillDownTableRowModel";
import { action, computed, observable } from "mobx";
import { MetricTypesEnum } from "src/_domain/metricTypes";
import { DrillDownStore } from "src/drillDown/_stores/drillDownStore";
import * as _ from "lodash";

const moduleLogger = loggerCreator(__filename);

export type TableMetricType = MetricTypesEnum | "coverage" | "ispCount";

export class DrillDownTableModel {
  constructor(private marketplaceDrilldown: DrillDownStore) {}

  @observable
  sortRowsBy: TableMetricType | undefined;

  @computed
  get isLoading(): boolean {
    return !this.marketplaceDrilldown.drillDownHistogram;
  }
  @computed
  get highlightedMetricsColumn() {
    return this.marketplaceDrilldown.metricType;
  }

  @computed get dataTimeSpan() {
    return this.marketplaceDrilldown.dataTimeSpan;
  }

  @computed
  get rows() {
    const rows = this.marketplaceDrilldown.drillDownEntities.map(
      entity => new DrillDownTableRowModel(entity, this.marketplaceDrilldown)
    );

    let orderedRows = rows.slice();
    if (this.sortRowsBy !== undefined) {
      try {
        // sort loaded rows
        orderedRows = _.orderBy(
          rows.filter(row => !row.isLoading),
          (item: DrillDownTableRowModel) => item.getSortByValue(this.sortRowsBy!),
          ["desc"]
        );
        // adding loading rows
        orderedRows = orderedRows.concat(rows.filter(row => row.isLoading));
      } catch (err) {
        moduleLogger.error("failed to sort rows", err);
      }
    }

    return orderedRows;
  }
  @action
  setSortBy = (type: TableMetricType) => {
    if (this.sortRowsBy === type) {
      this.sortRowsBy = undefined;
    } else {
      this.sortRowsBy = type;
    }
  };
  static createMock(overrides?: Partial<DrillDownTableModel>) {
    const rowModel1 = DrillDownTableRowModel.createMock("1");
    const rowModel2 = DrillDownTableRowModel.createMock("2", { isLoading: true });
    const disableRow = DrillDownTableRowModel.createMock("3", { isEnabled: true });

    return mockUtils.createMockObject<DrillDownTableModel>({
      rows: [rowModel1, disableRow, rowModel2],
      isLoading: false,
      highlightedMetricsColumn: MetricTypesEnum.AVAILABLE_BW,
      sortRowsBy: undefined,
      setSortBy: () => null,
      dataTimeSpan: "month",
      ...overrides,
    });
  }
}
