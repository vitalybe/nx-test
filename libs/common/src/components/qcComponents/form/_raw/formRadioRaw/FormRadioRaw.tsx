import * as React from "react";
import { ReactNode, ReactText, useEffect } from "react";
import { FormInputContainer } from "common/components/qcComponents/form/_parts/formInputContainer/FormInputContainer";
import styled from "styled-components";
import { Radio } from "antd";
import { CheckboxOptionType } from "antd/es/checkbox";
import { CommonColors } from "common/styling/commonColors";

//region [[ Styles ]]
const RadioGroup = styled(Radio.Group)`
  .ant-radio-wrapper {
    margin-right: 1.5rem;
    .ant-radio-checked .ant-radio-inner {
      border-color: ${CommonColors.HIPPIE_BLUE};
      &::after {
        background-color: ${CommonColors.HIPPIE_BLUE};
      }
    }
  }
  &:hover .ant-radio-inner {
    border-color: ${CommonColors.HIPPIE_BLUE};
  }

  .ant-radio-inner {
    border-width: 2px;
    &::after {
      top: 2px;
      left: 2px;
    }
  }
`;
const FormInputContainerStyled = styled(FormInputContainer)`
  height: auto;
`;
//endregion

export interface Props {
  value: ReactText;
  label?: string;
  placeholder?: ReactNode;
  helpText?: string;
  onChange: (value: ReactText) => void;
  options: CheckboxOptionType[];
  onBlur?: () => void;
  defaultValue?: ReactText;
  error?: string;
  isDisabled?: boolean;
  className?: string;
}

//endregion [[ Props ]]

export function FormRadioRaw({ options, onChange, defaultValue, value, ...props }: Props) {
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
      <RadioGroup value={value} defaultValue={defaultValue} onChange={(e) => onChange(e.target.value)}>
        {options.map(({ value, label }) => (
          <Radio key={value.toString()} value={value}>
            {label}
          </Radio>
        ))}
      </RadioGroup>
    </FormInputContainerStyled>
  );
}
