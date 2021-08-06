import * as React from "react";
import styled from "styled-components";
import { BarSvg, Props } from "./BarSvg";
import { CommonColors as Colors } from "../../../styling/commonColors";
import FixtureDecorator from "../../../utils/cosmos/FixtureDecorator";

const View = styled(FixtureDecorator)`
  margin: 1em;
  width: 200px;
`;

function getProps(propsOverrides?: Partial<Props>): Props {
  return {
    color: Colors.RADICAL_RED,
    svgWidth: 48,
    svgHeight: 60,
    barHeight: 60,
    ...propsOverrides,
  };
}

export default {
  Regular: (
    <View>
      <BarSvg {...getProps()} />
    </View>
  ),
  Animated: (
    <View>
      <BarSvg shouldAnimate {...getProps()} />
    </View>
  ),
};
