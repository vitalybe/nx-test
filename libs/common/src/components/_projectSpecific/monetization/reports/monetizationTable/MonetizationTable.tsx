import * as React from "react";
import { useMemo } from "react";
import styled from "styled-components";
import { loggerCreator } from "../../../../../utils/logger";
import { MonetizationPanelHeader } from "../monetizationPanelHeader/MonetizationPanelHeader";
import { GridOptions } from "ag-grid-community";
import { QwiltGrid, QwiltGridColumnDef } from "../../../../qwiltGrid/QwiltGrid";
import { MonetizationGridClasses, monetizationGridStyles } from "./_gridStyles";
import { ProviderMetadata } from "../../../../providerDataContainer/_providers/useProvider";
import { ProviderDataContainer } from "../../../../providerDataContainer/ProviderDataContainer";

// noinspection JSUnusedLocalSymbols
const moduleLogger = loggerCreator("__filename");

//region [[ Styles ]]
const QwiltGridStyled = styled(QwiltGrid)`
  box-shadow: none;
` as typeof QwiltGrid;

const MonetizationTableView = styled(ProviderDataContainer)`
  display: grid;
  grid-auto-flow: row;
  grid-auto-rows: auto 1fr;
  min-height: 350px;
  width: 100%;
  ${monetizationGridStyles}
`;

//endregion [[ Styles ]]

export interface Props<T> {
  providerMetadata?: ProviderMetadata;
  title?: string;
  columnDef: QwiltGridColumnDef<T>[];
  rows: T[];
  isPrint?: boolean;
  className?: string;
}

export function MonetizationTable<T>({ isPrint, ...props }: Props<T>) {
  const gridOptions = useMemo<GridOptions>(() => {
    return {
      rowHeight: 50,
      rowBuffer: 0,
      unSortIcon: true,
      rowClass: MonetizationGridClasses.MONETIZATION_GRID_ROW,
      suppressCellSelection: true,
      suppressMultiRangeSelection: true,
      suppressRowClickSelection: true,
      defaultColDef: {
        resizable: false,
        sortable: true,
        cellClass: isPrint ? "print-cell" : "",
      },
    };
  }, [isPrint]);

  return (
    <MonetizationTableView className={props.className} providerMetadata={props.providerMetadata}>
      {props.title && <MonetizationPanelHeader title={props.title} />}
      <QwiltGridStyled rows={props.rows} columns={props.columnDef} gridOptions={gridOptions} theme={"material"} />
    </MonetizationTableView>
  );
}
