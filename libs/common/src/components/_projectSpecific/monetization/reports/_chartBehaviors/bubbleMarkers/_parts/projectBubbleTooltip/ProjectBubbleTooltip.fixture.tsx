/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-console */
import * as React from "react";
import styled from "styled-components";
import {
  ProjectBubbleTooltip,
  Props,
} from "common/components/_projectSpecific/monetization/reports/_chartBehaviors/bubbleMarkers/_parts/projectBubbleTooltip/ProjectBubbleTooltip";
import FixtureDecorator from "common/utils/cosmos/FixtureDecorator";
import { DateTime } from "luxon";

const View = styled(FixtureDecorator)`
  margin: 1em;
  padding: 1em;
  position: relative;
  border: 3px dashed lightgrey;

  width: 1000px;
  height: 500px;
`;

function getProps(): Props {
  return {
    content: "Actual end of financing phase",
    date: DateTime.fromObject({ year: 2021, month: 2, day: 10 }),
    title: "British Telecom Project",
  };
}

export default {
  regular: (
    <View>
      <ProjectBubbleTooltip {...getProps()} />
    </View>
  ),
};
