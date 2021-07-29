import * as React from "react";
import { CellRendererProps } from "common/components/qwiltGrid/QwiltGrid";
import _ from "lodash";
import { Cell } from "common/components/_projectSpecific/dsDashboardComponents/dsGrid/_styles/cell";

export function arrayCellRenderer({ value }: CellRendererProps<string[]>) {
  const firstValue: string = value?.length > 0 ? _.startCase(value[0]) : "";
  const rest: string[] | undefined = value?.length > 1 ? value.slice(1) : undefined;
  return <Cell>{firstValue + (rest ? " +" + rest.length : "")}</Cell>;
}
