import * as React from "react";
import { ChangeEvent, useState } from "react";
import styled, { css } from "styled-components";
import { loggerCreator } from "../../../../utils/logger";
import { ConfigurationStyles } from "../../_styles/configurationStyles";
import { faSearch, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CommonColors } from "../../../../styling/commonColors";
import { Clickable } from "../../clickable/Clickable";

const moduleLogger = loggerCreator("__filename");

//region [[ Styles ]]

const QwiltSearchView = styled.div`
  position: relative;
`;

const Icon = styled.div<{ show: boolean }>`
  position: absolute;
  left: 10px;
  opacity: ${(props) => (props.show ? 1 : 0)};
  top: 14px;
`;

const Label = styled.label<{ floatLabel: boolean }>`
  ${ConfigurationStyles.STYLE_EDITOR_LABEL};
  left: ${(props) => (props.floatLabel ? "2em" : "2em")};
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
  right: 1em;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
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

  className?: string;
}
//endregion

function onClear(onChange: (value: string) => void) {
  onChange("");
}

export const QwiltSearch = React.memo(({ ...props }: Props) => {
  const [showIcon, setShowIcon] = useState(true);

  return (
    <QwiltSearchView className={props.className}>
      <Icon show={props.value === "" && showIcon}>
        <FontAwesomeIcon icon={faSearch} color={CommonColors.GEYSER} />
      </Icon>

      <Input
        name={props.label}
        value={props.value}
        onFocus={() => {
          setShowIcon(false);
        }}
        onChange={(value: ChangeEvent<HTMLInputElement>) => props.onChange(value.target.value)}
        onBlur={() => {
          setShowIcon(true);
        }}
        required={!!props.isRequired}
        disabled={!!props.disabled}
        type={props.type === "number" ? "number" : "text"}
      />
      <Label htmlFor={props.label} floatLabel={props.value !== ""}>
        {props.label}
      </Label>
      {props.clearable && props.value !== "" && (
        <ClearButton onClick={() => onClear(props.onChange)}>
          <FontAwesomeIcon icon={faTimes} />
        </ClearButton>
      )}
    </QwiltSearchView>
  );
});
