import * as React from "react";
import styled from "styled-components";
import { TimezoneDropdown } from "./TimezoneDropdown";
import FixtureDecorator from "../../../utils/cosmos/FixtureDecorator";

const View = styled(FixtureDecorator)`
  margin: 1em;
  padding: 1em;
  position: absolute;
  border: 3px dashed lightgrey;
`;

const TimezoneDropdownStyled = styled(TimezoneDropdown)`
  width: 100%;
  height: 100%;
`;

function getProps() {
  return {
    onTimezoneSelected: () => {},
  };
}

export default {
  "-Regular": (
    <View>
      <TimezoneDropdownStyled {...getProps()} />
    </View>
  ),
};
