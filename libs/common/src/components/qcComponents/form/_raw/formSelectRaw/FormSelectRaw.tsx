import * as React from "react";
import { ReactNode, ReactText, useEffect, useState } from "react";
import { Select } from "antd";
import { FormInputContainer } from "common/components/qcComponents/form/_parts/formInputContainer/FormInputContainer";
import styled from "styled-components";
import { ErrorIndicationIconAbsolute } from "common/components/qcComponents/form/_parts/inputErrorIndication/InputErrorIndication";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronUp } from "@fortawesome/free-solid-svg-icons/faChevronUp";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons/faChevronDown";
import { CommonColors } from "common/styling/commonColors";
import "antd/dist/antd.css";

const { Option } = Select;

//region [[ Styles ]]

const ArrowIcon = styled(FontAwesomeIcon)`
  position: absolute;
  right: 0.6rem;
  top: calc(50% - 0.4rem);
  margin-left: auto;
  font-size: 0.75rem !important;
  color: ${CommonColors.BLACK_PEARL};
`;

const FormInputContainerStyled = styled(FormInputContainer)`
  min-width: 9.2rem;
  ${ErrorIndicationIconAbsolute} {
    right: 1.5rem;
  }
  .select {
    font-size: 1rem;
    width: 100%;
    .ant-select-selector,
    .ant-select-disabled .ant-select-selector {
      padding: 0 1rem !important;
      border-radius: 0.2rem !important;
      border: 1px solid ${(props) => (!!props.errorMessage ? CommonColors.RADICAL_RED : "#c0bfbf")} !important;
      font-size: 0.75rem;
      color: ${CommonColors.BLACK_PEARL} !important;
      background: white !important;
      font-weight: 500;
      height: 2.78rem !important;
      display: flex;
      align-items: center;
    }
    .ant-select-arrow {
      color: ${(props) => (!!props.errorMessage ? CommonColors.RADICAL_RED : CommonColors.BLACK_PEARL)} !important;
    }
  }
`;
//endregion
//region [[ Props ]]

export interface SelectOption {
  label: string;
  value: ReactText;
  disabled?: boolean;
}

export interface Props {
  value: ReactText;
  label?: string;
  placeholder?: ReactNode;
  helpText?: string;
  onChange: (value: ReactText) => void;
  options: SelectOption[];
  onBlur?: () => void;
  defaultValue?: ReactText;
  error?: string;
  isDisabled?: boolean;
  className?: string;
}

//endregion [[ Props ]]

export function FormSelectRaw({ options, onChange, defaultValue, value, ...props }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (defaultValue && !value) {
      onChange(defaultValue);
    }
  }, [defaultValue, onChange, value]);

  return (
    <FormInputContainerStyled
      className={props.className}
      helpText={props.helpText}
      label={props.label}
      isDisabled={props.isDisabled}
      errorMessage={props.error}>
      <Select
        disabled={props.isDisabled}
        value={value}
        placeholder={props.placeholder}
        onChange={onChange}
        onBlur={props.onBlur}
        className={"select"}
        showArrow={false}
        showAction={["click"]}
        onDropdownVisibleChange={(isOpen) => setIsOpen(isOpen)}>
        {options.map(({ value, label, disabled = false }) => {
          return (
            <Option key={value} value={value} disabled={disabled}>
              {label}
            </Option>
          );
        })}
      </Select>
      <ArrowIcon icon={isOpen ? faChevronUp : faChevronDown} />
    </FormInputContainerStyled>
  );
}
