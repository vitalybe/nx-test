/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-console */
import * as React from "react";
import styled from "styled-components";
import {
  ContextDiffListOfLists,
  Props,
} from "src/workflowStatus/contextDiff/contextDiffListOfLists/ContextDiffListOfLists";
import FixtureDecorator from "common/utils/cosmos/FixtureDecorator";
import { ContextDiffListEntity } from "src/workflowStatus/contextDiff/_domain/contextDiffListEntity";

const View = styled(FixtureDecorator)`
  margin: 1em;
  padding: 1em;
  position: relative;
  border: 3px dashed lightgrey;

  width: 1000px;
  height: 500px;
`;

function getProps(): Props {
  return {
    items: [
      ContextDiffListEntity.createMock(),
      ContextDiffListEntity.createMock({ modifiedCount: 0, addedCount: 0, removedCount: 0 }),
      ContextDiffListEntity.createMock(),
    ],
    isReviewEnabled: true,
    reviewedIds: new Set([]),
    onZoom: () => {},
  };
}

export default {
  regular: (
    <View>
      <ContextDiffListOfLists {...getProps()} />
    </View>
  ),
};
