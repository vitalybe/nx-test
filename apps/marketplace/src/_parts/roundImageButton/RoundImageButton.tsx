import * as React from "react";
import styled, { css } from "styled-components";
import { observer } from "mobx-react";
import { Colors } from "src/_styling/colors";

const RoundImageButtonView = styled.div`
  ${(props: {}) => {
    return css`
      background-color: ${Colors.NAVY_8};
      width: ${RoundImageButton.size}px;
      height: ${RoundImageButton.size}px;
      border-radius: 50%;

      display: flex;
      justify-content: center;
      align-items: center;

      cursor: pointer;

      transition: 0.2s ease;
      &:hover {
        filter: brightness(110%);
      }

      &:active {
        filter: brightness(130%);
      }
    `;
  }};
`;

export interface Props {
  imagePath: string;
  onClick: () => void;

  className?: string;
}
export type DefaultPropsKeys = never;

const initialState = {};

type State = Readonly<typeof initialState>;

@observer
export class RoundImageButton extends React.Component<Props, State> {
  static defaultProps: Pick<Props, DefaultPropsKeys> = {};
  readonly state: State = initialState;

  static size = 48;

  render() {
    return (
      <RoundImageButtonView className={this.props.className} onClick={this.props.onClick} {...this.props}>
        <img src={this.props.imagePath} alt={""} />
      </RoundImageButtonView>
    );
  }
}
