import * as React from "react";
import styled from "styled-components";
import { loggerCreator } from "common/utils/logger";
import { FontAwesomeIcon, Props as FontAwesomeIconProps } from "@fortawesome/react-fontawesome";
import { TextTooltip } from "../../../textTooltip/TextTooltip";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";

const moduleLogger = loggerCreator(__filename);

//region [[ Styles ]]

const Icon = styled(FontAwesomeIcon)<FontAwesomeIconProps & { iconsize?: "1x" | "2x" | undefined }>`
  margin-right: ${(props) => (props.iconsize === undefined || props.iconsize === "1x" ? "0.6em" : "0.25em")};
  margin-top: -1px;
`;

//endregion [[ Styles ]]

//region [[ Props ]]

export interface Props extends FontAwesomeIconProps {
  tooltip?: string;
  icon: IconDefinition;
  iconsize?: "1x" | "2x" | undefined;
  className?: string;
}

//endregion [[ Props ]]

export const ItemWithActionsIcon = (props: Props) => {
  return (
    <TextTooltip content={props.tooltip ?? ""} isEnabled={!!props.tooltip} delay={[500, 400]} size={"small"}>
      <Icon icon={props.icon} iconsize={props.iconsize} {...props} />
    </TextTooltip>
  );
};
