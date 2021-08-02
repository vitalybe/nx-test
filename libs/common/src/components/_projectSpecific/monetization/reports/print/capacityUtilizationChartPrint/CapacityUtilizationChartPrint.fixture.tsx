/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-console */
import * as React from "react";
import styled from "styled-components";
import {
  CapacityUtilizationChartPrint,
  Props,
} from "common/components/_projectSpecific/monetization/reports/print/capacityUtilizationChartPrint/CapacityUtilizationChartPrint";
import FixtureDecorator from "common/utils/cosmos/FixtureDecorator";
import {
  createCapacitySeriesData,
  createYearOfMonthlyMockPoints,
} from "common/components/_projectSpecific/monetization/_utils/monetizationMockUtils";

const View = styled(FixtureDecorator)`
  margin: 1em;
  padding: 1em;
  position: relative;
  border: 3px dashed lightgrey;

  width: 500px;
`;

function getProps(): Props {
  const trafficDataPoints = createYearOfMonthlyMockPoints().map(({ y, ...point }) => ({
    y: (y ?? 0) * 101_000,
    ...point,
  }));
  const mockCapacity = 120_000_000_000;
  const capacityUtilizationData = createCapacitySeriesData(trafficDataPoints, mockCapacity);

  return {
    data: capacityUtilizationData,
  };
}

export default {
  regular: (
    <View>
      <CapacityUtilizationChartPrint {...getProps()} />
    </View>
  ),
};
