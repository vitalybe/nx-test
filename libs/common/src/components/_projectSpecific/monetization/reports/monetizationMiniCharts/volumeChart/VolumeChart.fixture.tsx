/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-console */
import * as React from "react";
import styled from "styled-components";
import FixtureDecorator from "../../../../../../utils/cosmos/FixtureDecorator";
import {
  Props,
  VolumeChart,
} from "./VolumeChart";
import { createVolumeSeriesData } from "../../../_utils/monetizationMockUtils";

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
    data: createVolumeSeriesData(),
  };
}

export default {
  regular: (
    <View>
      <VolumeChart {...getProps()} />
    </View>
  ),
};
