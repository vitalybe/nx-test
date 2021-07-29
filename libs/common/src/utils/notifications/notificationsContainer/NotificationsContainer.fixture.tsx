/* eslint-disable react-hooks/rules-of-hooks */
import * as React from "react";
import styled from "styled-components";
import {
  NotificationsContainer,
  Props,
} from "common/utils/notifications/notificationsContainer/NotificationsContainer";
import { Notifier } from "common/utils/notifications/notifier";
import { GlobalStyle } from "common/styling/AppGlobalStyle";
import { NetworkError } from "common/utils/ajax";

class TestDecorator extends React.Component<{ className?: string }> {
  render() {
    return (
      <div>
        <GlobalStyle />
        <div className={this.props.className}>{this.props.children}</div>
      </div>
    );
  }
}

const View = styled(TestDecorator)`
  position: fixed;

  width: 100%;
  height: 100%;
`;

function getProps(): Props {
  return {};
}

export default {
  regular: (
    <View>
      <NotificationsContainer {...getProps()}></NotificationsContainer>
      <button
        onClick={() =>
          Notifier.error(
            "Very long title Very long title Very long title Very long title Very long title Very long title ",
            undefined,
            {
              text:
                "Disaster has occured Disaster has occured Disaster has occured Disaster has occured Disaster has occured Disaster has occured Disaster has occured Disaster has occured",
            }
          )
        }>
        Toast error
      </button>
      <button
        onClick={() =>
          Notifier.warn(
            "Very long title Very long title Very long title Very long title Very long title Very long title ",
            undefined,
            {
              text:
                "Disaster has occured Disaster has occured Disaster has occured Disaster has occured Disaster has occured Disaster has occured Disaster has occured Disaster has occured",
            }
          )
        }>
        Toast warning
      </button>
      <button
        onClick={() =>
          Notifier.info(
            "Very long title Very long title Very long title Very long title Very long title Very long title ",
            {
              text:
                "Disaster has occured Disaster has occured Disaster has occured Disaster has occured Disaster has occured Disaster has occured Disaster has occured Disaster has occured",
            }
          )
        }>
        Toast info
      </button>
      <button
        onClick={() =>
          Notifier.info("Some network error", {
            errorObject: new NetworkError(
              "https://dng2-media-site-pack.rnd.cqloud.com/siteList?api=true",
              "POST",
              "{ a: 1 }",
              500,
              "i had an issue"
            ),
          })
        }>
        Network Error
      </button>
    </View>
  ),
};
