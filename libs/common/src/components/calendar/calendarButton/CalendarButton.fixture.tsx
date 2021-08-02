import * as React from "react";
import styled from "styled-components";
import { CalendarButton, Props } from "common/components/calendar/calendarButton/CalendarButton";
import FixtureDecorator from "common/utils/cosmos/FixtureDecorator";

const View = styled(FixtureDecorator)`
  margin: 1em;
  padding: 1em;
  position: absolute;
  border: 3px dashed lightgrey;
`;

const CalendarButtonStyled = styled(CalendarButton)`
  width: 100%;
  height: 100%;
`;

function getProps(): Props {
  return {
    selectedInterval: undefined,
    onIntervalCleared: () => null,
    onIntervalSelected: () => null,
  };
}

export default {
  "-Regular": (
    <View>
      <CalendarButtonStyled {...getProps()} />
    </View>
  ),
};
