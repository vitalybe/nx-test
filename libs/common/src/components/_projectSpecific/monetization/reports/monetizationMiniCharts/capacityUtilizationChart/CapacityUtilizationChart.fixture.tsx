/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-console */
import * as React from "react";
import styled from "styled-components";
import FixtureDecorator from "../../../../../../utils/cosmos/FixtureDecorator";
import {
  createCapacitySeriesData,
  createYearOfMonthlyMockPoints,
} from "../../../_utils/monetizationMockUtils";
import { CapacityUtilizationChart, Props } from "./CapacityUtilizationChart";

const View = styled(FixtureDecorator)`
  margin: 1em;
  padding: 1em;
  position: relative;
  border: 3px dashed lightgrey;

  width: 33%;
  height: 400px;
`;

function getProps(): Props {
  const data = createYearOfMonthlyMockPoints().map(({ y, ...point }) => ({ y: (y ?? 0) * 101, ...point }));
  const mockCapacity = 99_000_000;
  return {
    seriesData: createCapacitySeriesData(data, mockCapacity),
  };
}

function getLargerPeakProps(): Props {
  const data = createYearOfMonthlyMockPoints();
  const mockCapacity = 700_000;
  return {
    seriesData: createCapacitySeriesData(data, mockCapacity),
  };
}
function getDifferentUnitProps(): Props {
  const data = createYearOfMonthlyMockPoints();
  const mockCapacity = 1_000_000;
  return {
    seriesData: createCapacitySeriesData(data, mockCapacity),
  };
}
export default {
  regular: (
    <View>
      <CapacityUtilizationChart {...getProps()} />
    </View>
  ),
  "peak is more than capacity": (
    <View>
      <CapacityUtilizationChart {...getLargerPeakProps()} />
    </View>
  ),

  "with different peak & capacity units": (
    <View>
      <CapacityUtilizationChart {...getDifferentUnitProps()} />
    </View>
  ),
};
