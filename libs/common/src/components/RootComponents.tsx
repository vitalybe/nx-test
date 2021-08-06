import * as React from "react";
import { GlobalStyle } from "../styling/AppGlobalStyle";
import { NotificationsContainer } from "../utils/notifications/notificationsContainer/NotificationsContainer";

export const RootComponents = () => (
  <React.Fragment>
    <NotificationsContainer />
    <GlobalStyle />
  </React.Fragment>
);
