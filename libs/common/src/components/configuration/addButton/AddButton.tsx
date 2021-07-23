import * as React from "react";
import styled from "styled-components";
import { loggerCreator } from "../../../utils/logger";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Icons } from "../../../styling/icons";
import { Clickable } from "../clickable/Clickable";

// noinspection JSUnusedLocalSymbols
const moduleLogger = loggerCreator("__filename");

//region [[ Styles ]]

const AddButtonView = styled(Clickable)``;

const AddButtonText = styled.span`
  margin-right: 0.3em;
`;

//endregion [[ Styles ]]

//region [[ Props ]]

export interface Props {
  label?: string;
  onClick: () => void;

  className?: string;
}

//endregion [[ Props ]]

export const AddButton = (props: Props) => {
  return (
    <AddButtonView className={props.className} onClick={props.onClick}>
      <AddButtonText>{props.label ?? "ADD"}</AddButtonText>
      <FontAwesomeIcon icon={Icons.ADD} />
    </AddButtonView>
  );
};
