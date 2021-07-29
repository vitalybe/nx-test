/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-console */
import * as React from "react";
import styled from "styled-components";
import { ContextDiffJson, Props } from "./ContextDiffJson";
import FixtureDecorator from "@qwilt/common/utils/cosmos/FixtureDecorator";
import { ContextDiffItemEntity } from "../_domain/contextDiffItemEntity";

const View = styled(FixtureDecorator)`
  margin: 1em;
  padding: 1em;
  position: relative;
  border: 3px dashed lightgrey;
  background-color: #e9e9ff;

  width: 1000px;
  height: 500px;
`;

function getProps(): Props {
  return {
    item: ContextDiffItemEntity.createMock(),
    reviewedItemIds: new Set([]),

    onReviewToggle: () => {},
  };
}

export default {
  regular: (
    <View>
      <ContextDiffJson {...getProps()}></ContextDiffJson>
    </View>
  ),
};
