import * as React from "react";
import styled, { css } from "styled-components";
import { loggerCreator } from "common/utils/logger";
import { QwiltLogo } from "common/components/qwiltLogo/QwiltLogo";

const moduleLogger = loggerCreator(__filename);

//region [[ Styles ]]

const QwiltLogoStyled = styled(QwiltLogo)<{ shakeAnimation: boolean }>`
  @keyframes back-and-forth {
    0% {
      transform: translateX(-50%);
    }

    100% {
      transform: translateX(50%);
    }
  }

  ${(props) =>
    props.shakeAnimation &&
    css`
      animation: back-and-forth 1s infinite alternate-reverse linear;
    `};
  filter: saturate(80%);
`;

//endregion

export interface Props {
  size?: number;
  shakeAnimation?: boolean;
  shineAnimation?: boolean;
  className?: string;
}

export const LoadingSpinner = ({ size = 20, shineAnimation = true, shakeAnimation = false, ...props }: Props) => {
  return (
    <QwiltLogoStyled
      className={props.className}
      animated={shineAnimation}
      size={size}
      theme={"qc"}
      shakeAnimation={shakeAnimation}
    />
  );
};
