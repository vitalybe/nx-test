/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-console */
import * as React from "react";
import styled from "styled-components";
import {
  MonetizationDistributionLegend,
  Props,
} from "common/components/_projectSpecific/monetization/reports/monetizationDistributionPie/_parts/monetizationDistributionLegend/MonetizationDistributionLegend";
import FixtureDecorator from "common/utils/cosmos/FixtureDecorator";
import { MonetizationColors } from "../../../../_utils/monetizationColors";

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
    parts: [
      {
        name: "Very Long SP Name very super long",
        y: 150_245,
        color: MonetizationColors.getIndexColor(0),
      },
      {
        name: "SP 02",
        y: 132_245,
        color: MonetizationColors.getIndexColor(1),
      },
      {
        name: "SP 03",
        y: 78_245,
        color: MonetizationColors.getIndexColor(2),
      },
      {
        name: "SP 04",
        y: 23_245,
        color: MonetizationColors.getIndexColor(3),
      },
      {
        name: "SP 05",
        y: 9_245,
        color: MonetizationColors.getIndexColor(4),
      },
    ],
  };
}

export default {
  regular: (
    <View>
      <MonetizationDistributionLegend {...getProps()} />
    </View>
  ),
};
