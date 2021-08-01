/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-console */
import * as React from "react";
import styled from "styled-components";
import {
  ContextDiffListOfItems,
  Props,
} from "src/workflowStatus/contextDiff/contextDiffListOfItems/ContextDiffListOfItems";
import FixtureDecorator from "common/utils/cosmos/FixtureDecorator";
import { ContextDiffItemEntity } from "src/workflowStatus/contextDiff/_domain/contextDiffItemEntity";
import { JsonDiffEntity } from "src/workflowStatus/_domain/jsonDiffEntity";

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
      ContextDiffItemEntity.createMock(),
      ContextDiffItemEntity.createMock({ diff: JsonDiffEntity.createMock({ right: undefined }) }),
      ContextDiffItemEntity.createMock({ diff: JsonDiffEntity.createMock({ left: undefined }) }),
      ContextDiffItemEntity.createMock({ diff: JsonDiffEntity.createMock({ left: { a: 1 }, right: { a: 1 } }) }),
    ],
    isReviewEnabled: true,
    reviewedIds: new Set([]),
    onZoom: () => {},
  };
}

export default {
  regular: (
    <View>
      <ContextDiffListOfItems {...getProps()} />
    </View>
  ),
};
