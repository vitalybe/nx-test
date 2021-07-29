import * as React from "react";
import { forwardRef, ReactText } from "react";
import styled from "styled-components";
import { loggerCreator } from "common/utils/logger";
import { FormInputContainer } from "common/components/qcComponents/form/_parts/formInputContainer/FormInputContainer";
import { CommonColors } from "common/styling/commonColors";

const moduleLogger = loggerCreator(__filename);

//region [[ Styles ]]

export const StyledFormInput = styled.input<{ isPrefixPadding?: boolean; isError?: boolean; isDisabled?: boolean }>`
  padding: 0 ${(props) => (props.isPrefixPadding ? "1.5rem" : "1rem")};
  border-radius: 0.2rem;
  border: 1px solid
    ${(props) =>
      props.isDisabled ? CommonColors.PATTENS_BLUE : props.isError ? CommonColors.RADICAL_RED : CommonColors.SILVER};
  font-size: 0.75rem;
  color: ${CommonColors.BLACK_PEARL};
  font-weight: 500;
  max-width: 100%;
  height: 100%;
  width: 100%;
  ::placeholder {
    color: #063446;
    opacity: 0.3;
  }
  pointer-events: ${(props) => (props.isDisabled ? "none" : "auto")};
`;

//endregion [[ Styles ]]

//region [[ Props ]]

export interface Props {
  label?: string;
  name?: string;
  type?: string;
  placeholder?: string;
  error?: string;
  value?: ReactText;
  onChange?: (value: ReactText) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  visualPrefix?: string;
  formNoValidate?: boolean;
  isDisabled?: boolean;
  autoFocus?: boolean;
  className?: string;
}

//endregion [[ Props ]]

export const FormInputRaw = forwardRef<HTMLInputElement, Props>(
  ({ label, name, error, placeholder, ...props }, ref) => {
    return (
      <FormInputContainer
        label={label}
        errorMessage={error}
        visualPrefix={props.visualPrefix}
        className={props.className}>
        <StyledFormInput
          isPrefixPadding={!!props.visualPrefix}
          type={props.type ?? "text"}
          isDisabled={props.isDisabled}
          onChange={props.onChange && ((e) => props.onChange?.(e.target.value))}
          onBlur={props.onBlur}
          onFocus={props.onFocus}
          value={props.value ?? ""}
          isError={!!error}
          name={name}
          placeholder={placeholder}
          ref={ref}
          formNoValidate={props.formNoValidate}
          autoComplete={"off"}
          autoFocus={props.autoFocus}
        />
      </FormInputContainer>
    );
  }
);
