import * as React from "react";
import styled, { css } from "styled-components";
import { observer } from "mobx-react";
import { RefObject, WheelEvent } from "react";
import Scrollbars from "react-custom-scrollbars";

// NOTE: This has no effect on macbook without mouse https://github.com/malte-wessel/react-custom-scrollbars/issues/233
const NativeScrollingView = styled(Scrollbars)`
  .thumb-horizontal {
    display: block;
    cursor: pointer;
    border-radius: inherit;
    background-color: rgba(2, 46, 63, 0.4);
    opacity: 0;
    transition: opacity 0.2s ease;
  }

  &:hover {
    .thumb-horizontal {
      opacity: 1;
    }
  }
`;

export interface Props {
  className?: string;
  axis: "x" | "y";
  getRef?: (ref: RefObject<Scrollbars>) => void;
}

const initialState = {};

type State = Readonly<typeof initialState>;

@observer
export class NativeScrolling extends React.Component<Props, State> {
  static defaultProps = {};
  readonly state: State = initialState;

  scrollbarRef: RefObject<any> = React.createRef();
  componentDidMount() {
    if (this.props.getRef) {
      this.props.getRef(this.scrollbarRef);
    }
  }
  onWheel = (e: WheelEvent<Scrollbars>) => {
    if (this.scrollbarRef && this.scrollbarRef.current && this.props.axis === "x") {
      // noinspection JSSuspiciousNameCombination
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        const currentScrollDelta = this.scrollbarRef.current.getScrollLeft();
        this.scrollbarRef.current.scrollLeft(currentScrollDelta + e.deltaY);

        e.preventDefault();
      }
    }
  };
  render() {
    return (
      <NativeScrollingView
        autoHeight
        className={this.props.className}
        ref={this.scrollbarRef}
        onWheel={this.onWheel}
        renderThumbHorizontal={(props: any) => <div {...props} className="thumb-horizontal" />}>
        {this.props.children}
      </NativeScrollingView>
    );
  }
}
