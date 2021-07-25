import * as React from "react";
import styled from "styled-components";
import { loggerCreator } from "../../../../utils/logger";
import { FormDatePickerRaw } from "../_raw/formDatePickerRaw/FormDatePickerRaw";
import {
  DeepPath,
  DeepPathValue,
  FieldValuesFromControl,
  UnpackNestedValue,
} from "@hookform/strictly-typed/dist/types";
import { Control, FieldError, FieldName, useFormContext } from "react-hook-form";
import { useTypedController } from "@hookform/strictly-typed";

const moduleLogger = loggerCreator("__filename");

//region [[ Styles ]]

const FormDatePickerView = styled.div<{ colSpan?: string }>`
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
  isDisabled?: boolean;
  helpText?: string;
  colSpan?: string;
  className?: string;
}

//endregion [[ Props ]]
/*
  use this to create a fully type-safe date picker for your form type
  e.g. const TypedFormSelect = createTypedSelect<ProjectFormType>()
*/
export function createTypedDatePicker<T extends Record<string, unknown>>() {
  return <K extends DeepPath<T, K>>(props: Props<T, K>) => {
    return <FormDatePicker {...props} />;
  };
}

/*
  rendering this component directly requires passing both form type and field to be type-safe
  this component can be used in a generic way but not warn you about defaultValue/name props types
*/
export function FormDatePicker<
  FormType extends UnpackNestedValue<FieldValuesFromControl<Control>>,
  Field extends DeepPath<FormType, Field>
>({ label, name, defaultValue, ...props }: Props<FormType, Field>) {
  const { control, errors } = useFormContext<FormType>();
  const errorIndex = (Array.isArray(name) ? name.join(".") : name) as keyof FormType & FieldName<FormType>;
  const error = errors && (errors[errorIndex] as FieldError | undefined);
  const TypedController = useTypedController<FormType>({ control: control as Control });

  return (
    <FormDatePickerView className={props.className} colSpan={props.colSpan}>
      <TypedController
        name={name}
        defaultValue={defaultValue}
        render={({ onChange, onBlur, value }) => (
          <FormDatePickerRaw
            value={(value as unknown) as Date}
            defaultValue={defaultValue}
            onChange={onChange}
            helpText={props.helpText}
            isDisabled={props.isDisabled}
            label={label}
            onBlur={onBlur}
            error={error?.message}
          />
        )}
      />
    </FormDatePickerView>
  );
}
