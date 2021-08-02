import * as React from "react";
import styled, { css } from "styled-components";
import { CardContainer } from "src/card/_parts/cardContainer/CardContainer";
import { faSort } from "@fortawesome/free-solid-svg-icons";
import { Colors } from "src/_styling/colors";
import { darken, lighten } from "polished";
import { CardMapClickedModel } from "src/card/cardMapClicked/cardMapClickedModel";
import { Fonts } from "common/styling/fonts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { observer } from "mobx-react";
import { Flipped } from "react-flip-toolkit";
import { FlipperIds } from "common/config/flipperIds";
import { CardSharedTop } from "src/card/_parts/cardSharedTop/CardSharedTop";
import { CardShared } from "src/card/_utils/cardShared";

const CardMapClickedView = styled.div`
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const MoreDetailsButton = styled.div`
  &:hover {
    color: ${Colors.NAVY_7};
  }

  &:active {
    color: ${darken(0.1, Colors.NAVY_7)};
  }

  text-align: center;
  text-transform: uppercase;
  padding: 0.5em;
  margin-bottom: 0.5em;

  color: ${lighten(0.1, Colors.NAVY_7)};
  font-size: ${Fonts.FONT_SIZE_12};
  line-height: ${Fonts.FONT_SIZE_12};

  cursor: pointer;
  transition: 0.3s ease;

  & > .icon {
    margin-right: 0.5em;
  }
`;

export interface Props {
  model: CardMapClickedModel;
  showArrow: boolean;

  onClose: () => void;
  onMoreDetails?: () => void;

  className?: string;
}

const initialState = {};
type State = Readonly<typeof initialState>;

@observer
export class CardMapClicked extends React.Component<Props, State> {
  readonly state: State = initialState;

  render() {
    const model = this.props.model;

    return (
      <CardContainer model={model.cardContainerModel} showArrow={false} className={this.props.className}>
        <CardMapClickedView>
          <CardSharedTop model={model.cardSharedTop} onClose={this.props.onClose} />
          <Flipped flipId={FlipperIds.MARKER_MORE_DETAILS_BUTTON} onAppear={CardShared.delayedFadeIn}>
            <MoreDetailsButton onClick={this.props.onMoreDetails}>
              <FontAwesomeIcon className={"icon"} icon={faSort} />
              <span>More details</span>
            </MoreDetailsButton>
          </Flipped>
        </CardMapClickedView>
      </CardContainer>
    );
  }
}
