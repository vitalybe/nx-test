import * as React from "react";
import { CommonColors } from "../../../styling/commonColors";

//region [[ Props ]]
export interface Props {
  color?: string;
  innerColor?: string;
  className?: string;
}
//endregion

export function ImagesServiceIcon({ color = CommonColors.CERULEAN, innerColor = "#ffffff", ...props }: Props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" className={props.className}>
      <g fill="none" fillRule="evenodd">
        <path
          fill={color}
          fillRule="nonzero"
          d="M9.992 0C4.482 0 0 4.482 0 9.991c0 5.51 4.482 9.991 9.992 9.991 5.51 0 9.991-4.481 9.991-9.99C19.983 4.481 15.502 0 9.992 0z"
        />
        <g transform="translate(5 6)">
          <path stroke={innerColor} d="M.5.5h9v7h-9z" />
          <path
            fill={innerColor}
            d="M.935 4.896c.587-.523 1.33-.785 2.232-.785 1.81 0 1.815 1.479 2.384 1.5.507.02 1.606-.715 2.34-.715.527 0 1.23.253 2.109.758l-.093 1.457H.935V4.896z"
          />
          <circle cx="7" cy="3" r="1" fill={innerColor} />
        </g>
      </g>
    </svg>
  );
}
