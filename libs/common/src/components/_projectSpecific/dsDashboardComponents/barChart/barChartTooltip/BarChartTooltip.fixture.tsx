import * as React from "react";

import styled from "styled-components";
import {
  BarChartTooltip,
  Props,
} from "common/components/_projectSpecific/dsDashboardComponents/barChart/barChartTooltip/BarChartTooltip";
import { Shadows } from "common/styling/shadows";

import FixtureDecorator from "common/utils/cosmos/FixtureDecorator";

import { UnitKindEnum, unitsFormatter } from "common/utils/unitsFormatter";

const View = styled(FixtureDecorator)`
  margin: 1em;
  padding: 1em;
  position: absolute;
  box-shadow: ${Shadows.EASY_SHADOW};
`;

function getProps(): Props {
  return {
    title: "Charter",
    itemValue: unitsFormatter.format(45.2, UnitKindEnum.PERCENT),
  };
}

export default {
  "-Regular": (
    <View>
      <BarChartTooltip {...getProps()} />
    </View>
  ),
  "-With Icon": (
    <View>
      <BarChartTooltip {...getProps()} icon={"common/images/isps/icons/rgnAmerica_cnUsa_nwkCharter.png"} />
    </View>
  ),
};
