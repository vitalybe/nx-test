import * as React from "react";
import { useCallback } from "react";
import styled from "styled-components";
import { Field, FieldProps, FormikProps } from "formik";
import {
  Props as QwiltJsonProps,
  QwiltJsonEditor,
} from "../../qwiltForm/qwiltJsonEditor/QwiltJsonEditor";

//region [[ Styles ]]´

const FormikJsonView = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
`;

//endregion

export interface Props extends QwiltJsonProps {
  field: string;
  className?: string;
}

export const FormikJson = ({ field, ...props }: Props) => {
  const onChangeCallback = useCallback(
    (jsonText: string, jsonObject: object | undefined, errorMessage: string | undefined, form: FormikProps<object>) => {
      if (errorMessage) {
        form.setFieldError(field, errorMessage);
      } else {
        form.setFieldError(field, "");
      }

      if (jsonObject) {
        form.setFieldValue(field, jsonObject);
      }
    },
    [field]
  );

  return (
    <FormikJsonView className={props.className}>
      <Field name={field}>
        {(fieldProps: FieldProps<object>) => (
          <QwiltJsonEditor
            label={props.label}
            onChange={(text: string, value: object | undefined, error?: string) =>
              onChangeCallback(text, value, error, fieldProps.form)
            }
            {...props}
          />
        )}
      </Field>
    </FormikJsonView>
  );
};
