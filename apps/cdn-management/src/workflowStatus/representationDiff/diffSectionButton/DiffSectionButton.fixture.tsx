/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-console */
import * as React from "react";
import styled from "styled-components";
import { DiffSectionButton, Props } from "src/workflowStatus/representationDiff/diffSectionButton/DiffSectionButton";
import FixtureDecorator from "common/utils/cosmos/FixtureDecorator";

const View = styled(FixtureDecorator)`
  margin: 1em;
  padding: 1em;
  position: relative;
  border: 3px dashed lightgrey;
  background-color: navajowhite;

  width: 1000px;
  height: 500px;
`;

function getProps(): Props {
  return {
    changesAmount: 5,
    name: "section X",
    onClick: () => {},
  };
}

export default {
  regular: (
    <View>
      <DiffSectionButton {...getProps()}></DiffSectionButton>
    </View>
  ),
  "no changes": (
    <View>
      <DiffSectionButton {...getProps()} changesAmount={0}></DiffSectionButton>
    </View>
  ),
};
