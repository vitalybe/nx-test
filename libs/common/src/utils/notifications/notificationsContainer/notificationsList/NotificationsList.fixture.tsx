/* eslint-disable react-hooks/rules-of-hooks */
import * as React from "react";
import styled from "styled-components";
import {
  NotificationsList,
  Props,
} from "common/utils/notifications/notificationsContainer/notificationsList/NotificationsList";
import FixtureDecorator from "common/utils/cosmos/FixtureDecorator";
import { NotificationEntity, NotificationLevel } from "common/utils/notifications/_domain/notificationEntity";

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
    onClose: () => {},
    onCopy: () => {},
    onDismiss: () => {},
    notifications: [
      new NotificationEntity({ title: "I had error", text: "Oh no something bad!", level: NotificationLevel.ERROR }),
      new NotificationEntity({
        title: "I had long warning",
        text:
          "Oh no something bad very very very bad! Oh no something bad very very very bad! Oh no something bad very very very bad! Oh no something bad very very very bad!",
        level: NotificationLevel.WARN,
      }),
      new NotificationEntity({ title: "I had info", text: "Oh no something bad!", level: NotificationLevel.INFO }),
    ],
  };
}

export default {
  regular: (
    <View>
      <NotificationsList {...getProps()}></NotificationsList>
    </View>
  ),
  many: () => {
    const props = getProps();
    props.notifications = [
      ...props.notifications,
      ...props.notifications,
      ...props.notifications,
      ...props.notifications,
    ];

    return (
      <View>
        <NotificationsList {...props}></NotificationsList>
      </View>
    );
  },
};
