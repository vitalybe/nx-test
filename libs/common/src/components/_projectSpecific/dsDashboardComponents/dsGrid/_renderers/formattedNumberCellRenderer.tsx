import * as React from "react";
import { UnitKindEnum, unitsFormatter } from "../../../../../utils/unitsFormatter";
import { CellRendererProps } from "../../../../qwiltGrid/QwiltGrid";
import { Cell } from "../_styles/cell";

export function formattedNumberCellRenderer(unit: UnitKindEnum, withSpace?: boolean) {
  return ({ value }: CellRendererProps<number>) => {
    const formattedValue = unitsFormatter.format(value, unit);
    return <Cell>{formattedValue.getPrettyWithUnit(withSpace)}</Cell>;
  };
}
