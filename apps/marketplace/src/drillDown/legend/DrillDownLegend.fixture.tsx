import * as React from "react";
import styled from "styled-components";
import { DrillDownLegend, Props } from "src/drillDown/legend/DrillDownLegend";
import { DrillDownLegendModel } from "src/drillDown/legend/drillDownLegendModel";
import { transparentize } from "polished";

import FixtureDecorator from "common/utils/cosmos/FixtureDecorator";

import { Colors } from "src/_styling/colors";

const View = styled(FixtureDecorator)`
  margin: 1em auto;
  width: 90%;
  background-color: ${transparentize(0.6, Colors.NAVY_3)};
`;

function getProps(cardsCount: number): Props {
  return {
    model: DrillDownLegendModel.createMock(cardsCount),
  };
}

export default {
  Regular: (
    <View>
      <DrillDownLegend {...getProps(2)} />
    </View>
  ),
  "Many cards": (
    <View>
      <DrillDownLegend {...getProps(12)} />
    </View>
  ),
};
