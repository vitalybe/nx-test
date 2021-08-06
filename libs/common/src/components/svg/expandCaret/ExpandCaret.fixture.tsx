/* eslint-disable react-hooks/rules-of-hooks */
import * as React from "react";
import styled from "styled-components";
import { ExpandCaret, Props } from "./ExpandCaret";
import FixtureDecorator from "../../../utils/cosmos/FixtureDecorator";

const View = styled(FixtureDecorator)`
  margin: 1em;
  padding: 1em;
  position: relative;
  border: 3px dashed lightgrey;

  width: 1000px;
  height: 500px;
  // without 'grid' the child item won't get the dimensions of the parent
  display: grid;
`;

function getProps(): Props {
  return {};
}

export default {
  regular: (
    <View>
      <ExpandCaret {...getProps()}></ExpandCaret>
    </View>
  ),
};
