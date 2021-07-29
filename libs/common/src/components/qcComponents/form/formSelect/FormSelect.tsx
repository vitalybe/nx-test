import * as React from "react";
import { ReactNode, ReactText } from "react";
import styled from "styled-components";
import { loggerCreator } from "../../../../utils/logger";
import { Control, FieldError, FieldName, useFormContext } from "react-hook-form";
import { useTypedController } from "@hookform/strictly-typed";
import { FormSelectRaw, SelectOption } from "../_raw/formSelectRaw/FormSelectRaw";
import {
  DeepPath,
  DeepPathValue,
  FieldValuesFromControl,
  UnpackNestedValue,
} from "@hookform/strictly-typed/dist/types";

const moduleLogger = loggerCreator("__filename");

//region [[ Styles ]]
const FormSelectView = styled.div<{ colSpan?: string }>`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  flex: 1 1 auto;
  grid-column: ${(props) => props.colSpan ?? "span 1"};
`;

//endregion [[ Styles ]]

//region [[ Props ]]
export interface Props<T extends UnpackNestedValue<FieldValuesFromControl<Control>>, K extends DeepPath<T, K>> {
  label: string;
  name: K;
  defaultValue?: DeepPathValue<T, K>;
  options: SelectOption[];
  isDisabled?: boolean;
  placeholder?: ReactNode;
  helpText?: string;
  colSpan?: string;
  className?: string;
}

//endregion [[ Props ]]

/*
  use this to create a fully type-safe select for your form type
  e.g. const TypedFormSelect = createTypedSelect<ProjectFormType>()
*/
export function createTypedSelect<T extends Record<string, unknown>>() {
  return <K extends DeepPath<T, K>>(props: Props<T, K>) => {
    return <FormSelect {...props} />;
  };
}
/*
  rendering this component directly requires passing both form type and field to be type-safe
  this component can be used in a generic way but not warn you about defaultValue/name props types
*/
export function FormSelect<
  FormType extends UnpackNestedValue<FieldValuesFromControl<Control>>,
  Field extends DeepPath<FormType, Field>
>({ label, name, options, defaultValue, ...props }: Props<FormType, Field>) {
  const { control, errors } = useFormContext<FormType>();
  const errorIndex = (Array.isArray(name) ? name.join(".") : name) as keyof FormType & FieldName<FormType>;
  const error = errors && (errors[errorIndex] as FieldError | undefined);
  const TypedController = useTypedController<FormType>({ control: control as Control });
  return (
    <FormSelectView className={props.className} colSpan={props.colSpan}>
      <TypedController
        name={name}
        defaultValue={defaultValue}
        render={({ onChange, onBlur, value }) => (
          <FormSelectRaw
            placeholder={props.placeholder}
            helpText={props.helpText}
            isDisabled={props.isDisabled}
            onChange={onChange}
            label={label}
            onBlur={onBlur}
            value={(value as unknown) as ReactText}
            options={options}
            error={error?.message}
          />
        )}
      />
    </FormSelectView>
  );
}
