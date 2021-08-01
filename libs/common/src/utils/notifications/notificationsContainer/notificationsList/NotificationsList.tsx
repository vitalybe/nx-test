import * as React from "react";
import styled from "styled-components";
import { loggerCreator } from "common/utils/logger";
import { NotificationEntity } from "common/utils/notifications/_domain/notificationEntity";
import { Clickable } from "common/components/configuration/clickable/Clickable";
import { faCopy, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NotificationItem } from "common/utils/notifications/notificationsContainer/notificationsList/notificationItem/NotificationItem";
import { Button } from "common/components/configuration/button/Button";
import { CommonColors } from "common/styling/commonColors";

const moduleLogger = loggerCreator(__filename);

//region [[ Styles ]]

const NotificationsListView = styled.div`
  width: 320px;
  height: 300px;

  display: flex;
  flex-direction: column;
  align-items: center;

  background-color: #ffffff;
  border-radius: 4px;
  box-shadow: 0 2px 14px 0 rgba(0, 0, 0, 0.32);
  font-size: 0.75rem;
  color: #01222f;
`;

const Title = styled.div`
  width: 100%;
  position: relative;
  text-align: center;
  padding: 0.5rem;
  color: #2c5e7a;
  font-size: 0.875rem;
  font-weight: bold;
`;

const ClickableCopy = styled(Clickable)`
  position: absolute;
  left: 0.5rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: 20px;
`;

const ClickableClose = styled(Clickable)`
  position: absolute;
  right: 0.5rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: 20px;
`;

const Text = styled.div``;

const Notifications = styled.div`
  flex: 1;
  width: 100%;
  min-height: 0;
  overflow-y: auto;
`;

const ButtonStyled = styled(Button).attrs({
  backgroundColor: CommonColors.ROYAL_BLUE,
  textColor: CommonColors.WHITE,
  colorFunction: "darken",
})`
  text-transform: uppercase;
  margin: 0.5rem;
`;

//endregion [[ Styles ]]

//region [[ Props ]]

export interface Props {
  notifications: NotificationEntity[];

  onCopy: () => void;
  onClose: () => void;
  onDismiss: () => void;

  className?: string;
}

//endregion [[ Props ]]

export const NotificationsList = (props: Props) => {
  return (
    <NotificationsListView className={props.className}>
      <Title>
        <ClickableCopy onClick={props.onCopy}>
          <FontAwesomeIcon icon={faCopy} />
        </ClickableCopy>
        <Text>UI Application Errors ({props.notifications.length})</Text>
        <ClickableClose onClick={props.onClose}>
          <FontAwesomeIcon icon={faTimes} />
        </ClickableClose>
      </Title>
      <Notifications>
        {props.notifications.map((notification, i) => (
          <NotificationItem key={i} notification={notification} />
        ))}
      </Notifications>
      <ButtonStyled onClick={props.onDismiss}>Dismiss All</ButtonStyled>
    </NotificationsListView>
  );
};
