/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-console */
import * as React from "react";
import styled from "styled-components";
import {
  PeakBandwidthChart,
  Props,
} from "./PeakBandwidthChart";
import FixtureDecorator from "../../../../../../utils/cosmos/FixtureDecorator";
import { createPeakBandwidthSeriesData } from "../../../_utils/monetizationMockUtils";

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
