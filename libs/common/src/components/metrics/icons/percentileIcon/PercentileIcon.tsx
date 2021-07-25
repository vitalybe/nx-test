import * as React from "react";
import { loggerCreator } from "../../../../utils/logger";
import { CommonColors } from "../../../../styling/commonColors";
import styled from "styled-components";

const moduleLogger = loggerCreator("__filename");

//region [[ Styles ]]

const DARK_COLOR1 = CommonColors.HALF_BAKED;
const DARK_COLOR2 = CommonColors.MATISSE;
const BRIGHT_COLOR1 = CommonColors.ANAKIWA;
const BRIGHT_COLOR2 = CommonColors.LILY_WHITE;

const SvgContainer = styled.svg`
  width: 100%;
`;

//endregion [[ Styles ]]

//region [[ Props ]]

export interface Props {
  iconTheme: "dark" | "bright";
  className?: string;
}

//endregion [[ Props ]]

export const PercentileIcon = ({ ...props }: Props) => {
  let color1;
  let color2;
  if (props.iconTheme === "dark") {
    color1 = DARK_COLOR1;
    color2 = DARK_COLOR2;
  } else {
    color1 = BRIGHT_COLOR1;
    color2 = BRIGHT_COLOR2;
  }

  return (
    <SvgContainer xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" className={props.className}>
      <g fill="none" fillRule="evenodd">
        <path stroke={color1} strokeLinejoin="round" d="M15 2s-1.862 5-5.688 8C6.762 12 3.991 13 1 13" />
        <path fill={color2} d="M10 7H12V9H10z" transform="rotate(-90 11 8)" />
        <path fill={color2} d="M10 11H12V13H10z" transform="rotate(-90 11 12)" />
        <path fill={color2} d="M10 3H12V5H10z" transform="rotate(-90 11 4)" />
      </g>
    </SvgContainer>
  );
};
