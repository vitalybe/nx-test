import * as React from "react";
import { observer } from "mobx-react";
import { Field, FieldProps } from "formik";
import { QwiltInput } from "../../qwiltForm/qwiltInput/QwiltInput";

export interface Props<T> {
  field: string;
  label: string;
  disabled?: boolean;
  onChange?: (value: string, fieldProps?: FieldProps<T>) => void;
  type?: string;
  isRequired?: boolean;
  preventCapital?: boolean;

  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;

  className?: string;
}
export type DefaultPropsKeys = never;

const initialState = {};

type State = Readonly<typeof initialState>;

@observer
export class FormikInput<T> extends React.Component<Props<T>, State> {
  readonly state: State = {};

  render() {
    const { props } = this;

    return (
      <div className={props.className}>
        <Field name={props.field}>
          {(fieldProps: FieldProps<T>) => (
            // value ?? "" - Without formik complains about unctonrolled input becoming controlled when not passing initial srtings
            <QwiltInput
              autoComplete={false}
              label={props.label}
              value={fieldProps.field.value ?? ""}
              onChange={(value) => {
                fieldProps.form.setFieldValue(props.field, value);
                if (props.onChange) {
                  props.onChange(value, fieldProps);
                }
              }}
              type={props.type}
              disabled={props.disabled}
              isRequired={props.isRequired}
              inputProps={props.inputProps}
              preventCapital={props.preventCapital}
            />
          )}
        </Field>
      </div>
    );
  }
}
