import * as React from "react";
import { CommonColors } from "common/styling/commonColors";

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

export const VolumeIcon = (props: Props) => {
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
      <g fill="none" fillRule="evenodd">
        <path fill={color2} d="M2 12L12 5 12 12z" />
        <path
          fill={color1}
          fillRule="nonzero"
          d="M13.445 3.168A1 1 0 0115 4v8a1 1 0 01-1 1H2c-.99 0-1.378-1.283-.555-1.832l12-8zM14 4L2 12h12V4z"
        />
      </g>
    </svg>
  );
};
