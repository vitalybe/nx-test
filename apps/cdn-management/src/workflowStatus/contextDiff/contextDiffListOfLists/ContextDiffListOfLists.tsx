import * as React from "react";
import { useState } from "react";
import styled from "styled-components";
import { loggerCreator } from "@qwilt/common/utils/logger";
import { GridValueRenderer, QwiltGrid, QwiltGridColumnDef } from "@qwilt/common/components/qwiltGrid/QwiltGrid";
import { faSearchPlus } from "@fortawesome/free-solid-svg-icons/faSearchPlus";
import { ContextDiffUtils } from "../_utils/contextDiffUtils";
import { ContextDiffGridFilter } from "../_parts/contextDiffGridFilter/ContextDiffGridFilter";
import { ContextDiffListEntity } from "../_domain/contextDiffListEntity";
import { useModifiedItemsFilter } from "../_utils/useModifiedItemsFilter";

const moduleLogger = loggerCreator("__filename");

//region [[ Styles ]]

const ContextDiffListOfListsView = styled.div`
  display: grid;
  grid-template-rows: 1fr auto;
  grid-auto-flow: row;
  height: 100%;
  row-gap: 0.5rem;
`;

//endregion [[ Styles ]]

//region [[ Props ]]

export interface Props {
  items: ContextDiffListEntity[];
  reviewedIds: Set<string>;
  isReviewEnabled: boolean;

  onZoom: (item: ContextDiffListEntity) => void;

  className?: string;
}

//endregion [[ Props ]]

export const ContextDiffListOfLists = (props: Props) => {
  const columns: QwiltGridColumnDef<ContextDiffListEntity>[] = [
    {
      headerName: "Item",
      renderer: new GridValueRenderer({
        valueGetter: (entity) => entity.name,
      }),
    },
    {
      headerName: "Modified",
      renderer: new GridValueRenderer({ valueGetter: (entity) => entity.modifiedCount.toString() }),
    },
    {
      headerName: "Added",
      renderer: new GridValueRenderer({ valueGetter: (entity) => entity.addedCount.toString() }),
    },
    {
      headerName: "Removed",
      renderer: new GridValueRenderer({ valueGetter: (entity) => entity.removedCount.toString() }),
    },
  ];
  if (props.isReviewEnabled) {
    columns.push(ContextDiffUtils.getGridReviewColumn(props.reviewedIds));
  }

  const [filter, setFilter] = useState("");
  const [isShowUnmodified, setIsShowUnmodified] = useState(true);
  const filteredItems = useModifiedItemsFilter(props.items, isShowUnmodified);

  return (
    <ContextDiffListOfListsView className={props.className}>
      <QwiltGrid
        filter={filter}
        columns={columns}
        rows={filteredItems}
        actions={[{ callback: props.onZoom, icon: faSearchPlus, label: "Zoom In" }]}
        gridOptions={{
          getRowStyle: ContextDiffUtils.getGridRowStyle,
        }}
      />
      <ContextDiffGridFilter
        onFilterChange={(newFilter) => setFilter(newFilter)}
        onShowUnmodifiedChange={(newValue) => setIsShowUnmodified(newValue)}
      />
    </ContextDiffListOfListsView>
  );
};

//region [[ Functions ]]
//endregion [[ Functions ]]
