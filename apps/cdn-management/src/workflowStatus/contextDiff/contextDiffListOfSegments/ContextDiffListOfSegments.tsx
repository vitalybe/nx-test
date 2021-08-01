import * as React from "react";
import { useRef, useState } from "react";
import styled from "styled-components";
import { loggerCreator } from "@qwilt/common/utils/logger";
import { GridValueRenderer, QwiltGrid, QwiltGridColumnDef } from "@qwilt/common/components/qwiltGrid/QwiltGrid";
import { faSearchPlus } from "@fortawesome/free-solid-svg-icons/faSearchPlus";
import { ContextDiffUtils } from "../_utils/contextDiffUtils";
import { ContextDiffGridFilter } from "../_parts/contextDiffGridFilter/ContextDiffGridFilter";
import { ContextDiffSegmentEntity } from "../_domain/contextDiffSegmentEntity";
import { useSelectionColumn } from "../_utils/useSelectionColumn";
import { GridApi } from "ag-grid-community";
import { useModifiedItemsFilter } from "../_utils/useModifiedItemsFilter";

const moduleLogger = loggerCreator("__filename");

//region [[ Styles ]]

const ContextDiffListOfSegmentsView = styled.div`
  display: grid;
  grid-template-rows: 1fr auto;
  grid-auto-flow: row;
  height: 100%;
  row-gap: 0.5rem;
`;

//endregion [[ Styles ]]

//region [[ Props ]]

export interface Props {
  items: ContextDiffSegmentEntity[];
  reviewedIds: Set<string>;
  isReviewEnabled: boolean;

  selectedSegmentsIds: string[];
  onSelectedSegmentsChanged: undefined | ((itemIds: string[]) => void);

  onZoom: (item: ContextDiffSegmentEntity) => void;

  className?: string;
}

//endregion [[ Props ]]

export const ContextDiffListOfSegments = (props: Props) => {
  const gridApiRef = useRef<GridApi>();
  const { gridOptions: selectionGridOptions, selectionColumn, onGridReadyUpdateSelection } = useSelectionColumn(
    props.items,
    props.selectedSegmentsIds,
    gridApiRef,
    props.onSelectedSegmentsChanged ?? (() => {})
  );

  const columns: QwiltGridColumnDef<ContextDiffSegmentEntity>[] = [
    {
      headerName: "Item",
      renderer: new GridValueRenderer({
        valueGetter: (entity) => entity.name,
      }),
    },
    {
      headerName: "Changes Count",
      renderer: new GridValueRenderer({ valueGetter: (entity) => entity.changeCount.toString() }),
    },
  ];

  if (props.onSelectedSegmentsChanged) {
    columns.unshift(selectionColumn);
  }

  if (props.isReviewEnabled) {
    columns.push(ContextDiffUtils.getGridReviewColumn(props.reviewedIds));
  }

  const [filter, setFilter] = useState("");
  const [isShowUnmodified, setIsShowUnmodified] = useState(true);
  const filteredItems = useModifiedItemsFilter(props.items, isShowUnmodified);

  return (
    <ContextDiffListOfSegmentsView className={props.className}>
      <QwiltGrid
        filter={filter}
        columns={columns}
        rows={filteredItems}
        actions={[{ callback: props.onZoom, icon: faSearchPlus, label: "Zoom In" }]}
        gridOptions={{
          ...selectionGridOptions,
          onGridReady: ({ api }) => {
            gridApiRef.current = api;
            onGridReadyUpdateSelection();
          },
          getRowStyle: ContextDiffUtils.getGridRowStyle,
        }}
      />
      <ContextDiffGridFilter
        onFilterChange={(newFilter) => setFilter(newFilter)}
        onShowUnmodifiedChange={(newValue) => setIsShowUnmodified(newValue)}
      />
    </ContextDiffListOfSegmentsView>
  );
};

//region [[ Functions ]]
//endregion [[ Functions ]]
