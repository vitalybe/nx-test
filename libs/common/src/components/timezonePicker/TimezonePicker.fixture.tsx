import * as React from "react";
import styled from "styled-components";
import { Props, TimezonePicker } from "./TimezonePicker";
import { DateTime } from "luxon";

import FixtureDecorator from "../../utils/cosmos/FixtureDecorator";

const View = styled(FixtureDecorator)`
  margin: 1em;
  padding: 1em;
  position: absolute;
  border: 3px dashed lightgrey;
  width: 500px;
  height: 300px;
  background-color: #022e3f;
`;

const TimezonePickerStyled = styled(TimezonePicker)``;

function getProps(): Props {
  return {
    currentZone: DateTime.local().zone,
    onZoneChange: () => {},
  };
}

export default {
  "-Regular": (
    <View>
      <TimezonePickerStyled {...getProps()} />
    </View>
  ),
};
