import * as React from "react";
import styled from "styled-components";
import { DrillDownLegendCard, Props } from "./DrillDownLegendCard";
import { DrillDownLegendCardModel } from "./drillDownLegendCardModel";
import { Colors } from "../../../_styling/colors";

import FixtureDecorator from "@qwilt/common/utils/cosmos/FixtureDecorator";

import { transparentize } from "polished";

const View = styled(FixtureDecorator)`
  margin: 1em auto;
  width: fit-content;
  background-color: ${transparentize(0.6, Colors.NAVY_3)};
  padding: 0 1em 0.5em;
  display: flex;
  align-items: center;
  height: 107px;
`;

function getProps(overrides?: Partial<DrillDownLegendCardModel>): Props {
  return {
    model: DrillDownLegendCardModel.createMock(overrides),
  };
}

export default {
  Regular: (
    <View>
      <DrillDownLegendCard {...getProps()} />
    </View>
  ),
  "Long Name": (
    <View>
      <DrillDownLegendCard {...getProps()} />
    </View>
  ),
  Loading: (
    <View>
      <DrillDownLegendCard
        {...getProps({
          currentMetric: undefined,
        })}
      />
    </View>
  ),
};
