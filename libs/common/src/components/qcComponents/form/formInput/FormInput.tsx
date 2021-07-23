import * as React from "react";
import styled from "styled-components";
import { FormInputRaw } from "common/components/qcComponents/form/_raw/formInputRaw/FormInputRaw";
import { Control, FieldError, FieldName, useFormContext } from "react-hook-form";
import { useTypedController } from "@hookform/strictly-typed";
import {
  DeepPath,
  DeepPathValue,
  FieldValuesFromControl,
  UnpackNestedValue,
} from "@hookform/strictly-typed/dist/types";
import _ from "lodash";

//region [[ Styles ]]
const FormInputView = styled.div<{ colSpan?: string }>`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  flex: 1 1 auto;
  grid-column: ${(props) => props.colSpan ?? "span 1"};
`;

//endregion [[ Styles ]]

//region [[ Props ]]

export interface Props<T extends UnpackNestedValue<FieldValuesFromControl<Control>>, K extends DeepPath<T, K>> {
  label?: string;
  name: K;
  isDisabled?: boolean;
  placeholder?: string;
  defaultValue?: DeepPathValue<T, K>;
  colSpan?: string;
  type?: "text" | "number";
  className?: string;
}

//endregion [[ Props ]]

/*
  use this to create a fully type-safe input for your form type
  e.g. const TypedFormInput = createTypedInput<ProjectFormType>()
*/
export function createTypedInput<T extends Record<string, unknown>>() {
  return <U extends T, K extends DeepPath<U, K>>(props: Props<U, K>) => {
    return <FormInput {...props} />;
  };
}
/*
  rendering this component directly requires passing both form type and field to be type-safe
  this component can be used in a generic way but not warn you about defaultValue/name props types
*/
export function FormInput<
  FormType extends UnpackNestedValue<FieldValuesFromControl<Control>>,
  Field extends DeepPath<FormType, Field>
>(props: Props<FormType, Field>) {
  const { control, errors } = useFormContext<FormType>();
  const errorIndex = (Array.isArray(props.name) ? props.name.join(".") : props.name) as keyof FormType &
    FieldName<FormType>;
  const error = errors && (errors[errorIndex] as FieldError | undefined);
  const TypedController = useTypedController<FormType>({ control: control as Control });

  return (
    <FormInputView className={props.className} colSpan={props.colSpan}>
      <TypedController
        name={props.name}
        defaultValue={props.defaultValue}
        render={({ onChange, onBlur, value }) => {
          return (
            <FormInputRaw
              onChange={(value) => {
                if (props.type === "number") {
                  onChange(_.toNumber(value));
                } else {
                  onChange(value);
                }
              }}
              type={props.type ?? "text"}
              onBlur={onBlur}
              isDisabled={props.isDisabled}
              value={value}
              label={props.label}
              placeholder={props.placeholder}
              error={error?.message}
            />
          );
        }}
      />
    </FormInputView>
  );
}
