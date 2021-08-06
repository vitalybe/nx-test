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

const QwiltTextAreaView = styled.div`
  position: relative;
`;

const Label = styled.label<{ floatLabel: boolean }>`
  ${ConfigurationStyles.STYLE_EDITOR_LABEL};
  ${(props) => props.floatLabel && ConfigurationStyles.STYLE_EDITOR_LABEL_FLOATING};
`;

const TextArea = styled.textarea<{ disabled: boolean; height?: number }>`
  ${ConfigurationStyles.STYLE_EDITOR_CONTROL};
  ${(props) =>
    props.disabled &&
    css`
      background-color: ${ConfigurationStyles.COLOR_GREY_1};
    `}

  &:focus + ${Label} {
    ${ConfigurationStyles.STYLE_EDITOR_LABEL_FLOATING};
  }

  height: ${(props) => (props.height ? props.height + "px" : "150px")};
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
  onBlur: (value: string) => void;
  isRequired?: boolean;
  disabled?: boolean;
  placeholder: string;
  height?: number;
  type?: string;
  clearable?: boolean;

  className?: string;
}
//endregion

function onClear(onChange: (value: string) => void) {
  onChange("");
}

export const QwiltTextArea = React.memo(({ ...props }: Props) => {
  return (
    <QwiltTextAreaView className={props.className}>
      <TextArea
        name={props.label}
        value={props.value}
        onChange={(value: ChangeEvent<HTMLTextAreaElement>) => props.onChange(value.target.value)}
        onBlur={(value: ChangeEvent<HTMLTextAreaElement>) => props.onBlur(value.target.value)}
        placeholder={props.placeholder}
        required={!!props.isRequired}
        disabled={!!props.disabled}
        height={props.height}
      />
      <Label htmlFor={props.label} floatLabel={true}>
        {props.label}
      </Label>
      {props.clearable && props.value !== "" && (
        <ClearButton onClick={() => onClear(props.onChange)}>
          <FontAwesomeIcon icon={faTimes} />
        </ClearButton>
      )}
    </QwiltTextAreaView>
  );
});
