import * as _ from "lodash";
import * as React from "react";
import styled, { css } from "styled-components";
import { observer } from "mobx-react";
import desaturate from "polished/lib/color/desaturate";

const DrillDownRowCircleView = styled.div`
  ${(props: { color: string }) => css`
    display: inline-block;
    width: 16px;
    height: 16px;
    background-color: ${props.color};
    border-radius: 50%;
    vertical-align: middle;
    margin-right: 0.5em;
    cursor: pointer;

    transition: 0.2s ease;
    &:hover {
      box-shadow: inset 0 0 0 1px ${desaturate(0.3, props.color)}, inset 0 0 0 2px white;
    }
  `};
`;

export interface Props {
  color: string;
  isEnabled: boolean;
  className?: string;
  onClick: () => void;
}

const initialState = {};

type State = Readonly<typeof initialState>;

@observer
export class DrillDownTableRowCircle extends React.Component<Props, State> {
  static defaultProps = {};
  readonly state: State = initialState;

  render() {
    return (
      <DrillDownRowCircleView onClick={this.props.onClick} color={this.props.color} className={this.props.className} />
    );
  }
}
