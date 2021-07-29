import * as React from "react";
import { ReactNode } from "react";
import styled from "styled-components";
import { Control, useFormContext } from "react-hook-form";
import { useTypedController } from "@hookform/strictly-typed";
import {
  DeepPath,
  DeepPathValue,
  FieldValuesFromControl,
  UnpackNestedValue,
} from "@hookform/strictly-typed/dist/types";
import { Checkbox } from "../../../checkbox/Checkbox";

//region [[ Styles ]]
const FormCheckboxView = styled.div<{ colSpan?: string }>`
  grid-column: ${(props) => props.colSpan ?? "span 1"};
`;

//endregion [[ Styles ]]

//region [[ Props ]]

export interface Props<T extends UnpackNestedValue<FieldValuesFromControl<Control>>, K extends DeepPath<T, K>> {
  label?: string;
  name: K;
  children?: ReactNode;
  isDisabled?: boolean;
  placeholder?: string;
  defaultValue?: DeepPathValue<T, K>;
  colSpan?: string;
  className?: string;
}

//endregion [[ Props ]]

/*
  use this to create a fully type-safe input for your form type
  e.g. const TypedFormCheckbox = createTypedInput<ProjectFormType>()
*/
export function createTypedCheckbox<T extends Record<string, unknown>>() {
  return <U extends T, K extends DeepPath<U, K>>(props: Props<U, K>) => {
    return <FormCheckbox {...props} />;
  };
}
/*
  rendering this component directly requires passing both form type and field to be type-safe
  this component can be used in a generic way but not warn you about defaultValue/name props types
*/
export function FormCheckbox<
  FormType extends UnpackNestedValue<FieldValuesFromControl<Control>>,
  Field extends DeepPath<FormType, Field>
>(props: Props<FormType, Field>) {
  const { control } = useFormContext<FormType>();
  const TypedController = useTypedController<FormType>({ control: control as Control });

  return (
    <FormCheckboxView className={props.className} colSpan={props.colSpan}>
      <TypedController
        name={props.name}
        defaultValue={props.defaultValue}
        render={({ onChange, value }) => (
          <Checkbox onClick={() => onChange(!value)} isDisabled={props.isDisabled} isChecked={value}>
            {props.children}
          </Checkbox>
        )}
      />
    </FormCheckboxView>
  );
}
