import * as _ from "lodash";
import * as React from "react";
import { ReactChild, ReactElement, ReactNode, useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "common/components/qwiltGrid/_styles/ag-theme-qwilt-configuration/ag-theme-qwilt-configuration.scss";
import {
  AgGridEvent,
  ColDef as ColDefOriginal,
  ColGroupDef,
  ColumnApi,
  GridApi,
  GridOptions,
  ICellRendererParams,
  RowNode,
  ValueGetterParams,
} from "ag-grid-community";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Clickable } from "common/components/configuration/clickable/Clickable";
import { Icons } from "common/styling/icons";
import { LicenseManager } from "ag-grid-enterprise";
import "ag-grid-enterprise";
import ReactDOMServer from "react-dom/server";
import { IconDefinition } from "@fortawesome/fontawesome-common-types";
import { faCircle } from "@fortawesome/free-solid-svg-icons";
import { TextTooltip } from "common/components/textTooltip/TextTooltip";
import { UnitNameEnum } from "common/utils/unitsFormatter";
import { GenericMemoHOC } from "common/utils/typescriptUtils";
import { ReactCellContainer } from "common/components/qwiltGrid/reactCellContainer/ReactCellContainer";
import { ReactCellWrapper } from "common/components/qwiltGrid/reactCellWrapper/ReactCellWrapper";
import { ImageWithFallback } from "common/components/imageWithFallback/ImageWithFallback";

export interface ColDef extends ColDefOriginal {
  userData?: unknown;
}

LicenseManager.setLicenseKey(
  "CompanyName=Qwilt,LicensedApplication=QC Services,LicenseType=SingleApplication,LicensedConcurrentDeveloperCount=1,LicensedProductionInstancesCount=0,AssetReference=AG-014390,ExpiryDate=20_April_2022_[v2]_MTY1MDQwOTIwMDAwMA==41238af89b3056ca5ae4f050492d61eb"
);

//region [[ Styles ]]

const ImageIcon = styled(ImageWithFallback)`
  width: 1rem;
  height: 1rem;
  &:focus {
    outline: none;
  }
`;

const QwiltGridView = styled.div<{ isLoading: boolean }>`
  height: 100%;
  width: 100%;

  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 5px;

  opacity: ${(props) => (props.isLoading ? 0 : 1)};
`;

const ActionContainer = styled.div`
  display: grid;

  grid-template-rows: 1fr;
  grid-template-columns: min-content;
  grid-column-gap: 0.5em;
  grid-auto-flow: column;
  width: min-content;
  align-items: center;
  height: 100%;
  font-size: 1.1em;
`;

//endregion [[ Styles ]]

//region [[ Props ]]

export type HeaderRendererProps<T> = { cellRendererProps: CellRendererProps<T> };
export type CellRendererProps<T> = Omit<ICellRendererParams, "data"> & { data: T };

export interface ReactRendererProps<T> {
  entity: T;
  value: string;
  coreValue?: string | number;
  cellRendererProps: CellRendererProps<T>;
}

// Returns a string value that represents the data
export class GridValueRenderer<T> {
  public valueGetter!: (entity: T, coreValue?: string | number) => string;

  constructor(data: Required<GridValueRenderer<T>>) {
    Object.assign(this, data);
  }
}

export class GridReactRenderer<T> {
  public reactRender!: (props: ReactRendererProps<T>) => ReactNode;
  public valueGetter!: (entity: T, coreValue?: string | number) => string;

  constructor(data: Required<GridReactRenderer<T>>) {
    Object.assign(this, data);
  }
}

export class GridReactRendererStringOnly<T> {
  public reactRender!: (props: ReactRendererProps<T>) => ReactElement;
  public valueGetter!: (value: T, coreValue?: string | number) => string;

  constructor(data: Required<GridReactRendererStringOnly<T>>) {
    Object.assign(this, data);
  }
}

interface QwiltGridBaseColumnDef<T> {
  // same as colDefOptions.headerName
  headerName: string;
  // replace header with custom component
  headerRenderer?: (headerRendererData: HeaderRendererProps<T>) => ReactChild;
  // For column groups
  children?: QwiltGridColumnDef<T>[];
  // cellStyle by condition
  cellStyle?: (value: T, cellText: string) => Record<string, string | number> | undefined;

  // The value that is shared by Renderers (both ValueRenderer and ReactRenderer) and Export
  coreValueGetter?: (entity: T) => string | number;

  // Export related
  //////////////////////

  // can be used to decorate exported header suffix
  unitName?: UnitNameEnum | string;

  // getter to be used when exporting
  exportValueGetter?: (entity: T, coreValue?: string | number) => string | number;

  //////////////////////////////////////////////////////////
  //// Override how string is extracted from the column ////

  // return a string by which the entity in the column should be compared
  sortValueGetter?: (entity: T) => string | number;

  // If you need to override clipboard/filter value, put it here too

  //////////////////////////////////////////////////////////

  // the original options of colDef
  colDefOptions?: ColDef;
}

export interface QwiltGridTreeColumnDef<T> extends QwiltGridBaseColumnDef<T> {
  // only for tree data
  renderer: GridValueRenderer<T> | GridReactRenderer<T>;
}

export interface QwiltGridColumnDef<T> extends QwiltGridBaseColumnDef<T> {
  // undefined - for group columns or when using "field" and native AgGrid props
  renderer?: GridValueRenderer<T> | GridReactRenderer<T> | GridReactRendererStringOnly<T> | undefined;
}

export interface TreeData<T> {
  getChildItems: (row: T) => T[];
  // use the field/getter of this tree column to build the "data path" for the hierarchy data
  // keep this data in a helper array that getDataPath will use
  treeColumn: QwiltGridTreeColumnDef<T>;
  treeColumnIdGetter?: (row: T) => string;
  // NOTE: Deprecated
  overrideDataPath?: (row: T) => string[];
}

export interface ActionData<T> {
  //appears in tooltip
  label?: string;
  icon?: IconDefinition;
  // icon path will override fa icon
  iconPath?: string;
  // icon component will override fa icon & icon path
  iconComponent?: ReactNode;
  // Since the grid reuses the first given callback, it is VERY important to use `useEventCallback` on callbacks that are given here.
  // Otherwise, it is possible to get stale data.
  callback: (item: T) => void;
  // visible by default
  visiblePredicate?: (item: T, node: RowNode) => boolean;
  // enabled by default
  enabledPredicate?: (item: T) => boolean;
  disabledTooltip?: string;
}

export interface Props<T> {
  rows?: T[];
  columns: QwiltGridColumnDef<T>[];
  filter?: string;
  treeData?: TreeData<T>;
  theme?: string;
  gridOptions?: GridOptions;
  suppressSizeColumnsToFit?: boolean;
  actions?: ActionData<T>[];
  disableOverflowTooltip?: boolean;

  className?: string;
}

//endregion [[ Props ]]

interface RowTreeData<T> {
  row: T;
  dataPath: string[];
}
const genericMemo: GenericMemoHOC = React.memo;

export const QwiltGrid = genericMemo(
  <T extends unknown>(props: Props<T>) => {
    const [isRendering, setIsRendering] = useState(true);
    const theme = props.theme ?? "qwilt-configuration";
    const gridApiRef = useRef<GridApi | undefined>(undefined);
    const columnApiRef = useRef<ColumnApi | undefined>(undefined);
    const rowsDataPathRef = useRef<RowTreeData<T>[] | undefined>();

    useEffect(() => {
      if (columnApiRef.current && gridApiRef.current) {
        gridApiRef.current.setColumnDefs(
          getColumnDefs(props.columns, props.actions || [], props.disableOverflowTooltip)
        );
        timedAutoResizeColumns(
          0,
          { api: gridApiRef.current, columnApi: columnApiRef.current },
          props.suppressSizeColumnsToFit
        );
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.columns]);

    const rows = useMemo(() => {
      if (props.treeData && props.rows) {
        rowsDataPathRef.current = flattenRows(props.rows, props.treeData);
        return rowsDataPathRef.current.map((rowData) => rowData.row);
      }
      return props.rows;
    }, [props.treeData, props.rows]);

    return (
      <QwiltGridView
        isLoading={isRendering}
        className={`ag-theme-${theme} ${props.className || ""} ${isRendering ? "" : "grid-rendered"}`}>
        <AgGridReact
          quickFilterText={props.filter}
          onGridSizeChanged={(event: AgGridEvent) => {
            timedAutoResizeColumns(100, event, props.suppressSizeColumnsToFit, () => {
              // NOTE: This is needed to remove a useless horizontal scrollbar that sometimes lingers after auto-resize
              event.api.redrawRows();
              setIsRendering(false);
            });
          }}
          columnDefs={getColumnDefs(props.columns, props.actions || [], props.disableOverflowTooltip)}
          rowData={rows}
          onRowDataChanged={(event) => timedAutoResizeColumns(100, event, props.suppressSizeColumnsToFit)}
          autoGroupColumnDef={
            props.treeData?.treeColumn
              ? getColumnDef(props.treeData.treeColumn, [], true, props.disableOverflowTooltip)
              : undefined
          }
          onGridReady={(event) => {
            gridApiRef.current = event.api;
            columnApiRef.current = event.columnApi;
            if (props.gridOptions?.onGridReady) {
              props.gridOptions.onGridReady(event);
            }
          }}
          groupDefaultExpanded={props.gridOptions?.groupDefaultExpanded ?? -1}
          getDataPath={(data) => rowsDataPathRef.current?.find((rowData) => rowData.row === data)?.dataPath || []}
          gridOptions={{
            animateRows: false,
            rowHeight: 30,
            groupHeaderHeight: 30,
            headerHeight: 30,
            treeData: !!props.treeData,
            defaultColDef: {
              resizable: true,
              sortable: true,
              suppressMenu: true,
            },
            suppressPropertyNamesCheck: true,
            ...props.gridOptions,
          }}
        />
      </QwiltGridView>
    );
  },
  (prevProps, props) => _.isEqual(prevProps, props)
);

function timedAutoResizeColumns(
  timeout: number,
  event: Pick<AgGridEvent, "api" | "columnApi">,
  suppressFit = false,
  timedCallback?: () => void
) {
  setTimeout(() => {
    autoResizeColumns(event, suppressFit);
    timedCallback?.();
  }, timeout);
}
function autoResizeColumns(data: Pick<AgGridEvent, "api" | "columnApi">, suppressFit = false) {
  const columnsWithoutWidth = data.columnApi
    .getAllColumns()
    .filter((column) => !column.getUserProvidedColDef().width && !column.getUserProvidedColDef().suppressAutoSize);

  data.columnApi.autoSizeColumns(columnsWithoutWidth);
  if (!suppressFit) {
    data.api.sizeColumnsToFit();
  }
}

function getCellRendererContainer<T>(
  qwiltColumnDef: QwiltGridColumnDef<T> | QwiltGridTreeColumnDef<T>,
  isTreeColumn: boolean,
  disableOverflowTooltip: boolean
): undefined | typeof ReactCellContainer {
  const columnRenderer = qwiltColumnDef.renderer;

  if (qwiltColumnDef.colDefOptions?.cellRenderer) {
    return undefined;
  }

  const isReactCellContainer =
    columnRenderer instanceof GridReactRenderer || columnRenderer instanceof GridReactRendererStringOnly;

  if (isTreeColumn) {
    // Tree columns must always return undefined
    return undefined;
  } else if (isReactCellContainer) {
    return ReactCellContainer;
  } else if (disableOverflowTooltip) {
    return undefined;
  } else {
    // We want text to be in react container too, unless this behavior was disabled
    return ReactCellContainer;
  }
}

function getCellRenderer<T>(
  qwiltColumnDef: QwiltGridColumnDef<T> | QwiltGridTreeColumnDef<T>
): undefined | ((props: ReactRendererProps<T>) => React.ReactNode) {
  const columnRenderer = qwiltColumnDef.renderer;

  if (columnRenderer instanceof GridReactRenderer) {
    return (props: ReactRendererProps<T>) =>
      columnRenderer.reactRender({
        entity: props.entity,
        value: props.value,
        coreValue: props.coreValue,
        cellRendererProps: props.cellRendererProps,
      });
  } else if (columnRenderer instanceof GridReactRendererStringOnly) {
    return (props: ReactRendererProps<T>) =>
      ReactDOMServer.renderToString(
        columnRenderer.reactRender({
          entity: props.entity,
          value: props.value,
          coreValue: props.coreValue,
          cellRendererProps: props.cellRendererProps,
        })
      );
  } else {
    return undefined;
  }
}

function getColumnDef<T>(
  qwiltColumnDef: QwiltGridColumnDef<T> | QwiltGridTreeColumnDef<T>,
  indexTree: number[] = [],
  isTree: boolean = false,
  disableOverflowTooltip = false
): ColDef | ColGroupDef {
  const colDefOptions: Partial<ColDef> = qwiltColumnDef.colDefOptions ?? {};

  const headerName = qwiltColumnDef.headerName ?? colDefOptions.headerName;

  return {
    colId: colDefOptions.colId ?? colDefOptions.field,
    headerName: headerName,
    headerComponentFramework: qwiltColumnDef.headerRenderer ? ReactCellContainer : null,
    suppressSizeToFit: colDefOptions.width !== undefined,
    minWidth: colDefOptions.minWidth || 60,
    cellRendererFramework:
      qwiltColumnDef.renderer instanceof GridReactRendererStringOnly
        ? undefined
        : getCellRendererContainer(qwiltColumnDef, isTree, disableOverflowTooltip),
    // if "field" isn't specified, return the whole object
    valueGetter: getValueGetter(qwiltColumnDef),
    children:
      qwiltColumnDef.children &&
      qwiltColumnDef.children.map((childColumn, i) => {
        return getColumnDef(childColumn, [...indexTree, i]);
      }),
    cellStyle: qwiltColumnDef.cellStyle && (({ data, value }) => qwiltColumnDef.cellStyle?.(data, value)),
    comparator: getComparator(qwiltColumnDef),
    headerComponentParams: {
      innerCellRenderer: qwiltColumnDef.headerRenderer,
    },
    // relevant only for tree columns
    cellRendererParams: {
      innerRendererFramework: ReactCellContainer,
      // // See "ReactCellContainer" component comment
      innerCellRenderer: getCellRenderer(qwiltColumnDef),
      suppressCount: true,
    },
    userData: qwiltColumnDef,
    ...colDefOptions,
  };
}

function getColumnDefs<T>(
  propColumnDefs: QwiltGridColumnDef<T>[],
  actions: ActionData<T>[],
  disableOverflowTooltip = false
): ColDef[] {
  const columns = propColumnDefs.map((column, i) => getColumnDef(column, [i], false, disableOverflowTooltip));
  if (actions.length > 0)
    columns.push({
      headerName: "Actions",
      colId: "actions",
      pinned: "right",

      cellClass: "actions-column",
      sortable: false,
      suppressSizeToFit: true,
      suppressMovable: true,
      cellRendererFramework: (props: ICellRendererParams) => {
        return (
          <ReactCellWrapper cellRendererParams={props}>
            <ActionContainer>
              {actions?.map((action) => {
                const isVisible = action.visiblePredicate?.(props.data, props.node) ?? true;
                const isEnabled = action.enabledPredicate?.(props.data) ?? true;
                const label = isEnabled ? action.label : action.disabledTooltip;
                return (
                  isVisible && (
                    <TextTooltip
                      key={action.label ?? action.icon?.iconName ?? "circle"}
                      disabled={!label}
                      delay={[300, 100]}
                      ignoreBoundaries
                      placement={"top"}
                      content={label ?? ""}>
                      <Clickable onClick={() => action.callback(props.data)} isDisabled={!isEnabled}>
                        {action.iconComponent ? (
                          action.iconComponent
                        ) : action.iconPath ? (
                          <ImageIcon imagePath={action.iconPath} />
                        ) : (
                          <FontAwesomeIcon icon={action.icon ?? faCircle} />
                        )}
                      </Clickable>
                    </TextTooltip>
                  )
                );
              })}
            </ActionContainer>
          </ReactCellWrapper>
        );
      },
    });

  return columns;
}

function flattenRows<T>(rows: T[], treeData: TreeData<T>, parentPath: string[] = [], dataPaths: RowTreeData<T>[] = []) {
  for (const [i, row] of rows.entries()) {
    let rowPath: string[];
    if (treeData.overrideDataPath) {
      rowPath = treeData.overrideDataPath(row);
    } else {
      rowPath = [...parentPath];
      // i.toString() is needed to show all rows, even duplicates, per:
      // https://stackoverflow.com/questions/52809941/how-can-we-able-to-display-the-duplicate-item-in-ag-grid-tree-data
      if (treeData.treeColumnIdGetter) {
        rowPath.push(treeData.treeColumnIdGetter(row) + i.toString());
      } else if (treeData.treeColumn.renderer) {
        rowPath.push(treeData.treeColumn.renderer.valueGetter(row) + i.toString());
      } else if (treeData.treeColumn.colDefOptions?.field) {
        rowPath.push(_.get(row, treeData.treeColumn.colDefOptions.field) + i.toString());
      } else {
        throw new Error(`failed to build tree path`);
      }
    }
    dataPaths.push({ row: row, dataPath: rowPath });
    flattenRows(treeData.getChildItems(row) ?? [], treeData, rowPath, dataPaths);
  }

  return dataPaths;
}

function getComparator<T>(qwiltColumnDef: QwiltGridColumnDef<T> | QwiltGridTreeColumnDef<T>) {
  const valueGetter = qwiltColumnDef.sortValueGetter ?? qwiltColumnDef.renderer?.valueGetter;

  if (valueGetter) {
    const usedValueGetter = valueGetter;
    return (valueA: T, valueB: T, nodeA: RowNode, nodeB: RowNode) => {
      const a = usedValueGetter(nodeA.data);
      const b = usedValueGetter(nodeB.data);

      const numA = _.toNumber(a);
      const numB = _.toNumber(b);
      if (_.isFinite(numA) && _.isFinite(numB)) {
        return numA > numB ? 1 : -1;
      } else {
        return a?.toString()?.toLowerCase()?.localeCompare(b?.toString()?.toLowerCase());
      }
    };
  }
}

function getValueGetter<T>(
  qwiltColumnDef: QwiltGridColumnDef<T> | QwiltGridTreeColumnDef<T>
): undefined | ((params: ValueGetterParams) => unknown) {
  if (qwiltColumnDef.colDefOptions?.field) {
    // if field is specified, don't override value getter since it will ignore the field the use selected
    return undefined;
  } else {
    return (valueGetterParams: ValueGetterParams) =>
      qwiltColumnDef.renderer?.valueGetter(
        valueGetterParams.data,
        qwiltColumnDef.coreValueGetter?.(valueGetterParams.data)
      );
  }
}

export function getEditAction<T>(callback: (item: T) => void, data?: Partial<ActionData<T>>): ActionData<T> {
  return { callback, icon: Icons.EDIT, label: "Edit", ...data };
}
export function getDeleteAction<T>(callback: (item: T) => void, data?: Partial<ActionData<T>>): ActionData<T> {
  return { callback, icon: Icons.DELETE, label: "Delete", ...data };
}
