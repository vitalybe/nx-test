import * as React from "react";
import { CommonColors } from "../../../styling/commonColors";
import { ServiceIconProps } from "./dsServiceTypeIconRenderer/DsServiceTypeIconRenderer";
import { TextTooltip } from "../../textTooltip/TextTooltip";

//region [[ Props ]]
export interface Props extends ServiceIconProps {}
//endregion

export function LiveServiceIcon({ color = CommonColors.CERULEAN, innerColor = "#ffffff", ...props }: Props) {
  return (
    <TextTooltip content={"Live"} disabled={!props.hasTooltip}>
      <svg
        onClick={props.onClick}
        className={props.className}
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="12" fill={color} />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M4 9H5.01494V13.7828H7.43906V14.7013H4V9ZM8.02621 9H9.04115V14.7013H8.02621V9V9ZM9.75748 9H10.9251L12.4794 13.308L14.0815 9H15.1769L12.8736 14.7013H11.9962L9.75748 9ZM16.0786 9H19.8549V9.91764H17.0936V11.3184H19.7106V12.2369H17.0936V13.7828H20V14.7013H16.0786V9V9Z"
          fill={innerColor}
        />
      </svg>
    </TextTooltip>
  );
}
