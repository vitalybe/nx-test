import * as React from "react";
import styled from "styled-components";
import {
  DrilldownLegendMetricSelector,
  Props,
} from "./DrilldownLegendMetricSelector";
import { Colors } from "../../../_styling/colors";
import { transparentize } from "polished";

import FixtureDecorator from "@qwilt/common/utils/cosmos/FixtureDecorator";

import { MetricTypesEnum } from "../../../_domain/metricTypes";

const View = styled(FixtureDecorator)`
  margin: 1em auto;
  width: 90%;
  background-color: ${transparentize(0.6, Colors.NAVY_3)};
  padding: 0 1em 0.5em;
  display: flex;
  align-items: center;
  height: 107px;
`;

function getProps(): Props {
  return {
    selectedMetric: MetricTypesEnum.AVAILABLE_BW,
    selectCallback: () => null,
  };
}

export default {
  Regular: (
    <View>
      <DrilldownLegendMetricSelector {...getProps()} />
    </View>
  ),
};
