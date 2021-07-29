import * as React from "react";
import styled from "styled-components";
import { loggerCreator } from "common/utils/logger";
import { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Constants } from "src/workflowStatus/_util/constants";

const moduleLogger = loggerCreator(__filename);

//region [[ Styles ]]

const IconWithLabelView = styled.div`
  display: flex;
  margin-right: 10px;
  align-items: center;
`;

const FontAwesomeIconStyled = styled(FontAwesomeIcon)`
  font-size: ${Constants.ICON_SIZE};
  margin-right: 5px;
`;

//endregion [[ Styles ]]

//region [[ Props ]]

export interface Props {
  icon: IconDefinition;
  children: React.ReactChild;
  className?: string;
}

//endregion [[ Props ]]

export const IconWithLabel = (props: Props) => {
  return (
    <IconWithLabelView className={props.className}>
      <FontAwesomeIconStyled icon={props.icon} />
      {props.children}
    </IconWithLabelView>
  );
};
