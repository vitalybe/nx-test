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

export const BitrateAvgIcon = ({ ...props }: Props) => {
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
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
      <g fill="none" fillRule="evenodd">
        <path
          stroke={color1}
          strokeWidth="2"
          strokeLinecap="square"
          strokeLinejoin="round"
          d="M1 8c.606-.762 1.294-1.775 2.065-3.038a2 2 0 0 1 3.47.094L8 7.784M8 8c.6.793 1.28 1.844 2.042 3.154a2 2 0 0 0 3.51-.095L15 8.227"
        />
        <path fill={color2} d="M3 7h2v2H3zM7 7h2v2H7zM11 7h2v2h-2z" />
      </g>
    </svg>
  );
};
