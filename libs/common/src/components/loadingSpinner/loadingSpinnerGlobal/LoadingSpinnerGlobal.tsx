import * as React from "react";
import styled from "styled-components";
import { loggerCreator } from "../../../utils/logger";
import { LoadingSpinner } from "../loadingSpinner/LoadingSpinner";

const moduleLogger = loggerCreator("__filename");

//region [[ Styles ]]

const Overlay = styled.div<{ toShow: boolean }>`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: ${(props) => (props.toShow ? "rgba(255, 255, 255, 0.7)" : "transparent")};
`;

const LoadingSpinnerStyled = styled(LoadingSpinner)`
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translateX(-50%) translateY(-50%);
`;

//endregion [[ Styles ]]

//region [[ Props ]]

export interface Props {
  showOverlay?: boolean;
  className?: string;
}

//endregion [[ Props ]]

export const LoadingSpinnerGlobal = (props: Props) => {
  return (
    <Overlay toShow={!!props.showOverlay} className={props.className}>
      <LoadingSpinnerStyled />
    </Overlay>
  );
};
