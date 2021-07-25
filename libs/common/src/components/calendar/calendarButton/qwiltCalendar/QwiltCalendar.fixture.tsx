import * as React from "react";
import styled from "styled-components";
import { Props, QwiltCalendar } from "./QwiltCalendar";
import FixtureDecorator from "common/utils/cosmos/FixtureDecorator";

const View = styled(FixtureDecorator)`
  margin: 1em;
  padding: 1em;
  position: absolute;
  border: 3px dashed lightgrey;
`;

const QwiltCalendarStyled = styled(QwiltCalendar)`
  width: 100%;
  height: 100%;
`;

function getProps(): Props {
  return {
    onSubmit: () => {},
    onCancel: () => {},
  };
}

export default {
  "-Regular": (
    <View>
      <QwiltCalendarStyled {...getProps()} />
    </View>
  ),
};
