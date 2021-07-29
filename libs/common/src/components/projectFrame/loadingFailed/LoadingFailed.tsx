import * as React from "react";
import styled from "styled-components";
import { loggerCreator } from "common/utils/logger";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons/faExclamationCircle";
import { Snippets } from "common/utils/snippets";
import { CommonColors } from "common/styling/commonColors";

const moduleLogger = loggerCreator(__filename);

//region [[ Styles ]]

const OverlayContainer = styled.div`
  position: relative;
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const StartupMessage = styled.div`
  display: flex;
  align-items: center;
  color: ${CommonColors.NAVY_2};
  opacity: 0.5;
  font-size: 1rem;
  span {
    margin-left: 6px;
  }
`;
const Logo = styled.img`
  height: 64px;
  width: 64px;
  margin-right: 20px;
  opacity: 0.5;

  &:hover {
    opacity: 1;
  }
`;

//endregion [[ Styles ]]

//region [[ Props ]]

export interface Props {
  errorStatus?: number;
  className?: string;
}

//endregion [[ Props ]]

//region [[ Functions ]]
const qcLogo = require("common/images/logo/qc-logo.png");
//endregion [[ Functions ]]

export const LoadingFailed = ({ ...props }: Props) => {
  return (
    <OverlayContainer>
      <Logo src={qcLogo} alt={"close"} />
      <StartupMessage>
        <FontAwesomeIcon icon={faExclamationCircle} />
        {props.errorStatus !== 503 && <span>{Snippets.GENERIC_NETWORK_ERROR}</span>}
        {props.errorStatus === 503 && <span>{Snippets.ENV_DOWN}</span>}
      </StartupMessage>
    </OverlayContainer>
  );
};
