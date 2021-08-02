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

export const EfficiencyIcon = (props: Props) => {
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
        <path stroke={color1} d="M2 9c0-3.314 2.686-6 6-6 2.36 0 4.402 1.362 5.381 3.344" />
        <path
          fill={color2}
          fillRule="nonzero"
          d="M14.663 5.466c.31.456.193 1.078-.264 1.39l-4.405 3c-.052-.686-.456-1.326-1.118-1.65-.003 0-.006-.002-.008-.004l4.405-3c.457-.31 1.079-.193 1.39.264z"
        />
        <rect width="3" height="3" x="6.5" y="8.5" stroke={color1} rx="1.5" />
      </g>
    </svg>
  );
};
