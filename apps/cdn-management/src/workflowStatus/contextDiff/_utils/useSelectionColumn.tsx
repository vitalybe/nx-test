import { loggerCreator } from "common/utils/logger";
import { GridReactRenderer, HeaderRendererProps, QwiltGridColumnDef } from "common/components/qwiltGrid/QwiltGrid";
import * as React from "react";
import { ReactChild, RefObject, useCallback, useEffect } from "react";
import styled from "styled-components";
import { Checkbox } from "common/components/checkbox/Checkbox";
import { CommonColors } from "common/styling/commonColors";
import { GridApi } from "ag-grid-community";

const moduleLogger = loggerCreator(__filename);

const RowSelectionHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const RowSelectionCell = styled.div`
  display: flex;
  padding-top: 5px;
  align-items: center;
  justify-content: center;
  width: 100%;
`;
const CheckboxStyled = styled(Checkbox)`
  margin-right: 0.5em;
`;

const RowSelectionCount = styled.div`
  font-size: 12px;
`;

interface Identifiable {
  id: string;
}
enum HeaderSelectAction {
  SELECT_ALL = "SELECT_ALL",
  UNSELECT_ALL = "UNSELECT_ALL",
}

export function useSelectionColumn(
  data: Identifiable[],
  selectedIds: string[],
  gridRef: RefObject<GridApi | undefined>,
  onSelectionChange: (itemIds: string[]) => void
) {
  function changeSelection(selectedIds: string[]) {
    onSelectionChange(selectedIds);
  }

  function toggleAllRows(action: HeaderSelectAction) {
    if (action === HeaderSelectAction.UNSELECT_ALL) {
      changeSelection([]);
    } else if (action === HeaderSelectAction.SELECT_ALL) {
      if (gridRef.current) {
        const itemIds: string[] = [];
        gridRef.current.forEachNodeAfterFilter((node) => itemIds.push(node.data.id));
        changeSelection(itemIds);
      }
    }
  }

  function headerRenderer(headerRendererData: HeaderRendererProps<Identifiable>): ReactChild {
    const gridApi = headerRendererData.cellRendererProps.api;
    const totalSelected = gridApi.getSelectedNodes().length;
    const selectAction =
      totalSelected === gridApi.getDisplayedRowCount()
        ? HeaderSelectAction.UNSELECT_ALL
        : HeaderSelectAction.SELECT_ALL;

    return (
      <RowSelectionHeader>
        <CheckboxStyled
          isChecked={selectAction === HeaderSelectAction.UNSELECT_ALL}
          onClick={() => toggleAllRows(selectAction)}
          borderColor={CommonColors.HALF_BAKED}
          checkColor={CommonColors.NAVY_8}
        />
        <RowSelectionCount>{totalSelected} selected</RowSelectionCount>
      </RowSelectionHeader>
    );
  }

  function getCellRenderer() {
    return new GridReactRenderer<Identifiable>({
      valueGetter: (entity) => (selectedIds.includes(entity.id) ? "selected" : "unselected"),
      reactRender: ({ entity }) => {
        const isSelected = selectedIds.includes(entity.id);
        return (
          <RowSelectionCell>
            <CheckboxStyled
              isPartialCheck={false}
              isChecked={isSelected}
              onClick={() => {
                if (!isSelected) {
                  changeSelection([...selectedIds, entity.id]);
                } else {
                  changeSelection(selectedIds.filter((id) => entity.id !== id));
                }
              }}
              borderColor={CommonColors.HALF_BAKED}
              checkColor={CommonColors.NAVY_8}
            />
          </RowSelectionCell>
        );
      },
    });
  }

  const updateGridSelectionState = useCallback(() => {
    if (gridRef.current) {
      gridRef.current.forEachNode((node) => {
        const entity = node.data as Identifiable;
        node.setSelected(selectedIds.includes(entity.id));
      });

      gridRef.current.refreshCells({ force: true });
      gridRef.current.refreshHeader();
    }
  }, [gridRef, selectedIds]);

  useEffect(() => {
    updateGridSelectionState();
  }, [updateGridSelectionState]);

  function getSelectionColumn(): QwiltGridColumnDef<Identifiable> {
    return {
      headerName: "Row Selection",
      headerRenderer: headerRenderer,
      renderer: getCellRenderer(),
      colDefOptions: {
        maxWidth: 70,
        pinned: true,
      },
    };
  }

  return {
    selectionColumn: getSelectionColumn(),
    gridOptions: {
      animateRows: true,
      headerHeight: 43,
      rowSelection: "multiple",
      suppressRowClickSelection: true,
    },
    onGridReadyUpdateSelection: updateGridSelectionState,
  };
}
