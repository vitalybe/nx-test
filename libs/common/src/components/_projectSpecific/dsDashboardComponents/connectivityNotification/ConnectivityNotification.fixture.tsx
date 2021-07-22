import * as React from "react";
import styled from "styled-components";
import {
  ConnectivityNotification,
  Props,
} from "./ConnectivityNotification";
import FixtureDecorator from "../../../../utils/cosmos/FixtureDecorator";

const View = styled(FixtureDecorator)`
  margin: 1em;
  padding: 1em;
  position: absolute;
  border: 3px dashed lightgrey;
`;

const ConnectivityNotificationStyled = styled(ConnectivityNotification)`
  width: 100%;
  height: 100%;
`;

function getProps(): Props {
  return {};
}

export default {
  "-Regular": (
    <View>
      <ConnectivityNotificationStyled {...getProps()} />
    </View>
  ),
};
