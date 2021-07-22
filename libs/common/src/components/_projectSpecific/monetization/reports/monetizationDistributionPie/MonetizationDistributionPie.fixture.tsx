/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-console */
import * as React from "react";
import styled from "styled-components";
import FixtureDecorator from "common/utils/cosmos/FixtureDecorator";
import { MonetizationColors } from "common/components/_projectSpecific/monetization/_utils/monetizationColors";
import { MonetizationDistributionPie, Props } from "./MonetizationDistributionPie";

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
    title: "Revenue Distribution",
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
      <MonetizationDistributionPie {...getProps()} />
    </View>
  ),
  "with others": (
    <View>
      <MonetizationDistributionPie
        {...getProps()}
        parts={[
          ...getProps().parts,
          {
            name: "Others (2)",
            y: 18490,
            color: MonetizationColors.getIndexColor(5),
            children: [
              {
                name: "SP 06",
                y: 9_245,
              },
              {
                name: "SP 07",
                y: 9_245,
              },
            ],
          },
        ]}
      />
    </View>
  ),
};
