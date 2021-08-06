import * as React from "react";
import styled from "styled-components";
import { loggerCreator } from "../../../utils/logger";
import { IFloatingFilterParams } from "ag-grid-community";
import { Component } from "react";

const moduleLogger = loggerCreator("__filename");

//region [[ Styles ]]

const SimpleTextFloatingFilterView = styled.div`
  width: 100%;
  align-content: center;
  justify-content: center;
  height: 100%;
  padding-bottom: 5px;
`;

const InputStyled = styled.input`
  height: 100%;
  width: 100%;
  background-color: transparent;
  border: transparent;
  border-bottom: 2px solid #a6b1b5;
  font-weight: bold;
  transition: 0.2s ease;
  color: #61676a;
  outline: none;

  &:focus {
    border-bottom: 2px solid #61676a;
  }
`;

//endregion [[ Styles ]]

//region [[ Props ]]

export interface Props extends IFloatingFilterParams {
  className?: string;
}

//endregion [[ Props ]]

const defaultState: { value: string } = {
  value: "",
};
type State = typeof defaultState;

export class SimpleTextFloatingFilter extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = defaultState;
  }

  valueChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState(
      {
        value: event.target.value,
      },
      () => {
        const valueToUse = this.state.value === "" ? null : this.state.value;
        this.props.parentFilterInstance(function (instance) {
          // @ts-ignore - Required for Ag-Grid
          instance.onFloatingFilterChanged("contains", valueToUse);
        });
      }
    );
  };

  //Used by Ag-Grid
  getReactContainerClasses() {
    return ["custom-header"];
  }

  //Used by Ag-Grid
  getReactContainerStyle() {
    return {
      width: "100%",
    };
  }

  //Used by Ag-Grid
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onParentModelChanged(parentModel: any) {
    this.setState({
      value: !parentModel ? "" : parentModel.filter,
    });
  }

  render() {
    return (
      <SimpleTextFloatingFilterView>
        <InputStyled type="text" value={this.state.value} onChange={this.valueChanged} placeholder={"Filter"} />
      </SimpleTextFloatingFilterView>
    );
  }
}
