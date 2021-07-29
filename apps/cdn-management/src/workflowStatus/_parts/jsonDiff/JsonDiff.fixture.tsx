/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-console */
import * as React from "react";
import styled from "styled-components";
import { JsonDiff, Props } from "./JsonDiff";
import FixtureDecorator from "@qwilt/common/utils/cosmos/FixtureDecorator";
import { JsonDiffEntity } from "../../_domain/jsonDiffEntity";

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
    diff: JsonDiffEntity.createMock(),
    highlightedChangeIndex: undefined,
    isOnlyShowDifferences: false,
  };
}

export default {
  regular: (
    <View>
      <JsonDiff {...getProps()}></JsonDiff>
    </View>
  ),
};
