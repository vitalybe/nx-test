import * as React from "react";
import styled from "styled-components";
import { loggerCreator } from "../../../../utils/logger";
import { ConfigurationStyles } from "../../_styles/configurationStyles";

const moduleLogger = loggerCreator("__filename");

//region [[ Styles ]]

const Label = styled.span`
  margin-right: 0.5em;
  color: ${ConfigurationStyles.COLOR_ROLLING_STONE};
`;

//endregion

export interface Props {
  label: string;
  text: string;

  className?: string;
}

export const FormikText = ({ ...props }: Props) => {
  return (
    <div className={props.className}>
      <Label>{props.label}</Label>
      <span>{props.text}</span>
    </div>
  );
};
