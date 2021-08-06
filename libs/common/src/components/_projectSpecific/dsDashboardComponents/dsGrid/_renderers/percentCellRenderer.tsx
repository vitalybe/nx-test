import * as React from "react";
import { UnitKindEnum, unitsFormatter } from "../../../../../utils/unitsFormatter";
import { CellRendererProps } from "../../../../qwiltGrid/QwiltGrid";
import { Cell } from "../_styles/cell";

export function percentCellRenderer({ value }: CellRendererProps<number>) {
  const formattedValue = unitsFormatter.format(value, UnitKindEnum.PERCENT);
  return <Cell>{formattedValue.getPrettyWithUnit()}</Cell>;
}
