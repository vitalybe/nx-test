import * as React from "react";
import styled from "styled-components";
import { loggerCreator } from "common/utils/logger";
import { NotificationLevel } from "common/utils/notifications/_domain/notificationEntity";
import { NotificationIcon } from "common/utils/notifications/notificationsContainer/notificationIcon/NotificationIcon";

const moduleLogger = loggerCreator(__filename);

//region [[ Styles ]]

const NotificationsButtonView = styled.div`
  display: flex;
  justify-content: center;

  width: 46px;
  height: 46px;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.16);
  background-color: #ffffff;
  border-radius: 50%;

  cursor: pointer;

  &:active {
    transition: 0.2s ease;
    box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.32);
  }
`;

//endregion [[ Styles ]]

//region [[ Props ]]

export interface Props {
  level: NotificationLevel;
  onClick: () => void;

  className?: string;
}

//endregion [[ Props ]]

export const NotificationsButton = (props: Props) => {
  return (
    <NotificationsButtonView className={props.className} onClick={props.onClick}>
      <NotificationIcon level={props.level} size={"24px"} toShowText={true} />
    </NotificationsButtonView>
  );
};
