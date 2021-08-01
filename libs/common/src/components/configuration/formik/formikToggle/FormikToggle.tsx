import * as React from "react";
import { loggerCreator } from "../../../../utils/logger";
import { Field, FieldProps } from "formik";
import { QwiltToggle } from "../../qwiltForm/qwiltToggle/QwiltToggle";

const moduleLogger = loggerCreator("__filename");

//region [[ Styles ]]´

//endregion

export interface Props {
  field: string;
  label: string;
  disabled?: boolean;
  type?: string;
  isRequired?: boolean;

  className?: string;
}

export const FormikToggle = <T extends {}>({ ...props }: Props) => {
  return (
    <div className={props.className}>
      <Field name={props.field}>
        {(fieldProps: FieldProps<T>) => (
          <QwiltToggle
            label={props.label}
            checked={!!fieldProps.field.value}
            onChange={(value) => fieldProps.form.setFieldValue(props.field, value)}
            disabled={!!props.disabled}
          />
        )}
      </Field>
    </div>
  );
};
