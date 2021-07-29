import * as React from "react";
import styled from "styled-components";
import { CommonColors as Colors } from "common/styling/commonColors";
import { CssAnimations } from "common/styling/animations/cssAnimations";

//region [[ Styles ]]

const ConnectivityNotificationView = styled.div<{}>`
  width: 100%;
  height: 32px;
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${Colors.RADICAL_RED};
  animation: ${CssAnimations.SLIDE_DOWN} 200ms forwards ease-out;
  span {
    font-family: Avenir, sans-serif;
    font-size: 0.75rem;
    color: #ffffff;
    text-transform: capitalize;
  }
`;

//endregion [[ Styles ]]

//region [[ Props ]]

export interface Props {
  className?: string;
}

//endregion [[ Props ]]

export const ConnectivityNotification = (props: Props) => {
  return window?.navigator?.onLine === false ? (
    <ConnectivityNotificationView className={props.className}>
      <span>{"no internet connection. the data is not real time."}</span>
    </ConnectivityNotificationView>
  ) : null;
};
