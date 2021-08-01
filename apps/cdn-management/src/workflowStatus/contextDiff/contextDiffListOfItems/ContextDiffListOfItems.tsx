import * as React from "react";
import { useState } from "react";
import styled from "styled-components";
import { loggerCreator } from "@qwilt/common/utils/logger";
import { ContextDiffItemEntity } from "../_domain/contextDiffItemEntity";
import { GridValueRenderer, QwiltGrid, QwiltGridColumnDef } from "@qwilt/common/components/qwiltGrid/QwiltGrid";
import { Colors } from "../../../_styling/colors";
import { faSearchPlus } from "@fortawesome/free-solid-svg-icons/faSearchPlus";
import { ContextDiffUtils } from "../_utils/contextDiffUtils";
import { ContextDiffGridFilter } from "../_parts/contextDiffGridFilter/ContextDiffGridFilter";
import { useModifiedItemsFilter } from "../_utils/useModifiedItemsFilter";

const moduleLogger = loggerCreator("__filename");

//region [[ Styles ]]

const ContextDiffListOfItemsView = styled.div`
  display: grid;
  grid-template-rows: 1fr auto;
  grid-auto-flow: row;
  height: 100%;
  row-gap: 0.5rem;
`;

//endregion [[ Styles ]]

//region [[ Props ]]

export interface Props {
  items: ContextDiffItemEntity[];
  reviewedIds: Set<string>;
  isReviewEnabled: boolean;
  onZoom: (item: ContextDiffItemEntity) => void;

  className?: string;
}

//endregion [[ Props ]]

enum ChangeTypeEnum {
  ADDED = "Added",
  REMOVED = "Removed",
  MODIFIED = "Modified",
  NO_CHANGES = "No Changes",
}

export const ContextDiffListOfItems = (props: Props) => {
  const columns: QwiltGridColumnDef<ContextDiffItemEntity>[] = [
    {
      headerName: "Item",
      renderer: new GridValueRenderer({
        valueGetter: (entity) => entity.name,
      }),
    },
    {
      headerName: "Change Type",
      colDefOptions: {
        cellStyle: (row) => {
          const entity: ContextDiffItemEntity = row.data;
          const changeType = getChangeString(entity);

          let color: string;
          if (changeType === ChangeTypeEnum.ADDED) {
            color = Colors.GREEN;
          } else if (changeType === ChangeTypeEnum.REMOVED) {
            color = Colors.RED_BERRY;
          } else if (changeType === ChangeTypeEnum.MODIFIED) {
            color = Colors.HOT_TODDY;
          } else {
            color = "auto";
          }

          return { color: color };
        },
      },
      renderer: new GridValueRenderer({
        valueGetter: (entity) => getChangeString(entity),
      }),
    },
  ];

  if (props.isReviewEnabled) {
    columns.push(ContextDiffUtils.getGridReviewColumn(props.reviewedIds));
  }

  const [filter, setFilter] = useState("");
  const [isShowUnmodified, setIsShowUnmodified] = useState(true);
  const filteredItems = useModifiedItemsFilter(props.items, isShowUnmodified);

  return (
    <ContextDiffListOfItemsView className={props.className}>
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
    </ContextDiffListOfItemsView>
  );
};

//region [[ Functions ]]
function getChangeString(entity: ContextDiffItemEntity): ChangeTypeEnum {
  if (entity.isAdded) {
    return ChangeTypeEnum.ADDED;
  } else if (entity.isRemoved) {
    return ChangeTypeEnum.REMOVED;
  } else if (entity.isModified) {
    return ChangeTypeEnum.MODIFIED;
  } else {
    return ChangeTypeEnum.NO_CHANGES;
  }
}
//endregion [[ Functions ]]
