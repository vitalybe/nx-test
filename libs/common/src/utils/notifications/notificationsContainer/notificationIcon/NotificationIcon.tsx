import * as React from "react";
import styled from "styled-components";
import { loggerCreator } from "common/utils/logger";
import { NotificationLevel } from "common/utils/notifications/_domain/notificationEntity";
import { NotifierShared } from "common/utils/notifications/notifierShared";

const moduleLogger = loggerCreator(__filename);

//region [[ Styles ]]

const Svg = styled.svg<{ size: string }>`
  width: ${(props) => props.size};
`;

//endregion [[ Styles ]]

//region [[ Props ]]

export interface Props {
  level: NotificationLevel;
  size: string;
  toShowText: boolean;

  className?: string;
}

//endregion [[ Props ]]

export const NotificationIcon = (props: Props) => {
  let backgroundColor = NotifierShared.COLOR_INFO;
  if (props.level >= NotificationLevel.ERROR) {
    backgroundColor = NotifierShared.COLOR_ERROR;
  } else if (props.level === NotificationLevel.WARN) {
    backgroundColor = NotifierShared.COLOR_WARN;
  }

  return (
    <Svg xmlns="http://www.w3.org/2000/svg" size={props.size} viewBox="0 0 24 24" className={props.className}>
      <g fill="none" fillRule="evenodd">
        {props.level === NotificationLevel.INFO ? (
          <circle cx="12" cy="12" r="10" fill={backgroundColor} />
        ) : (
          <path
            fill={backgroundColor}
            d="M13.691 2.677l8.371 13.255c.59.934.311 2.17-.623 2.759-.32.202-.69.309-1.068.309H3.63c-1.105 0-2-.895-2-2 0-.378.107-.748.309-1.068l8.371-13.255c.59-.934 1.825-1.212 2.759-.623.251.16.464.372.623.623z"
            transform="translate(0 1)"
          />
        )}
        {props.toShowText && (
          <path fill="#FFF" fillRule="nonzero" d="M13 9V7h-2v2h2zm0 6.987v-6h-2v6h2z" transform="translate(0 1)" />
        )}
      </g>
    </Svg>
  );
};
