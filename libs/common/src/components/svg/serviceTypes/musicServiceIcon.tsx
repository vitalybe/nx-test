import * as React from "react";
import { ServiceIconProps } from "./dsServiceTypeIconRenderer/DsServiceTypeIconRenderer";
import { CommonColors } from "../../../styling/commonColors";
import { TextTooltip } from "../../textTooltip/TextTooltip";

//region [[ Props ]]
export interface Props extends ServiceIconProps {}
//endregion

export function MusicServiceIcon({ color = CommonColors.CERULEAN, innerColor = "#ffffff", ...props }: Props) {
  return (
    <TextTooltip content={"Music"} disabled={!props.hasTooltip}>
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
          d="M15.6455 9.5039V14.6597C15.6217 15.2964 15.0955 15.7997 14.4571 15.7946H13.992C13.3672 15.7853 12.8622 15.2836 12.8477 14.6597V14.1929C12.8426 13.5563 13.3553 13.0368 13.992 13.0317H14.8009V10.0845L10.8071 11.334V15.8388C10.802 16.4814 10.28 17 9.63656 17H9.17904C8.53477 17 8.01019 16.4822 8 15.8388V15.3719C8 14.7311 8.52034 14.2107 9.16121 14.2107H9.96252V8.93263C9.96082 8.74843 10.078 8.5846 10.2528 8.52773L15.0912 7.02359C15.2194 6.9769 15.3628 7.00067 15.4698 7.0847C15.5784 7.1611 15.6447 7.28588 15.6455 7.41915V9.5039V9.5039Z"
          fill={innerColor}
        />
      </svg>
    </TextTooltip>
  );
}
