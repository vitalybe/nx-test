import * as React from "react";
import styled from "styled-components";
import {
  DsDashboardTopBar,
  Props,
} from "common/components/_projectSpecific/dsDashboardComponents/dsDashboardTopbar/DsDashboardTopBar";
import { UnitKindEnum, unitsFormatter } from "common/utils/unitsFormatter";
import FixtureDecorator from "common/utils/cosmos/FixtureDecorator";

const View = styled(FixtureDecorator)`
  margin: 1em;
  padding: 1em;
  position: absolute;
  border: 3px dashed lightgrey;
  width: 1200px;
`;

function getProps(): Props {
  return {
    additionalMetricsComponent: <span>additional metrics component</span>,
    rightSectionComponent: <span>right section component</span>,
    metrics: [
      {
        value: unitsFormatter.format(12321124, UnitKindEnum.TRAFFIC),
        description: "Avg. BW",
      },
    ],
  };
}

export default {
  "-Regular": (
    <View>
      <DsDashboardTopBar {...getProps()} />
    </View>
  ),
};
