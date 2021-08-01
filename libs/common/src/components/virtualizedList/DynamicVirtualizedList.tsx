import React, { CSSProperties } from "react";
import styled from "styled-components";
import { Virtuoso } from "react-virtuoso";
import _ from "lodash";

const maxListHeight = "40vh";
// region [[Style]]
const NormalList = styled.div`
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  max-height: ${maxListHeight};
`;
// endregion

// region [[Props]]
interface Props {
  renderer: (index: number) => JSX.Element;
  totalCount: number;
  itemHeight?: number;
  listStyling?: CSSProperties;
  className?: string;
}
// endregion
export function DynamicVirtualizedList({ renderer, totalCount, listStyling = {}, ...props }: Props) {
  if (totalCount < 30) {
    return (
      <NormalList className={props.className} style={listStyling}>
        {_.range(totalCount).map(renderer)}
      </NormalList>
    );
  } else {
    return (
      <Virtuoso
        style={{ maxHeight: maxListHeight, flex: "1 1 auto", ...listStyling }}
        itemHeight={props.itemHeight}
        totalCount={totalCount}
        overscan={10}
        item={renderer}
        // @ts-ignore
        itemContent={renderer}
      />
    );
  }
}
