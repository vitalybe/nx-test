import * as React from "react";
import styled from "styled-components";
import {
  Props,
  SvgPieChart,
} from "./SvgPieChart";
import { CommonColors as Colors } from "../../../../../../styling/commonColors";

import FixtureDecorator from "../../../../../../utils/cosmos/FixtureDecorator";
import { UnitKindEnum } from "../../../../../../utils/unitsFormatter";

const View = styled(FixtureDecorator)`
  margin: 1em;
  padding: 1em;
  position: absolute;
  border: 3px dashed lightgrey;
  width: 300px;
`;

function getProps(): Props {
  return {
    unitType: UnitKindEnum.PERCENT,
    parts: [
      {
        value: 6,
        color: "#ff6464",
        name: "Cache Source",
      },
      {
        value: 67,
        color: Colors.DEEP_SKY_BLUE,
        name: "Origin Source - Relay",
      },
      {
        value: 27,
        color: Colors.DEEP_SKY_BLUE_2,
        name: "Origin Source - Cached",
      },
    ],
  };
}

export default {
  "-Regular": (
    <View>
      <SvgPieChart {...getProps()} />
    </View>
  ),
  "-No Data": (
    <View>
      <SvgPieChart {...getProps()} parts={[]} />
    </View>
  ),
};
