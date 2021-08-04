import * as React from "react";
import { GlobalStyle } from "common/styling/AppGlobalStyle";
import { NotificationsContainer } from "common/utils/notifications/notificationsContainer/NotificationsContainer";

export const RootComponents = () => (
  <React.Fragment>
    <NotificationsContainer />
    <GlobalStyle />
  </React.Fragment>
);
