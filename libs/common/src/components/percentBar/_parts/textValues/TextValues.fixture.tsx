/* eslint-disable react-hooks/rules-of-hooks */
import * as React from "react";
import styled from "styled-components";
import { Props, TextValues } from "common/components/percentBar/_parts/textValues/TextValues";
import FixtureDecorator from "common/utils/cosmos/FixtureDecorator";
import { CommonColors } from "common/styling/commonColors";

const View = styled(FixtureDecorator)`
  margin: 1em;
  padding: 1em;
  position: relative;
  border: 3px dashed lightgrey;

  width: 200px;
  height: 150px;
  // without 'grid' the child item won't get the dimensions of the parent
  display: grid;
`;

function getProps(): Props {
  return {
    value: 600_000_000,
    percent: 75,
    thresholdValue: 1000_000_000,
    color: CommonColors.DODGER_BLUE,
  };
}

export default {
  regular: (
    <View>
      <TextValues {...getProps()} />
    </View>
  ),
};
