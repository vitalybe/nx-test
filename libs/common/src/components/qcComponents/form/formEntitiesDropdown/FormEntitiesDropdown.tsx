import * as React from "react";
import styled from "styled-components";
import { loggerCreator } from "common/utils/logger";
import { DeepPath, FieldValuesFromControl, UnpackNestedValue } from "@hookform/strictly-typed/dist/types";
import { Control, FieldError, FieldName, useFormContext } from "react-hook-form";
import { useTypedController } from "@hookform/strictly-typed";
import { DropdownEntity } from "common/components/entitiesDropdown/_domain/dropdownEntity";
import {
  DropdownEntityIdType,
  FormEntitiesDropdownRaw,
} from "common/components/qcComponents/form/_raw/formEntitiesDropdownRaw/FormEntitiesDropdownRaw";
import { EntitiesDropdownSelectionMode } from "common/components/entitiesDropdown/EntitiesDropdown";

const moduleLogger = loggerCreator(__filename);

//region [[ Styles ]]

const FormEntitiesDropdownView = styled.div<{ colSpan?: string }>`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  flex: 1 1 50%;
  grid-column: ${(props) => props.colSpan ?? "span 1"};
`;

//endregion [[ Styles ]]

//region [[ Props ]]

export interface Props<T extends UnpackNestedValue<FieldValuesFromControl<Control>>, K extends DeepPath<T, K>> {
  label?: string;
  name: K;
  items: DropdownEntity[];
  selectionMode: EntitiesDropdownSelectionMode;
  isDisabled?: boolean;
  isLoading?: boolean;
  allItemsSelectedText?: string;
  itemType?: string;
  itemTypePlural?: string;
  placeholder?: string;
  colSpan?: string;
  className?: string;
}

// endregion [[ Props ]]

/*
  use this to create a fully type-safe entities dropdown for your form type
  e.g. const TypedFormEntitiesDropdown = createTypedEntitiesDropdown<ProjectFormType>()
*/
export function createTypedEntitiesDropdown<T extends Record<string, unknown>>() {
  return <K extends DeepPath<T, K>>(props: Props<T, K>) => {
    return <FormEntitiesDropdown {...props} name={props.name as string} />;
  };
}
/*
  rendering this component directly requires passing both form type and field to be type-safe
  this component can be used in a generic way but not warn you about name prop's type
*/
export function FormEntitiesDropdown<
  FormType extends UnpackNestedValue<FieldValuesFromControl<Control>>,
  Field extends DeepPath<FormType, Field>
>(props: Props<FormType, Field>) {
  const { control, errors } = useFormContext<FormType>();
  const errorIndex = (Array.isArray(props.name) ? props.name.join(".") : props.name) as keyof FormType &
    FieldName<FormType>;
  const error = errors && (errors[errorIndex] as FieldError | undefined);
  const TypedController = useTypedController<FormType>({ control: control as Control });

  return (
    <FormEntitiesDropdownView className={props.className} colSpan={props.colSpan}>
      <TypedController
        name={props.name}
        render={({ onChange, value, onBlur }) => (
          <FormEntitiesDropdownRaw
            items={props.items}
            controlledValue={(value as unknown) as DropdownEntityIdType | DropdownEntityIdType[]}
            onChange={onChange}
            onBlur={onBlur}
            selectionMode={props.selectionMode}
            isDisabled={props.isDisabled}
            label={props.label}
            errorMessage={error?.message}
            placeholder={props.placeholder}
            isLoading={props.isLoading}
            itemType={props.itemType}
            itemTypePlural={props.itemTypePlural}
            allItemsSelectedText={props.allItemsSelectedText}
          />
        )}
      />
    </FormEntitiesDropdownView>
  );
}
