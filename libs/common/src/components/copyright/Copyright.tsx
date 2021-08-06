import * as React from "react";
import styled, { css } from "styled-components";
import { loggerCreator } from "../../utils/logger";
import { CommonColors } from "../../styling/commonColors";

const moduleLogger = loggerCreator("__filename");

//region [[ Styles ]]

const CopyrightView = styled.div`
  ${(props: { show: boolean }) => css`
    position: fixed;
    bottom: 10px;
    right: 10px;
    font-family: Avenir;
    font-size: 11px;
    color: ${CommonColors.MALIBU};
    cursor: default;
    display: ${props.show ? "auto" : "none"}    
    &:hover {
      opacity: 0;
    }
`};
`;

//endregion

export interface Props {
  show?: boolean;
  className?: string;
}

export const Copyright = ({ ...props }: Props) => {
  const currentYear = new Date().getFullYear();

  return (
    <CopyrightView className={props.className} show={props.show !== undefined ? props.show : true}>
      © 2012-{currentYear} Qwilt Inc. All rights reserved.
    </CopyrightView>
  );
};
