import * as React from "react";

import styled from "styled-components";
import { ChartSeriesData } from "../../../qwiltChart/_domain/chartSeriesData";

import FixtureDecorator from "../../../../utils/cosmos/FixtureDecorator";

import { Shadows } from "../../../../styling/shadows";
import {
  ChartTooltip,
  Props,
} from "./ChartTooltip";

const View = styled(FixtureDecorator)`
  margin: 1em;
  padding: 1em;
  position: absolute;
  box-shadow: ${Shadows.EASY_SHADOW};
`;

function getProps(): Props {
  return {
    chartSeriesDataItems: [ChartSeriesData.createMock({ name: "series name" })],
    index: 0,
  };
}

export default {
  "-Regular": (
    <View>
      <ChartTooltip {...getProps()} />
    </View>
  ),
  "-Long Text": (
    <View>
      <ChartTooltip
        {...getProps()}
        chartSeriesDataItems={[
          ChartSeriesData.createMock({
            name: "a long loooong looooooooong series name",
          }),
        ]}
      />
    </View>
  ),
};
