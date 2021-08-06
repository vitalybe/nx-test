/* eslint-disable react-hooks/rules-of-hooks */
import * as React from "react";
import styled from "styled-components";
import { AnimatedBar, Props } from "./AnimatedBar";
import FixtureDecorator from "../../../../utils/cosmos/FixtureDecorator";
import { CommonColors } from "../../../../styling/commonColors";

const View = styled(FixtureDecorator)`
  margin: 1em;
  padding: 1em;
  position: relative;
  border: 3px dashed lightgrey;

  width: 150px;
  // without 'grid' the child item won't get the dimensions of the parent
  display: grid;
`;

function getProps(): Props {
  return {
    totalHeight: "100px",
    gapHeight: "25px",
    barHeight: "75px",
    barColor: CommonColors.DODGER_BLUE,
  };
}

export default {
  regular: (
    <View>
      <AnimatedBar {...getProps()} />
    </View>
  ),
};
