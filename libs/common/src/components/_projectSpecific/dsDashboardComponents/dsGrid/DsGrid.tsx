import * as React from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";
import "ag-grid-community/dist/styles/ag-theme-material.css";
import {
  GridReactRenderer,
  QwiltGrid,
  QwiltGridColumnDef,
  QwiltGridTreeColumnDef,
  TreeData,
} from "../../../qwiltGrid/QwiltGrid";
import {
  dsGridStyles,
  GridClasses,
} from "./_styles/dsGridStyles";
import _ from "lodash";
import { TextTooltip } from "../../../textTooltip/TextTooltip";
import "@fortawesome/fontawesome-free/css/all.css";
import { useEventCallback } from "../../../../utils/hooks/useEventCallback";
import {
  ColumnApi,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ProcessCellForExportParams,
  ProcessHeaderForExportParams,
  ProcessRowParams,
  RowNode,
  SortChangedEvent,
} from "ag-grid-community";
import { NoDataFallback } from "../../../qcComponents/noDataFallback/NoDataFallback";
import { ProviderDataContainer } from "../../../providerDataContainer/ProviderDataContainer";
import { DateTime } from "luxon";
import { CommonDsEntity } from "../_domain/commonDsEntity";
import { IconImg } from "./_styles/iconImg";
import { Cell } from "./_styles/cell";
import { getTreeColumnRenderer } from "./_renderers/treeColumnRenderer";
import { GenericMemoHOC } from "../../../../utils/typescriptUtils";

const exportIcon = require("../../../../images/dsDashboardImages/export.svg");
const drilldownIcon = require("../../../../images/dsDashboardImages/drill-down-chart.svg");

//region [[ Styles ]]

const GridActions = styled.div`
  position: absolute;
  top: 5px;
  right: 18px;
  z-index: 8;
`;

const ExportBtn = styled.button`
  padding: 0.25rem;
  border: none;
  background-color: transparent;
  cursor: pointer;
  opacity: 0.9;

  &:focus {
    outline: none;
  }
`;

const DsGridView = styled(ProviderDataContainer)`
  position: relative;
  border-radius: 0;
  width: 100%;
  height: 100%;
  ${dsGridStyles};
`;

//endregion [[ Styles ]]

//region [[ Props ]]

export interface Props<T extends CommonDsEntity> {
  className?: string;
  isLoading?: boolean;
  data?: T[] | undefined;
  selectedEntity: T | undefined;
  columnDef: QwiltGridColumnDef<T>[];
  callbacks: {
    setSelectedEntity: (entityId: string | undefined) => void;
    setHoveredEntity: (entity: T | undefined) => void;
    setEntitySorting: (info: SortingInfo | undefined) => void;
  };
}

export interface SortingInfo {
  colId: string;
  order: "asc" | "desc";
}

//endregion [[ Props ]]
const genericMemo: GenericMemoHOC = React.memo;

export const DsGrid = genericMemo(
  <T extends CommonDsEntity = CommonDsEntity>({
    isLoading = false,
    callbacks,
    selectedEntity,
    data,
    ...props
  }: Props<T>) => {
    const { setHoveredEntity, setSelectedEntity, setEntitySorting } = callbacks;
    const gridApiRef = useRef<GridApi | undefined>();
    const columnApiRef = useRef<ColumnApi | undefined>();
    const [rowsData, setRowsData] = useState<T[]>([]);

    const isGridScrolling = useRef(false);
    const clearIsGridScrolling = useEventCallback(
      _.debounce(() => {
        isGridScrolling.current = false;
      }, 100)
    );

    const isMountedRef = useRef(true);
    useEffect(() => {
      return () => {
        isMountedRef.current = false;
      };
    }, []);

    useEffect(() => {
      if (isMountedRef.current && data && !_.isEqual(rowsData, data)) {
        setRowsData(data || []);
      }
    }, [data, rowsData]);

    useEffect(() => {
      if (gridApiRef.current) {
        gridApiRef.current.forEachNode((node) => {
          if (selectedEntity && node.data.treeId === selectedEntity.treeId) {
            node.setSelected(true);
          } else if (node.isSelected()) {
            node.setSelected(false);
          }
        });
      }
    }, [selectedEntity]);

    const setSelectedEntityCallback = useEventCallback((entity: T) => {
      if (!selectedEntity || selectedEntity.treeId !== entity.treeId) {
        setSelectedEntity(entity.treeId);
      } else if (selectedEntity.treeId === entity.treeId) {
        setSelectedEntity(undefined);
      }
    });

    const setHoveredEntityCallback = useEventCallback(
      _.debounce((entity: T | undefined) => {
        setTimeout(() => {
          if (!isGridScrolling.current && (!selectedEntity || entity === undefined)) {
            setHoveredEntity(entity);
          }
        }, 100);
      }, 200)
    );

    const columnDef = useMemo(() => {
      return [...getColumnDef(setSelectedEntityCallback), ...props.columnDef];
    }, [setSelectedEntityCallback, props.columnDef]);
    const treeColumnDef = useMemo(getTreeColumnDef, []);

    const onGridReady = useEventCallback(({ api, columnApi }: GridReadyEvent) => {
      gridApiRef.current = api;
      columnApiRef.current = columnApi;
    });

    const processRow = useEventCallback(({ node }: ProcessRowParams) => {
      node.addEventListener(RowNode.EVENT_MOUSE_ENTER, () => {
        setHoveredEntityCallback(node.data);
      });
      node.addEventListener(RowNode.EVENT_MOUSE_LEAVE, () => {
        setHoveredEntityCallback(undefined);
      });
    });

    const gridOptions = useMemo<GridOptions>(
      () => ({
        rowHeight: 50,
        rowBuffer: 0,
        unSortIcon: true,
        onBodyScroll() {
          if (!isGridScrolling.current) {
            isGridScrolling.current = true;
          }
          setTimeout(() => {
            clearIsGridScrolling();
          }, 50);
        },
        sortingOrder: ["desc", "asc"],
        noRowsOverlayComponentFramework: () => <NoDataFallback message={"Come back later"} />,
        rowClass: "ds-grid-row",
        onGridReady,
        processRowPostCreate: processRow,
        onSortChanged: (event: SortChangedEvent) => {
          const sortedCol = event.columnApi.getAllColumns().find((col) => col.isSorting());
          if (sortedCol) {
            setEntitySorting({
              colId: sortedCol.getColId(),
              order: sortedCol.getSort() as "asc" | "desc",
            });
          }
        },
        defaultColDef: {
          resizable: false,
          sortable: true,
        },
      }),
      [setEntitySorting, processRow, onGridReady, clearIsGridScrolling]
    );

    const onExportGridCsv = useEventCallback(() => {
      const options = {
        processHeaderCallback: ({ column }: ProcessHeaderForExportParams) => {
          const dsColumnDef = findDsColumnDef([treeColumnDef, ...columnDef], column.getColDef().headerName ?? "");

          const suffix = dsColumnDef?.unitName ? ` (${dsColumnDef.unitName})` : "";

          return (dsColumnDef?.headerName || "") + suffix;
        },
        processCellCallback: (params: ProcessCellForExportParams) => {
          const { column, node, value } = params;
          // col id should be matching the attribute
          const attribute = column.getColId() as keyof CommonDsEntity;
          // tree column formatting by node level
          const isTreeCol = column.getColDef().headerName === treeColumnDef.headerName;
          const prefix =
            isTreeCol && node && node.level > 0 ? [...Array(node!.level)].map(() => "_").join("") + " " : "";

          //parsing value
          // tree column id does not match the attribute - so we use exportValue
          const parsedValue = isTreeCol
            ? treeColumnDef.exportValueGetter!(node?.data)
            : value instanceof CommonDsEntity
            ? value[attribute]
            : value;
          const isNaNValue = isNaN(parsedValue) || !parsedValue || parsedValue.length === 0;
          const formattedValue = isNaNValue ? parsedValue : Number(parsedValue).toFixed(4);

          return prefix + (formattedValue || "");
        },
        fileName: "delivery-services-export_" + DateTime.local().toFormat("MM/dd/yyyy"),
        sheetName: "delivery-services-dashboard",
      };
      gridApiRef.current!.exportDataAsCsv(options);
    });

    const treeDataOptions = useMemo<TreeData<T>>(
      () => ({
        treeColumnIdGetter: (entity) => entity.name,
        treeColumn: treeColumnDef,
        getChildItems: (entity: T) => (entity.children as T[]) || [],
      }),
      [treeColumnDef]
    );
    return (
      <DsGridView className={props.className} providerMetadata={{ isLoading }}>
        <GridActions>
          <TextTooltip content={"Export this table to CSV"} theme={"dark"}>
            <ExportBtn onClick={onExportGridCsv}>
              <IconImg src={exportIcon} alt={"export"} />
            </ExportBtn>
          </TextTooltip>
        </GridActions>
        <QwiltGrid<T>
          rows={rowsData}
          treeData={treeDataOptions}
          columns={columnDef}
          gridOptions={gridOptions}
          theme={"material"}
          disableOverflowTooltip={true}
        />
      </DsGridView>
    );
  },
  propsAreEqual
);

//region [[Functions]]
function propsAreEqual(prevProps: Readonly<Props<CommonDsEntity>>, props: Readonly<Props<CommonDsEntity>>) {
  return _.isEqual(prevProps, props);
}

function getTreeColumnDef(): QwiltGridTreeColumnDef<CommonDsEntity> {
  return {
    colDefOptions: {
      minWidth: 300,
    },
    headerName: "Name",
    exportValueGetter: (entity) => {
      return entity.name ?? "";
    },
    renderer: getTreeColumnRenderer(),
  };
}

function getColumnDef<T extends CommonDsEntity = CommonDsEntity>(
  drilldownCallback?: (entity: T) => void
): QwiltGridColumnDef<T>[] {
  const actionCol: QwiltGridColumnDef<T> = {
    headerName: "",
    colDefOptions: {
      width: 32,
      maxWidth: 32,
      sortable: false,
      pinned: "left",
      lockPinned: true,
      headerClass: GridClasses.NO_RIGHT_BORDER,
      cellClass: `${GridClasses.NO_RIGHT_BORDER} ${GridClasses.DRILLDOWN_ACTION_CELL}`,
    },
    renderer: new GridReactRenderer<T>({
      valueGetter: () => "",
      reactRender: ({ entity }) => {
        return (
          <Cell justify={"flex-end"} onClick={() => drilldownCallback && drilldownCallback(entity as T)}>
            <img src={drilldownIcon} alt={"drill down"} />
          </Cell>
        );
      },
    }),
  };

  return [actionCol];
}

function findDsColumnDef<T>(
  rootColumnDefs: QwiltGridColumnDef<T>[],
  headerName: string
): QwiltGridColumnDef<T> | undefined {
  let foundItem: QwiltGridColumnDef<T> | undefined;

  for (const rootColumnDef of rootColumnDefs) {
    if (rootColumnDef.headerName === headerName) foundItem = rootColumnDef;
    else if (rootColumnDef.children) {
      foundItem = findDsColumnDef(rootColumnDef.children, headerName);
    }

    if (foundItem) {
      break;
    }
  }

  return foundItem;
}

//endregion
