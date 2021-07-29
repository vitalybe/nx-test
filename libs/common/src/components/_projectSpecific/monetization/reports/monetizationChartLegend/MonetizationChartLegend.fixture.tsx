/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-console */
import * as React from "react";
import styled from "styled-components";
import {
  MonetizationChartLegend,
  Props,
} from "./MonetizationChartLegend";
import FixtureDecorator from "../../../../../utils/cosmos/FixtureDecorator";
import { DateTime } from "luxon";

const View = styled(FixtureDecorator)`
  margin: 1em;
  padding: 1em;
  position: relative;
  border: 3px dashed lightgrey;
`;

function getProps(): Props {
  return {
    currentDate: DateTime.local(),
    isLastPoint: true,
    legendItems: [
      {
        value: 70_000,
        label: "CQDA",
        color: "green",
      },
      {
        value: 30_000,
        label: "SP",
        color: "orange",
      },
    ],
    total: {
      value: 100_000,
      label: "Total",
      color: "black",
    },
  };
}

export default {
  regular: (
    <View>
      <MonetizationChartLegend {...getProps()} />
    </View>
  ),
};
