import * as React from "react";
import { observer } from "mobx-react";
import { Field, FieldProps } from "formik";
import { QwiltTextArea } from "common/components/configuration/qwiltForm/qwiltTextArea/QwiltTextArea";

export interface Props {
  field: string;
  label: string;
  disabled?: boolean;
  type?: string;
  placeholder: string;
  isRequired?: boolean;
  heightPx?: number;
  format?: (value: string) => string;
  restore?: (value: string) => string[];
  className?: string;
}
export type DefaultPropsKeys = never;

const initialState = {};

type State = Readonly<typeof initialState>;

@observer
export class FormikTextArea<T> extends React.Component<Props, State> {
  readonly state: State = {};

  render() {
    const { props } = this;

    return (
      <div className={this.props.className}>
        <Field name={props.field}>
          {(fieldProps: FieldProps<T>) => (
            <QwiltTextArea
              label={this.props.label}
              value={(props.format ? props.format(fieldProps.field.value) : fieldProps.field.value) || ""}
              placeholder={props.placeholder}
              onChange={(value) => {
                fieldProps.form.setFieldValue(props.field, value);
              }}
              onBlur={(value) => {
                if (props.restore) {
                  fieldProps.form.setFieldValue(props.field, props.restore(value));
                }
              }}
              height={props.heightPx}
              type={this.props.type}
              disabled={this.props.disabled}
              isRequired={this.props.isRequired}
            />
          )}
        </Field>
      </div>
    );
  }
}
