import * as React from "react";
import { ChangeEvent } from "react";
import styled, { css } from "styled-components";
import { loggerCreator } from "../../../../utils/logger";
import { ConfigurationStyles } from "../../_styles/configurationStyles";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Clickable } from "../../clickable/Clickable";

const moduleLogger = loggerCreator("__filename");

//region [[ Styles ]]

const QwiltInputView = styled.div`
  position: relative;
`;

const Label = styled.label<{ floatLabel: boolean }>`
  ${ConfigurationStyles.STYLE_EDITOR_LABEL};

  ${(props) => props.floatLabel && ConfigurationStyles.STYLE_EDITOR_LABEL_FLOATING};
`;

const Input = styled.input<{ disabled: boolean }>`
  ${ConfigurationStyles.STYLE_EDITOR_CONTROL};
  ${(props) =>
    props.disabled &&
    css`
      background-color: ${ConfigurationStyles.COLOR_GREY_1};
    `}

  &:focus + ${Label} {
    ${ConfigurationStyles.STYLE_EDITOR_LABEL_FLOATING};
  }
`;

const ClearButton = styled(Clickable)`
  position: absolute;
  right: 0.5em;
  top: 50%;
  transform: translateY(-50%);
`;

//endregion

//region [[ Props ]]
export interface Props {
  label: string;
  value: string;
  onChange: (value: string) => void;
  isRequired?: boolean;
  disabled?: boolean;
  type?: string;
  clearable?: boolean;
  preventCapital?: boolean;
  autoComplete?: boolean;

  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;

  className?: string;
}
//endregion

function onClear(onChange: (value: string) => void) {
  onChange("");
}

export const QwiltInput = (props: Props) => {
  // noinspection PointlessBooleanExpressionJS
  return (
    <QwiltInputView className={props.className}>
      <Input
        autoComplete={props.autoComplete === false ? "off" : "on"}
        name={props.label}
        value={props.value}
        onChange={(value: ChangeEvent<{ value: string }>) =>
          props.onChange(props.preventCapital ? value.target.value.toLowerCase() : value.target.value)
        }
        required={!!props.isRequired}
        disabled={!!props.disabled}
        type={props.type === "number" ? "number" : "text"}
        {...props.inputProps}
      />
      <Label htmlFor={props.label} floatLabel={props.value !== "" || !!props.disabled}>
        {props.label}
      </Label>
      {props.clearable && props.value !== "" && (
        <ClearButton onClick={() => onClear(props.onChange)}>
          <FontAwesomeIcon icon={faTimes} />
        </ClearButton>
      )}
    </QwiltInputView>
  );
};
