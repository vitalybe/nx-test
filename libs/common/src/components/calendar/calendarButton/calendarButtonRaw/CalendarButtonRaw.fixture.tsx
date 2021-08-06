import * as React from "react";
import styled from "styled-components";
import FixtureDecorator from "../../../../utils/cosmos/FixtureDecorator";
import {
  CalendarButtonRaw,
  Props,
} from "./CalendarButtonRaw";

const View = styled(FixtureDecorator)`
  margin: 1em;
  padding: 1em;
  position: absolute;
  border: 3px dashed lightgrey;
`;

const CalendarButtonRawStyled = styled(CalendarButtonRaw)``;

function getProps(): Props {
  return {
    isHighlighted: true,
    label: "22 DEC 2019 - 22 DEC 2019",
    onClear: () => null,
  };
}

export default {
  Highlighted: (
    <View>
      <CalendarButtonRawStyled {...getProps()} />
    </View>
  ),
  "Not highlighted": (
    <View>
      <CalendarButtonRawStyled {...getProps()} isHighlighted={false} label={""} />
    </View>
  ),
};
