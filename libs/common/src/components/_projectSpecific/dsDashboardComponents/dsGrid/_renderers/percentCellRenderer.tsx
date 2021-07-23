import * as React from "react";
import { UnitKindEnum, unitsFormatter } from "common/utils/unitsFormatter";
import { CellRendererProps } from "common/components/qwiltGrid/QwiltGrid";
import { Cell } from "common/components/_projectSpecific/dsDashboardComponents/dsGrid/_styles/cell";

export function percentCellRenderer({ value }: CellRendererProps<number>) {
  const formattedValue = unitsFormatter.format(value, UnitKindEnum.PERCENT);
  return <Cell>{formattedValue.getPrettyWithUnit()}</Cell>;
}
