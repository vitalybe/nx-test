import * as React from "react";
import { loggerCreator } from "../../../../utils/logger";
import { Field, FieldProps } from "formik";
import {
  Props as PropsQwiltReactSelect,
  QwiltReactSelect,
  SelectComponentProps,
} from "../../qwiltForm/qwiltReactSelect/QwiltReactSelect";

const moduleLogger = loggerCreator("__filename");

//region [[ Styles ]]

//endregion [[ Styles ]]

//region [[ Props ]]

export interface Props<T> extends Omit<PropsQwiltReactSelect<T>, "onChange"> {
  field: string;
  //defaultValue -> refers to the initial selected value if fieldProps.field.value is empty.
  //e.g. in case when fieldProps.field.value is empty, QwiltReactSelect will show no initial selected value,
  //which might confuse the user. when undefinedValue is set, QwiltReactSelect will show its value
  defaultValue?: string | undefined;
  onChange?: (value: T | undefined, fieldProps: FieldProps) => void;

  reactSelectProps?: SelectComponentProps<T>;

  className?: string;
}

//endregion [[ Props ]]

//region [[ Functions ]]
//endregion [[ Functions ]]

export const FormikReactSelect = <T extends unknown>(props: Props<T>) => {
  const { field, onChange, ...propsQwiltReactSelect } = props;

  return (
    <Field name={field}>
      {(fieldProps: FieldProps) => {
        // NOTE: we use null instead of undefined since since react-select ignores it when value becomes undefined
        // https://github.com/JedWatson/react-select/issues/3066
        const defaultValue = props.defaultValue ?? null;

        const value = fieldProps.field.value ? fieldProps.field.value : defaultValue;
        return (
          <QwiltReactSelect<T>
            className={props.className}
            value={value}
            onChange={(value: T | undefined) => {
              fieldProps.form.setFieldValue(fieldProps.field.name, value);
              if (onChange) {
                onChange(value, fieldProps);
              }
            }}
            {...propsQwiltReactSelect}
          />
        );
      }}
    </Field>
  );
};
