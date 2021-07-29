import * as React from "react";
import styled from "styled-components";
import { loggerCreator } from "common/utils/logger";
import { NotificationEntity } from "common/utils/notifications/_domain/notificationEntity";
import { NotificationIcon } from "common/utils/notifications/notificationsContainer/notificationIcon/NotificationIcon";
import { CommonColors } from "common/styling/commonColors";

const moduleLogger = loggerCreator(__filename);

//region [[ Styles ]]

const NotificationItemView = styled.div`
  font-size: 0.75rem;
  padding: 0.5rem;

  display: grid;
  grid-template-columns: 20px 1fr;
  grid-template-rows: auto auto;
  row-gap: 0.3em;

  box-shadow: inset 0 -1px 0 0 ${CommonColors.PORCELAIN};
`;

const Level = styled.div`
  grid-row: 1 / span 2;
`;

const Title = styled.div`
  font-weight: bold;
`;
const Text = styled.div`
  word-break: break-word;
`;

//endregion [[ Styles ]]

//region [[ Props ]]

export interface Props {
  notification: NotificationEntity;
  className?: string;
}

//endregion [[ Props ]]

export const NotificationItem = (props: Props) => {
  return (
    <NotificationItemView className={props.className}>
      <Level>
        <NotificationIcon level={props.notification.level} size={"10px"} toShowText={false} />
      </Level>
      <Title>{props.notification.title}</Title>
      <Text>{props.notification.text + "\n" + props.notification.errorText}</Text>
    </NotificationItemView>
  );
};
