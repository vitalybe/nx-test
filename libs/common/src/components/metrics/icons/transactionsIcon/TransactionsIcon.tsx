import * as React from "react";
import { loggerCreator } from "../../../../utils/logger";
import { CommonColors } from "../../../../styling/commonColors";

const moduleLogger = loggerCreator("__filename");

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

export const TransactionsIcon = ({ ...props }: Props) => {
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
      <g fill="none" fillRule="nonzero">
        <path
          fill={color1}
          d="M13.537 7.271C14.044 5.63 13.456 4 10.71 4H4.634v.976h6.075c1.39 0 2.2.806 1.948 1.918.323.145-.02 0 .88.377z"
        />
        <path
          fill={color2}
          d="M6.966 2.384a.524.524 0 0 0 .06-.704.446.446 0 0 0-.658-.064L3.134 4.5l3.234 2.884a.446.446 0 0 0 .658-.064.524.524 0 0 0-.06-.704L4.594 4.5l2.372-2.116z"
        />
        <g>
          <path
            fill={color2}
            d="M10.302 9.384a.524.524 0 0 1-.06-.704.446.446 0 0 1 .658-.064l3.234 2.884-3.234 2.884a.446.446 0 0 1-.658-.064.524.524 0 0 1 .06-.704l2.373-2.116-2.373-2.116z"
          />
          <path
            fill={color1}
            d="M3.768 9c-.507 1.506.082 3 2.828 3h6.106v-.895H6.596c-1.389 0-2.2-.739-1.947-1.76-.323-.132-.593-.235-.88-.345z"
          />
        </g>
      </g>
    </svg>
  );
};
