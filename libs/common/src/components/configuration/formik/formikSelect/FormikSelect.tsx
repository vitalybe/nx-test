import * as React from "react";
import styled, { css } from "styled-components";
import { observer } from "mobx-react";
import { ConfigurationStyles } from "../../_styles/configurationStyles";
import { Field, FieldProps } from "formik";
import { CommonColors } from "../../../../styling/commonColors";

const FormikSelectView = styled.div``;

const Container = styled.div`
  position: relative;
  &::after {
    position: absolute;
    right: 0.5em;
    top: 50%;
    transform: translateY(-50%);

    content: "▼";
    color: ${CommonColors.MATISSE};
    pointer-events: none;
  }
`;

const Label = styled.label<{}>`
  // NOTE: Both are "LABEL" and "LABEL_FLOATING" are needed
  ${ConfigurationStyles.STYLE_EDITOR_LABEL};
  ${ConfigurationStyles.STYLE_EDITOR_LABEL_FLOATING};
`;

const SelectStyled = styled.select<{ disabled: boolean }>`
  ${ConfigurationStyles.STYLE_EDITOR_CONTROL};
  ${(props) =>
    props.disabled &&
    css`
      background-color: ${ConfigurationStyles.COLOR_GREY_1};
    `};
  -webkit-appearance: none;
  -moz-appearance: none;
`;

export interface Props {
  field: string;
  label: string;
  value?: string;
  disabled?: boolean;
  required?: boolean;
  onChange?: (value: string, fieldProps: FieldProps) => void;

  className?: string;
}
export type DefaultPropsKeys = never;

const initialState = {};

type State = Readonly<typeof initialState>;

@observer
export class FormikSelect extends React.Component<Props, State> {
  static defaultProps: Pick<Props, DefaultPropsKeys> = {};
  readonly state: State = initialState;

  render() {
    const { props } = this;

    return (
      <FormikSelectView className={this.props.className}>
        <Container>
          <Field name={props.field}>
            {(fieldProps: FieldProps) => (
              <SelectStyled
                required={props.required}
                disabled={!!props.disabled}
                value={props.value !== undefined ? props.value : fieldProps.field.value}
                onChange={(event: { target: { value: string } }) =>
                  props.onChange
                    ? props.onChange(event.target.value, fieldProps)
                    : fieldProps.form.setFieldValue(props.field, event.target.value)
                }>
                {this.props.children}
              </SelectStyled>
            )}
          </Field>
          <Label htmlFor={this.props.field}>{this.props.label}</Label>
        </Container>
      </FormikSelectView>
    );
  }
}
