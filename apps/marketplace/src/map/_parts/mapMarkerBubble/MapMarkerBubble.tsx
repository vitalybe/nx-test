import * as React from "react";
import styled, { css } from "styled-components";
import { observer } from "mobx-react";
import { loggerCreator } from "@qwilt/common/utils/logger";
import { bubbleAnimationDirector } from "./bubbleAnimationDirector";
import { darken, transparentize } from "polished";

//noinspection JSUnusedLocalSymbols
const moduleLogger = loggerCreator("__filename");

const MapMarkerBubbleView = styled.div``;

const BubbleAnimationStyled = styled.div`
  ${(props: { color: string }) => css`
    position: absolute;
    border-radius: 50%;
    background-color: ${transparentize(0.3, props.color)};
    pointer-events: none;
    height: 2px;
    width: 2px;
    left: -1px;
    top: -1px;
  `};
`;

const CenterCircle = styled.div`
  ${(props: { color: string; size: number; canClick: boolean }) => css`
    width: ${props.size}px;
    height: ${props.size}px;
    transform: translateX(${-props.size / 2}px) translateY(${-props.size / 2}px);
    border-radius: 50%;
    background-color: ${props.color};
    cursor: ${props.canClick ? "pointer" : "auto"};
  `};
`;

interface Props {
  id: string;
  enableAnimation: boolean;
  isHighlighted: boolean;
  isEnlarged: boolean;
  currentZoom: number;
  color: string;
  dimmedColor?: string;

  onClick?: () => void;
  onMouseOver?: () => void;
  onMouseLeave?: () => void;
}

const initialState = {};
type State = Readonly<typeof initialState>;

@observer
export class MapMarkerBubble extends React.Component<Props, State> {
  static defaultProps: Pick<Props, "enableAnimation"> = { enableAnimation: false };
  readonly state: State = initialState;

  bubble1 = React.createRef<HTMLElement>();

  componentDidMount() {
    if (this.props.enableAnimation) {
      bubbleAnimationDirector.addBubble({
        id: this.props.id,
        bubble1: this.bubble1.current!,
      });
    }
  }

  componentWillUnmount() {
    bubbleAnimationDirector.removeBubble(this.props.id);
  }

  render() {
    let bubbleSize;
    if (this.props.currentZoom <= 3) {
      bubbleSize = 4;
    } else if (this.props.currentZoom === 4) {
      bubbleSize = 7;
    } else if (this.props.currentZoom >= 5) {
      bubbleSize = 9;
    } else {
      throw new Error(`unexpected zoom state`);
    }

    bubbleSize += this.props.isEnlarged ? 5 : 0;

    let color;
    if (this.props.isHighlighted) {
      color = this.props.color;
    } else if (this.props.isEnlarged) {
      color = this.props.color;
    } else {
      color = this.props.dimmedColor || darken(0.4, this.props.color);
    }

    return (
      <MapMarkerBubbleView>
        <BubbleAnimationStyled ref={this.bubble1 as any} color={color} />
        <CenterCircle
          size={bubbleSize}
          color={color}
          canClick={!!this.props.onClick}
          onMouseOver={this.props.onMouseOver}
          onMouseLeave={this.props.onMouseLeave}
          onClick={this.props.onClick}
        />
      </MapMarkerBubbleView>
    );
  }
}
