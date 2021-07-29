import * as React from "react";
import styled from "styled-components";
import { UnitKindEnum } from "common/utils/unitsFormatter";
import {
  OverallPeak,
  Props,
} from "common/components/qwiltChart/_behaviors/overallPeakBehavior/overallPeak/OverallPeak";

import FixtureDecorator from "common/utils/cosmos/FixtureDecorator";

const View = styled(FixtureDecorator)`
  margin: 1em;
  width: 80%;
  background-color: #01222f;
  padding: 1em;
`;

function getProps(propsOverrides?: Partial<Props>): Props {
  return {
    isHighlighted: false,
    unitsKind: UnitKindEnum.TRAFFIC,
    value: 374583,
    onMouseMove: () => {},
    ...propsOverrides,
  };
}

export default {
  "Not highlighted": (
    <View>
      <OverallPeak {...getProps()} />
    </View>
  ),
  Highlighted: (
    <View>
      <OverallPeak
        {...getProps({
          isHighlighted: true,
        })}
      />
    </View>
  ),
};
