import * as React from "react";
import styled, { css } from "styled-components";
import { CommonColors } from "common/styling/commonColors";
import { CssAnimations } from "common/styling/animations/cssAnimations";

//region [[ Styles ]]
const Square = styled.div`
  ${(props: { color: string; size: number; animated: boolean }) => css`
    height: ${props.size - props.size / 3.333 + "px"};
    width: ${props.size - props.size / 3.333 + "px"};
    float: left;
    background-color: ${props.color};
    ${props.animated
      ? css`
          animation: 1.5s ease-in-out forwards ${CssAnimations.SHINE} infinite;
        `
      : ""};
  `};
`;
const OuterPart = styled.div`
  ${(props: { size: number; theme: QwiltThemes; animated: boolean }) => css`
    ${props.animated
      ? css`
          animation: 1.5s ease-in-out forwards ${CssAnimations.SHINE} infinite;
        `
      : ""};
    width: 0px;
    height: 0px;
    border-top: ${props.size + "px"} solid ${props.theme === "qc" ? "#2D8BC1" : CommonColors.QWILT_YELLOW_DIM};
    border-bottom: ${props.size + "px"} solid ${props.theme === "qc" ? "#2F90CB" : CommonColors.QWILT_GREEN_DIM};
    border-left: ${props.size + "px"} solid ${props.theme === "qc" ? "#2474A4" : CommonColors.QWILT_BLUE_DIM};
    border-right: ${props.size + "px"} solid ${props.theme === "qc" ? "#38A7E5" : CommonColors.QWILT_RED_DIM};
    transform: rotate(45deg);
  `}
`;
const InnerPart = styled.div`
  ${(props: { size: number }) => css`
    box-shadow: 0px 19px 20px 0px rgba(0, 0, 0, 0.3);
    position: absolute;
    top: ${props.size / 3.333 + "px"};
    left: ${props.size / 3.333 + "px"};
  `}
`;
const QwiltLogoView = styled.div`
  ${(props: { size: number }) => css`
    position: relative;
    overflow: visible;
    max-width: ${props.size * 2 + "px"};
    max-height: ${props.size * 2 + "px"};
  `};
`;
const Row = styled.div`
  &:nth-child(0) {
    ${Square}:nth-child(0) {
      animation-delay: 250ms;
    }
    ${Square}:nth-child(1) {
      animation-delay: 500ms;
    }
  }
  &:nth-child(1) {
    ${Square}:nth-child(0) {
      animation-delay: 750ms;
    }
    ${Square}:nth-child(1) {
      animation-delay: 1s;
    }
  }
`;
//endregion
type QwiltThemes = "regular" | "qc";

export interface Props {
  size?: number;
  theme?: QwiltThemes;
  animated?: boolean;
  className?: string;
}

export const QwiltLogo = ({ size = 24, theme = "regular", animated = true, ...props }: Props) => {
  return (
    <QwiltLogoView className={props.className} size={size}>
      <div>
        <OuterPart size={size} theme={theme} animated={animated} />
        <InnerPart size={size}>
          <Row>
            <Square
              animated={animated}
              size={size}
              color={theme === "qc" ? "#38A7E5" : CommonColors.QWILT_BLUE_BRIGHT}
            />
            <Square
              animated={animated}
              size={size}
              color={theme === "qc" ? "#39ADDD" : CommonColors.QWILT_YELLOW_BRIGHT}
            />
          </Row>
          <Row>
            <Square
              animated={animated}
              size={size}
              color={theme === "qc" ? "#2D89C2" : CommonColors.QWILT_GREEN_BRIGHT}
            />
            <Square
              animated={animated}
              size={size}
              color={theme === "qc" ? "#37A5E8" : CommonColors.QWILT_RED_BRIGHT}
            />
          </Row>
        </InnerPart>
      </div>
    </QwiltLogoView>
  );
};
