import * as React from "react";
import styled from "styled-components";
import { observer } from "mobx-react";
import { ConfigurationStyles } from "common/components/configuration/_styles/configurationStyles";
import { CommonColors } from "common/styling/commonColors";

const FormikGroupView = styled.div`
  padding: 2em 0.5em 0;
  border: 3px solid ${ConfigurationStyles.COLOR_BLUE_4};
  border-radius: 5px;
  position: relative;
`;

const Label = styled.label`
  ${ConfigurationStyles.STYLE_EDITOR_LABEL};
  ${ConfigurationStyles.STYLE_EDITOR_LABEL_FLOATING};

  text-shadow: ${ConfigurationStyles.getEditorLabelShadow(CommonColors.MYSTIC_2)};
`;

export interface Props {
  label: string;
  className?: string;
}
export type DefaultPropsKeys = never;

const initialState = {};

type State = Readonly<typeof initialState>;

@observer
export class QwiltFormGroup extends React.Component<Props, State> {
  static defaultProps: Pick<Props, DefaultPropsKeys> = {};
  readonly state: State = initialState;

  render() {
    return (
      <FormikGroupView className={this.props.className}>
        <Label>{this.props.label}</Label>
        {this.props.children}
      </FormikGroupView>
    );
  }
}
