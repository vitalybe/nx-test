import * as React from "react";
import styled, { css, FlattenSimpleInterpolation } from "styled-components";
import { loggerCreator } from "common/utils/logger";
import { ConfigurationStyles } from "common/components/configuration/_styles/configurationStyles";
import Switch from "react-switch";
import { transparentize } from "polished";
import { CommonColors } from "common/styling/commonColors";

const moduleLogger = loggerCreator(__filename);

//region [[ Styles ]]

const QwiltToggleView = styled.div`
  display: flex;
  align-items: center;
`;

const Label = styled.label<{ customStyles?: FlattenSimpleInterpolation }>`
  ${(props) =>
    props.customStyles ??
    css`
      color: ${ConfigurationStyles.COLOR_ROLLING_STONE};
      text-shadow: ${ConfigurationStyles.getEditorLabelShadow(ConfigurationStyles.COLOR_DODGER_BLUE)};
    `}
  margin-right: 0.5em;
`;

//endregion

export interface Props {
  label: string;
  customLabelStyles?: FlattenSimpleInterpolation;
  checked: boolean;
  onChange: (value: boolean) => void;
  isRequired?: boolean;
  disabled?: boolean;
  height?: number;
  width?: number;
  disableInnerIcons?: boolean;

  className?: string;
}

export const QwiltToggle = ({ height = 20, width = 40, ...props }: Props) => {
  return (
    <QwiltToggleView className={props.className}>
      <Label htmlFor={props.label} customStyles={props.customLabelStyles}>
        {props.label}
      </Label>
      <Switch
        onColor={transparentize(0, CommonColors.MATISSE)}
        name={props.label}
        height={height}
        width={width}
        checked={props.checked}
        onChange={(value) => props.onChange(value)}
        disabled={!!props.disabled}
        checkedIcon={props.disableInnerIcons ? false : undefined}
        uncheckedIcon={props.disableInnerIcons ? false : undefined}
      />
    </QwiltToggleView>
  );
};
