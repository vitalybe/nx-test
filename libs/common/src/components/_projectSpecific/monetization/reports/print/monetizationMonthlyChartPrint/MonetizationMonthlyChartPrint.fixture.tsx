/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-console */
import * as React from "react";
import styled from "styled-components";
import {
  MonetizationMonthlyChartPrint,
  Props,
} from "common/components/_projectSpecific/monetization/reports/print/monetizationMonthlyChartPrint/MonetizationMonthlyChartPrint";
import FixtureDecorator from "common/utils/cosmos/FixtureDecorator";
import { createMockMonthlyRevenue } from "common/components/_projectSpecific/monetization/_utils/monetizationMockUtils";

const View = styled(FixtureDecorator)`
  margin: 1em;
  padding: 1em;
  position: relative;
  border: 3px dashed lightgrey;

  width: 1080px;
  height: auto;
`;

function getProps(): Props {
  return {
    data: createMockMonthlyRevenue(),
  };
}

export default {
  regular: (
    <View>
      <MonetizationMonthlyChartPrint {...getProps()} />
    </View>
  ),
};
