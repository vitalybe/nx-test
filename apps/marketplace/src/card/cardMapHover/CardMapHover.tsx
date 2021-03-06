import * as React from "react";
import styled from "styled-components";
import { MarketplaceEntityHeader } from "../../_parts/marketplaceEntityHeader/marketplaceEntityHeader";
import { observer } from "mobx-react";
import { Flipped } from "react-flip-toolkit";
import { FlipperIds } from "@qwilt/common/config/flipperIds";
import { CardMapHoverModel } from "./cardMapHoverModel";

const CardMapHoverView = styled.div`
  position: relative;
  border-radius: 3px;
  background-color: white;
  box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.2);
  min-width: 200px;
  max-width: 300px;

  cursor: pointer;
  padding: 1em;
`;

export interface Props {
  model: CardMapHoverModel;

  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;

  className?: string;
}

const initialState = {};
type State = Readonly<typeof initialState>;

@observer
export class CardMapHover extends React.Component<Props, State> {
  readonly state: State = initialState;

  render() {
    return (
      <CardMapHoverView
        onClick={this.props.onClick}
        onMouseEnter={this.props.onMouseEnter}
        onMouseLeave={this.props.onMouseLeave}
        className={this.props.className}>
        <Flipped flipId={FlipperIds.MARKER_CARD_HEADER}>
          <MarketplaceEntityHeader model={this.props.model.marketplaceEntityHeader} />
        </Flipped>
      </CardMapHoverView>
    );
  }
}
