/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-console */
import * as React from "react";
import styled from "styled-components";
import FixtureDecorator from "../../../../../../utils/cosmos/FixtureDecorator";
import { createPeakBandwidthSeriesData } from "../../../_utils/monetizationMockUtils";
import { PeakBandwidthChartPrint, Props } from "./PeakBandwidthChartPrint";

const View = styled(FixtureDecorator)`
  margin: 1em;
  padding: 1em;
  position: relative;
  border: 3px dashed lightgrey;

  width: 500px;
`;

function getProps(): Props {
  return {
    data: createPeakBandwidthSeriesData(),
  };
}

export default {
  regular: (
    <View>
      <PeakBandwidthChartPrint {...getProps()} />
    </View>
  ),
};
