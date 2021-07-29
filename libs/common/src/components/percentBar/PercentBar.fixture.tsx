import * as React from "react";
import styled from "styled-components";
import { PercentBar, Props } from "common/components/percentBar/PercentBar";
import { CommonColors as Colors } from "common/styling/commonColors";
import FixtureDecorator from "common/utils/cosmos/FixtureDecorator";
import { UnitKindEnum } from "common/utils/unitsFormatter";

const View = styled(FixtureDecorator)`
  margin: 1em;
  width: 200px;
`;

function getProps(propsOverrides?: Partial<Props>): Props {
  const maxValue = 120;
  return {
    value: maxValue,
    color: Colors.DODGER_BLUE,
    label: "qwilt",
    unit: UnitKindEnum.VOLUME,
    total: 200,
    maxSiblingValue: maxValue,
    ...propsOverrides,
  };
}

export default {
  Regular: (
    <View>
      <PercentBar {...getProps()} />
    </View>
  ),
  "with threshold": (
    <View>
      <PercentBar
        {...getProps()}
        threshold={{
          label: "configured",
          value: 150,
        }}
      />
    </View>
  ),
};
