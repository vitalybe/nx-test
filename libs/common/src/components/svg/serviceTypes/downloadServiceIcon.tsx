import * as React from "react";
import { ServiceIconProps } from "common/components/svg/serviceTypes/dsServiceTypeIconRenderer/DsServiceTypeIconRenderer";
import { CommonColors } from "common/styling/commonColors";
import { TextTooltip } from "common/components/textTooltip/TextTooltip";

//region [[ Props ]]
export interface Props extends ServiceIconProps {}
//endregion

export function DownloadServiceIcon({ color = CommonColors.CERULEAN, innerColor = "#ffffff", ...props }: Props) {
  return (
    <TextTooltip content={"Software Download"} disabled={!props.hasTooltip}>
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
          d="M16 16V17H8V16H16ZM12.7617 7V12.0917L14.2858 10.6367L15.4283 11.7275L12 15L8.57167 11.7275L9.71417 10.6358L11.2383 12.0908V7H12.7617Z"
          fill={innerColor}
        />
      </svg>
    </TextTooltip>
  );
}
