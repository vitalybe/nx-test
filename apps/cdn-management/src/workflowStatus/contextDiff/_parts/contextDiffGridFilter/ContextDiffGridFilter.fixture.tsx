/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-console */
import * as React from "react";
import styled from "styled-components";
import {
  ContextDiffGridFilter,
  Props,
} from "./ContextDiffGridFilter";
import FixtureDecorator from "@qwilt/common/utils/cosmos/FixtureDecorator";

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
    onFilterChange: () => {},
    onShowUnmodifiedChange: () => {},
  };
}

export default {
  regular: (
    <View>
      <ContextDiffGridFilter {...getProps()}></ContextDiffGridFilter>
    </View>
  ),
};
