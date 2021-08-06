import * as React from "react";
import styled from "styled-components";
import { Props, UtilizationTooltip } from "./UtilizationTooltip";
import { CommonColors as Colors } from "../../../styling/commonColors";

import FixtureDecorator from "../../../utils/cosmos/FixtureDecorator";

const View = styled(FixtureDecorator)`
  margin: 1em;
  position: absolute;
  border: 3px dashed lightgrey;
`;

function getProps(): Props {
  return {
    color: Colors.DODGER_BLUE,
    value: 150 * 1_000_000,
  };
}

export default {
  "-Regular": (
    <View>
      <UtilizationTooltip {...getProps()} reserved={100 * 1_000_000} maxCapacity={200 * 1_000_000} />
    </View>
  ),
  "-no max capacity": (
    <View>
      <UtilizationTooltip {...getProps()} reserved={100 * 1_000_000} />
    </View>
  ),
  "-no reserved": (
    <View>
      <UtilizationTooltip {...getProps()} maxCapacity={200 * 1_000_000} />
    </View>
  ),
  "-no reserved & no max capacity": (
    <View>
      <UtilizationTooltip {...getProps()} />
    </View>
  ),
};
