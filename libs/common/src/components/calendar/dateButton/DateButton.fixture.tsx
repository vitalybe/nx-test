import * as React from "react";
import styled from "styled-components";
import { DateButton } from "./DateButton";
import { Duration } from "luxon";

import FixtureDecorator from "../../../utils/cosmos/FixtureDecorator";

const View = styled(FixtureDecorator)`
  margin: 1em;
  padding: 1em;
  position: absolute;
  border: 3px dashed lightgrey;
`;

const DateButtonStyled = styled(DateButton)``;

function getProps() {
  return {
    text: "7d",
    onClick: () => {},
  };
}

export default {
  "-Regular": (
    <View>
      <DateButtonStyled
        {...getProps()}
        duration={Duration.fromObject({
          days: 7,
        })}
        currentDuration={Duration.fromObject({
          days: 10,
        })}
      />
    </View>
  ),
  Highlighted: (
    <View>
      <DateButtonStyled
        {...getProps()}
        duration={Duration.fromObject({
          days: 7,
        })}
        currentDuration={Duration.fromObject({
          days: 7,
        })}
      />
    </View>
  ),
};
