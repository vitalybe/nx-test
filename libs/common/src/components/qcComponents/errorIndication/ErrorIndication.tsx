import * as React from "react";
import styled from "styled-components";
import { loggerCreator } from "common/utils/logger";

const moduleLogger = loggerCreator(__filename);

//region [[ Styles ]]
const errorIcon = require("common/components/qcComponents/_media/error-small.svg");

const ErrorIndicationImg = styled.img`
  z-index: 99;
  &:focus {
    outline: none;
  }
`;

//endregion [[ Styles ]]

//region [[ Props ]]

export interface Props {
  className?: string;
}

//endregion [[ Props ]]

export const ErrorIndication = (props: Props) => {
  return <ErrorIndicationImg className={props.className} src={errorIcon} alt={"error icon"} />;
};
