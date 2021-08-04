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

export const BwPeakIcon = ({ ...props }: Props) => {
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
      <g fill="none" fillRule="nonzero">
        <path
          stroke={color1}
          strokeWidth="2"
          d="M8 4c2.386 0 3.254 4.192 4.006 5.305.77 1.137 1.248 1.826 2.994 2.695"
          opacity=".9"
        />
        <path stroke={color1} strokeWidth="2" d="M8 4C5.614 4 4.746 8.192 3.994 9.305 3.224 10.442 2.746 11.13 1 12" />
        <path fill={color2} d="M7 3h2v2H7zM7 7h2v2H7zM7 11h2v2H7z" />
      </g>
    </SvgContainer>
  );
};
