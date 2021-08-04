/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-console */
import * as React from "react";
import styled from "styled-components";
import { Props, StaticChartLegend } from "./StaticChartLegend";
import FixtureDecorator from "common/utils/cosmos/FixtureDecorator";
import { CommonColors } from "common/styling/commonColors";

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
      {
        label: "Peak Bandwidth",
        color: CommonColors.SHERPA_BLUE,
      },
    ],
  };
}

export default {
  regular: (
    <View>
      <StaticChartLegend {...getProps()} />
    </View>
  ),
};
