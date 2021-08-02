import * as React from "react";
import { loggerCreator } from "common/utils/logger";
import { CommonColors } from "common/styling/commonColors";

const moduleLogger = loggerCreator(__filename);

//region [[ Styles ]]

const DARK_COLOR1 = CommonColors.HALF_BAKED;
const DARK_COLOR2 = CommonColors.MATISSE;
const BRIGHT_COLOR1 = CommonColors.ANAKIWA;
const BRIGHT_COLOR2 = CommonColors.LILY_WHITE;

//endregion [[ Styles ]]

//region [[ Props ]]

export interface Props {
  iconTheme: "dark" | "bright";
  className?: string;
}

//endregion [[ Props ]]

export const HitRatioIcon = ({ ...props }: Props) => {
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
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 17 16" className={props.className}>
      <g fill="none" fillRule="evenodd" transform="translate(.188)">
        <rect width="9" height="11" x="3.5" y="2.5" stroke={color1} rx="2" />
        <path fill={color2} d="M7 5h2v2H7zM7 9h2v2H7z" />
      </g>
    </svg>
  );
};
