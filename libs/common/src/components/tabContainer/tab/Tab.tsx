import * as React from "react";
import styled, { css } from "styled-components";
import { observer } from "mobx-react";
import { CommonColors } from "common/styling/commonColors";

const TabView = styled.div`
  ${(props: { isSelected: boolean }) => css`
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    min-height: 3em;

    padding: 0.5em;
    border: 1px solid ${CommonColors.GRAY_1};
    border-bottom: 0;
    background-color: #c7d5da;
    opacity: 0.3;
    border-radius: 10px 10px 0 0;
    transition: opacity 0.3s ease;

    ${props.isSelected
      ? css`
          opacity: 1;
        `
      : css`
          cursor: pointer;
          &:hover {
            opacity: 1;
          }
        `};
  `};
`;

const TabTitle = styled.div`
  font-weight: bold;
`;

export interface Props {
  title: string;
  index: number;
  isSelected: boolean;

  onClick: (index: number) => void;

  className?: string;
}
export type DefaultPropsKeys = never;

const initialState = {};

type State = Readonly<typeof initialState>;

@observer
export class Tab extends React.Component<Props, State> {
  static defaultProps: Pick<Props, DefaultPropsKeys> = {};
  readonly state: State = initialState;

  onClick = () => {
    this.props.onClick(this.props.index);
  };

  render() {
    return (
      <TabView className={this.props.className} onClick={this.onClick} isSelected={this.props.isSelected}>
        <TabTitle>{this.props.title.toUpperCase()}</TabTitle>
      </TabView>
    );
  }
}
