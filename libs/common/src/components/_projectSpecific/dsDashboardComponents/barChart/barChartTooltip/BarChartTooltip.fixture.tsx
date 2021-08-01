import * as React from "react";

import styled from "styled-components";
import {
  BarChartTooltip,
  Props,
} from "./BarChartTooltip";
import { Shadows } from "../../../../../styling/shadows";

import FixtureDecorator from "../../../../../utils/cosmos/FixtureDecorator";

import { UnitKindEnum, unitsFormatter } from "../../../../../utils/unitsFormatter";

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
      <BarChartTooltip {...getProps()} icon={"../../../../../images/isps/icons/rgnAmerica_cnUsa_nwkCharter.png"} />
    </View>
  ),
};
