import { UnitKindEnum } from "common/utils/unitsFormatter";

export interface BarChartDataItem {
  [key: string]: unknown;

  value: number;
  unitType?: UnitKindEnum;

  id: number | string;
  name?: string;

  color?: string;
  icon?: string;

  children?: BarChartDataItem[];

  isVisible?: boolean;
  maxWidth?: number;
  // set to true to ignore this entity and display its children instead
  isFlatParent?: boolean;
}

export interface BarChartYAxisOptions {
  disable?: boolean;
  ticks?: number[];
  max?: number;
  unitType?: UnitKindEnum;
}

export interface BarChartPlotOptions {
  maxBarWidth?: number;
  showAverageLine?: boolean;
  outsideLabels?: boolean;
  // always use item's color for bar color
  defaultHighlight?: boolean;
  // when a drilldown entity is selected - include the drilldown entity with the visible items
  includeDrilldownParent?: boolean;
}
