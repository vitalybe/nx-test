/* eslint-disable react-hooks/rules-of-hooks */
import * as React from "react";
import styled from "styled-components";
import { NotificationsButton } from "common/utils/notifications/notificationsContainer/notificationsButton/NotificationsButton";
import FixtureDecorator from "common/utils/cosmos/FixtureDecorator";
import { NotificationLevel } from "common/utils/notifications/_domain/notificationEntity";

const View = styled(FixtureDecorator)`
  margin: 1em;
  padding: 1em;
  position: relative;
  border: 3px dashed lightgrey;

  width: 1000px;
  height: 500px;
`;

function getProps() {
  return {
    onClick: () => {},
  };
}

export default {
  error: (
    <View>
      <NotificationsButton {...getProps()} level={NotificationLevel.ERROR} />
    </View>
  ),
  info: (
    <View>
      <NotificationsButton {...getProps()} level={NotificationLevel.INFO} />
    </View>
  ),
};
