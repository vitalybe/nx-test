/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-console */
import * as React from "react";
import styled from "styled-components";
import {
  PeakBandwidthChart,
  Props,
} from "common/components/_projectSpecific/monetization/reports/monetizationMiniCharts/peakBandwidthChart/PeakBandwidthChart";
import FixtureDecorator from "common/utils/cosmos/FixtureDecorator";
import { createPeakBandwidthSeriesData } from "common/components/_projectSpecific/monetization/_utils/monetizationMockUtils";

const View = styled(FixtureDecorator)`
  margin: 1em;
  padding: 1em;
  position: relative;
  border: 3px dashed lightgrey;

  width: 33%;
  height: 400px;
`;

function getProps(): Props {
  return {
    data: createPeakBandwidthSeriesData(),
  };
}

export default {
  regular: (
    <View>
      <PeakBandwidthChart {...getProps()} />
    </View>
  ),
};
