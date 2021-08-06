import * as React from "react";
import { ReactNode } from "react";
import styled from "styled-components";
import { loggerCreator } from "../../../../utils/logger";
import Flatpickr from "react-flatpickr";
import { Field, FieldProps } from "formik";
import flatpickr from "flatpickr";
import { ConfigurationStyles } from "../../_styles/configurationStyles";
import "flatpickr/dist/themes/material_blue.css";
import { DateTime } from "luxon";

const moduleLogger = loggerCreator("__filename");

//region [[ Styles ]]

const FormikDateTimePickerView = styled.div`
  position: relative;
`;

const Label = styled.div`
  position: absolute;
  ${ConfigurationStyles.STYLE_EDITOR_LABEL};
  ${ConfigurationStyles.STYLE_EDITOR_LABEL_FLOATING};
`;

const FlatpickrStyled = styled(Flatpickr)`
  padding: 0.9em 1.5em 0.7em 0.5em;
  width: 100%;
  border: 1px solid #cad5d9;
  padding: 0.9em 1.5em 0.7em 0.5em;
  outline: 0;
  border-radius: 5px;
`;

//endregion [[ Styles ]]

//region [[ Props ]]

export interface Props {
  label: ReactNode;
  field: string;

  disabled?: boolean;
  flatPickrOptions?: flatpickr.Options.Options;

  className?: string;
}

//endregion [[ Props ]]

export const FormikDateTimePicker = (props: Props) => {
  return (
    <FormikDateTimePickerView className={props.className}>
      <Label>{props.label}</Label>
      <Field name={props.field}>
        {(fieldProps: FieldProps) => {
          const value = fieldProps.field.value instanceof DateTime ? fieldProps.field.value.toJSDate() : new Date();
          return (
            <FlatpickrStyled
              key={(props.disabled ?? false).toString()}
              disabled={props.disabled}
              data-enable-time
              value={value}
              onChange={(date) => {
                fieldProps.form.setFieldValue(props.field, DateTime.fromJSDate(date[0]));
              }}
              options={{ enableTime: true, altInput: true, altFormat: "F j, Y H:i", ...props.flatPickrOptions }}
            />
          );
        }}
      </Field>
    </FormikDateTimePickerView>
  );
};
