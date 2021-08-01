import * as _ from "lodash";
import * as React from "react";
import { useState } from "react";
import styled from "styled-components";
import { loggerCreator } from "common/utils/logger";
import { ToastContainer as ToastContainerToastify } from "react-toastify";
import { observer } from "mobx-react-lite";
import { Notifier } from "common/utils/notifications/notifier";
import { NotifierShared } from "common/utils/notifications/notifierShared";
import { NotificationsButton } from "common/utils/notifications/notificationsContainer/notificationsButton/NotificationsButton";
import { NotificationsList } from "common/utils/notifications/notificationsContainer/notificationsList/NotificationsList";
import { SideBarStyles } from "common/components/sideBar/_styles/sideBarStyles";

const moduleLogger = loggerCreator(__filename);

//region [[ Styles ]]

const ToastContainerView = styled.div<{ hideToasts: boolean }>`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  pointer-events: none;
  z-index: 9999;

  .Toastify__toast--default {
    background: transparent;
  }

  .Toastify__toast-container {
    opacity: ${(props) => (props.hideToasts ? 0 : 1)};
    pointer-events: auto;
    width: auto;

    bottom: 3em;

    &.Toastify__toast-container--bottom-center {
      margin-left: 0;
    }

    .Toastify__toast {
      box-shadow: none;
      margin-bottom: 0.5rem;
      width: 320px;
      overflow: hidden;
      border-radius: 3px;
      padding: 0.7rem 0.7rem 1rem 0.7rem;

      &.Toastify__toast--error {
        background-color: ${NotifierShared.COLOR_ERROR};
      }

      &.Toastify__toast--warning {
        background-color: ${NotifierShared.COLOR_WARN};
      }

      &.Toastify__toast--info {
        background-color: ${NotifierShared.COLOR_INFO};
      }

      .Toastify__toast-body {
        width: 100%;
      }
    }
  }
`;

const NotificationsListStyled = styled(NotificationsList)`
  pointer-events: auto;
  position: absolute;
  bottom: 4rem;
  left: 5rem;
`;

const NotificationsButtonStyled = styled(NotificationsButton)<{ offset?: string }>`
  position: absolute;
  bottom: 0.5rem;
  left: calc(${(props) => props.offset || SideBarStyles.SIDEBAR_NARROW_WIDTH} + 10px);
  pointer-events: auto;
  transition: 200ms ease-in-out;
  animation: fadein 1.5s;

  @keyframes fadein {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

//endregion [[ Styles ]]

//region [[ Props ]]

export interface Props {
  buttonOffset?: string;
  className?: string;
}

//endregion [[ Props ]]

export const NotificationsContainer = observer((props: Props) => {
  const [isListOpen, setIsListOpen] = useState(false);

  function onToggleNotificationsList() {
    // Remove the shown notifications toasts
    notifier.dismissToasts();
    setIsListOpen(!isListOpen);
  }

  function onDismissNotifications() {
    notifier.clearNotifications();
    setIsListOpen(false);
  }

  async function onCopyNotifications() {
    try {
      await navigator.clipboard.writeText(
        notifier.notifications
          .map((notification) => {
            const levelTitle = NotifierShared.getTitleForLevel(notification.level).toUpperCase();
            return `[${levelTitle}] ${notification.title} - ${notification.text}`;
          })
          .join("\n")
      );
    } catch (e) {
      Notifier.warn("Failed to copy to clipboard");
    }
  }

  const notifier = Notifier.instance;
  const maxLevelNotification = _.maxBy(notifier.notifications, (notification) => notification.level);
  return (
    <ToastContainerView className={props.className} hideToasts={isListOpen}>
      {isListOpen && (
        <NotificationsListStyled
          notifications={notifier.notifications}
          onCopy={onCopyNotifications}
          onClose={onToggleNotificationsList}
          onDismiss={onDismissNotifications}
        />
      )}
      <ToastContainerToastify />
      {maxLevelNotification && (
        <NotificationsButtonStyled
          offset={notifier.buttonOffset}
          level={maxLevelNotification.level}
          onClick={onToggleNotificationsList}
        />
      )}
    </ToastContainerView>
  );
});
