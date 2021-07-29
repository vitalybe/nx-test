/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-console */
import * as React from "react";
import styled from "styled-components";
import FixtureDecorator from "common/utils/cosmos/FixtureDecorator";
import { MonetizationColors } from "common/components/_projectSpecific/monetization/_utils/monetizationColors";
import { RevenueBreakdownPie, Props } from "./RevenueBreakdownPie";

const View = styled(FixtureDecorator)`
  margin: 1em;
  padding: 1em;
  position: relative;
  border: 3px dashed lightgrey;

  width: 600px;
  height: 400px;
`;

function getProps(): Props {
  return {
    parts: [
      {
        name: "SP Revenue",
        y: 29_788,
        color: MonetizationColors.SP_COLOR,
        disabled: true,
        borderColor: "white",
      },
      {
        name: "CQDA",
        y: 329_420,
        color: MonetizationColors.CQDA_COLOR,
        disabled: true,
        borderColor: "white",
      },
    ],
  };
}

export default {
  regular: (
    <View>
      <RevenueBreakdownPie {...getProps()} />
    </View>
  ),
};
