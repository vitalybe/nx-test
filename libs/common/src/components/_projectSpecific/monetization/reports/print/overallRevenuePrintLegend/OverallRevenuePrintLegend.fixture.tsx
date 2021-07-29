/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-console */
import * as React from "react";
import styled from "styled-components";
import { OverallRevenuePrintLegend, Props } from "./OverallRevenuePrintLegend";
import FixtureDecorator from "../../../../../../utils/cosmos/FixtureDecorator";

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
    isSingleProject: true,
  };
}

export default {
  regular: (
    <View>
      <OverallRevenuePrintLegend {...getProps()} />
    </View>
  ),
  multiProject: (
    <View>
      <OverallRevenuePrintLegend {...getProps()} isSingleProject={false} />
    </View>
  ),
};
