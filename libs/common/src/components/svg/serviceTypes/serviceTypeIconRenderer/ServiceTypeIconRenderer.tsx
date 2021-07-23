import * as React from "react";
import { ReactElement } from "react";
import { loggerCreator } from "common/utils/logger";
import { ServiceTypesEnum } from "common/providers/mediaSitePackProvider";
import { CommonColors } from "common/styling/commonColors";
import { LiveServiceIcon } from "common/components/svg/serviceTypes/liveServiceIcon";
import { MusicServiceIcon } from "common/components/svg/serviceTypes/musicServiceIcon";
import { DownloadServiceIcon } from "common/components/svg/serviceTypes/downloadServiceIcon";
import { VodServiceIcon } from "common/components/svg/serviceTypes/vodServiceIcon";
import { ImagesServiceIcon } from "common/components/svg/serviceTypes/imagesServiceIcon";
import styled from "styled-components";
import { Fonts } from "common/styling/fonts";

const moduleLogger = loggerCreator(__filename);

//region [[ Props ]]
const SvgText = styled.text.attrs({ x: 1.5, y: 12 })`
  font-weight: 600;
  font-size: 6px;
  font-family: ${Fonts.FONT_FAMILY};
`;
export interface Props {
  color?: string;
  innerColor?: string;
  type: ServiceTypesEnum;
  className?: string;
}

//endregion [[ Props ]]

const OtherIcon = ({ color, innerColor, className }: { color: string; className?: string; innerColor: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" className={className}>
    <g fill="none" fillRule="evenodd">
      <path
        fill={color}
        fillRule="nonzero"
        d="M9.992 0C4.482 0 0 4.482 0 9.991c0 5.51 4.482 9.991 9.992 9.991 5.51 0 9.991-4.481 9.991-9.99C19.983 4.481 15.502 0 9.992 0z"
      />
      <SvgText fill={innerColor}>Other</SvgText>
    </g>
  </svg>
);

const serviceTypeComponents: {
  [k in ServiceTypesEnum]: (props: { color: string; innerColor: string; className?: string }) => ReactElement;
} = {
  [ServiceTypesEnum.LIVE]: LiveServiceIcon,
  [ServiceTypesEnum.DOWNLOAD]: DownloadServiceIcon,
  [ServiceTypesEnum.VOD]: VodServiceIcon,
  [ServiceTypesEnum.MUSIC]: MusicServiceIcon,
  [ServiceTypesEnum.IMAGE]: ImagesServiceIcon,
  [ServiceTypesEnum.OTHER]: OtherIcon,
};

export function getServiceTypeDisplayName(type: ServiceTypesEnum) {
  const serviceNamesDict: { [k in ServiceTypesEnum]?: string } = {
    [ServiceTypesEnum.VOD]: "VOD",
    [ServiceTypesEnum.DOWNLOAD]: "Software Downloads",
    [ServiceTypesEnum.IMAGE]: "Images",
  };
  return serviceNamesDict[type] ?? type;
}

export const ServiceTypeIconRenderer = ({
  color = CommonColors.CERULEAN,
  innerColor = "#ffffff",
  type,
  className,
}: Props) => serviceTypeComponents[type]({ color, innerColor, className });
