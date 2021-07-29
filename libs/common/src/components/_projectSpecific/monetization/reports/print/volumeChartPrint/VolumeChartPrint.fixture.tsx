/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-console */
import * as React from "react";
import styled from "styled-components";
import FixtureDecorator from "common/utils/cosmos/FixtureDecorator";
import { Props, VolumeChartPrint } from "./VolumeChartPrint";
import { createVolumeSeriesData } from "common/components/_projectSpecific/monetization/_utils/monetizationMockUtils";

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
    data: createVolumeSeriesData(),
  };
}

export default {
  regular: (
    <View>
      <VolumeChartPrint {...getProps()} />
    </View>
  ),
};
