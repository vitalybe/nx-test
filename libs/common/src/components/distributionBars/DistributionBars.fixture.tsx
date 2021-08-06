import * as React from "react";
import styled from "styled-components";
import { DistributionBars, Props } from "./DistributionBars";
import { CommonColors as Colors } from "../../styling/commonColors";
import { UnitKindEnum } from "../../utils/unitsFormatter";

import FixtureDecorator from "../../utils/cosmos/FixtureDecorator";

const View = styled(FixtureDecorator)`
  margin: 1em;
  width: 412px;
`;

export default {
  Regular: (
    <View>
      <DistributionBars {...getProps()} />
    </View>
  ),
  "with numeric values": (
    <View>
      <DistributionBars {...getPropsWithNumeric()} />
    </View>
  ),
  "with threshold": (
    <View>
      <DistributionBars {...getPropsWithThreshold()} />
    </View>
  ),
  "many with threshold": (
    <View>
      <DistributionBars {...getPropsManyPartsWithThreshold()} />
    </View>
  ),
};

function getPropsManyPartsWithThreshold() {
  return {
    parts: [
      {
        label: "qwilt",
        color: Colors.DODGER_BLUE,
        value: 1500,
        threshold: { label: "configured", value: 1700 },
        unit: UnitKindEnum.TRAFFIC,
      },
      {
        label: "origin",
        color: Colors.LIGHT_SKY_BLUE,
        value: 800,
        unit: UnitKindEnum.TRAFFIC,
      },
      {
        label: "foo",
        color: Colors.BLUE_LAGOON,
        value: 1800,
        unit: UnitKindEnum.TRAFFIC,
      },
    ],
  };
}
function getPropsWithThreshold() {
  return {
    parts: [
      {
        label: "qwilt",
        color: Colors.DODGER_BLUE,
        value: 153,
        threshold: { label: "configured", value: 306 },
        unit: UnitKindEnum.TRAFFIC,
      },
      {
        label: "origin",
        color: Colors.LIGHT_SKY_BLUE,
        value: 80,
        unit: UnitKindEnum.TRAFFIC,
      },
    ],
  };
}

function getPropsWithNumeric() {
  return {
    parts: [
      {
        label: "qwilt",
        color: Colors.DODGER_BLUE,
        value: 153,
        unit: UnitKindEnum.TRAFFIC,
      },
      {
        label: "origin",
        color: Colors.LIGHT_SKY_BLUE,
        value: 80,
        unit: UnitKindEnum.TRAFFIC,
      },
    ],
  };
}

function getProps(propsOverrides?: Partial<Props>): Props {
  return {
    parts: [
      {
        label: "qwilt",
        color: Colors.DODGER_BLUE,
        value: 120,
      },
      {
        label: "origin",
        color: Colors.LIGHT_SKY_BLUE,
        value: 80,
      },
    ],
    ...propsOverrides,
  };
}
