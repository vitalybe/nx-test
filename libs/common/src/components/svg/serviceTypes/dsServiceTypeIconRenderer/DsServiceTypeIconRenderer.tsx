import * as React from "react";
import { ReactElement } from "react";
import { loggerCreator } from "../../../../utils/logger";
import { CommonColors } from "../../../../styling/commonColors";
import { LiveServiceIcon } from "../liveServiceIcon";
import { MusicServiceIcon } from "../musicServiceIcon";
import { DownloadServiceIcon } from "../downloadServiceIcon";
import { VodServiceIcon } from "../vodServiceIcon";
import styled from "styled-components";
import { Fonts } from "../../../../styling/fonts";
import { MetadataServiceTypeEnum } from "../../../../backend/deliveryServices/_types/deliveryServiceMetadataTypes";

const moduleLogger = loggerCreator("__filename");

//region [[ Props ]]
const SvgText = styled.text.attrs({ x: 1.5, y: 12 })`
  font-weight: 600;
  font-size: 6px;
  font-family: ${Fonts.FONT_FAMILY};
`;
export interface Props extends ServiceIconProps {
  type: MetadataServiceTypeEnum;
}

//endregion [[ Props ]]

const DsOtherIcon = ({ color, onClick, innerColor, className }: ServiceIconProps) => (
  <svg
    className={className}
    onClick={onClick}
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="12" fill={color} />
    <SvgText fill={innerColor}>Other</SvgText>
  </svg>
);

export interface ServiceIconProps {
  color?: string;
  innerColor?: string;
  onClick?: (e: React.MouseEvent<SVGElement>) => void;
  hasTooltip?: boolean;
  className?: string;
}
const dsServiceTypeComponents: {
  [k in MetadataServiceTypeEnum]: (props: ServiceIconProps) => ReactElement;
} = {
  [MetadataServiceTypeEnum.LIVE]: LiveServiceIcon,
  [MetadataServiceTypeEnum.SOFTWARE_DOWNLOAD]: DownloadServiceIcon,
  [MetadataServiceTypeEnum.VOD]: VodServiceIcon,
  [MetadataServiceTypeEnum.MUSIC]: MusicServiceIcon,
};

export const DsServiceTypeIconRenderer = ({
  color = CommonColors.CERULEAN,
  innerColor = "#ffffff",
  type,
  ...props
}: Props) => (dsServiceTypeComponents[type] ?? DsOtherIcon)({ color, innerColor, ...props });
