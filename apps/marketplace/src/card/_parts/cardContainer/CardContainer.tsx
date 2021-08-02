import * as React from "react";
import styled, { css } from "styled-components";
import { observer } from "mobx-react";
import { Flipped } from "react-flip-toolkit";
import { FlipperIds } from "common/config/flipperIds";
import { ErrorBoundary } from "common/components/ErrorBoundary";
import { CardShared } from "src/card/_utils/cardShared";
import { Colors } from "src/_styling/colors";
import darken from "polished/lib/color/darken";
import { CardContainerModel } from "src/card/_parts/cardContainer/cardContainerModel";
// @ts-ignore

const CardContainerView = styled.div`
  position: relative;
  border-radius: 3px;
  background-color: white;
  box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.2);

  width: 320px;
  max-height: 545px;
  padding-top: 1em;
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const ChildrenContainer = styled.div`
  flex: 1;
  min-height: 0;
`;

const CardToggleSelection = styled.div`
  ${(props: { color: string; backgroundColor: string }) => {
    return css`
      text-align: center;
      color: ${props.color};
      background-color: ${props.backgroundColor};
      padding: 1em 0;
      cursor: pointer;
      text-transform: uppercase;

      &:hover {
        background-color: ${darken(0.05, props.backgroundColor)};
      }

      &:active {
        background-color: ${darken(0.1, props.backgroundColor)};
      }
    `;
  }};
`;

const DownArrow = styled.div`
  ${(props: { backgroundColor?: string }) => css`
    width: 50px;
    height: 25px;
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    overflow: hidden;
    pointer-events: none;

    &::after {
      content: "";
      position: absolute;
      width: 10px;
      height: 10px;
      background: ${props.backgroundColor || "white"};
      transform: translateX(-50%) translateY(-50%) rotate(45deg);
      top: 0;
      left: 50%;
      box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.2);
    }
  `};
`;

interface Props {
  model: CardContainerModel;
  showArrow: boolean;

  className?: string;
}

const initialState = {};
type State = Readonly<typeof initialState>;

@observer
export class CardContainer extends React.Component<Props, State> {
  readonly state: State = initialState;

  addToSelectionActionProps = {
    color: Colors.WHITE,
    backgroundColor: Colors.BLUE_3,
    text: "Add to selection",
    onClick: () => this.props.model.addToSelection(),
  };

  removeFromSelectionActionProps = {
    color: Colors.NAVY_8,
    backgroundColor: Colors.GRAY_3,
    text: "Remove",
    onClick: () => this.props.model.removeFromSelection(),
  };

  render() {
    const { model } = this.props;
    const actionButtonProps = model.isSelected ? this.removeFromSelectionActionProps : this.addToSelectionActionProps;

    return (
      <CardContainerView className={this.props.className} {...this.props}>
        {this.props.showArrow ? <DownArrow backgroundColor={actionButtonProps.backgroundColor} /> : null}
        <ErrorBoundary>
          <Flipped inverseFlipId={FlipperIds.MAP_CARD}>
            <ContentContainer>
              <ChildrenContainer>{this.props.children}</ChildrenContainer>
              {(!model.isDrilldownOpen || !model.isSelected) && (
                <Flipped flipId={FlipperIds.MARKER_ACTION_BUTTON} onAppear={CardShared.delayedFadeIn}>
                  <CardToggleSelection
                    color={actionButtonProps.color}
                    backgroundColor={actionButtonProps.backgroundColor}
                    onClick={actionButtonProps.onClick}>
                    {actionButtonProps.text}
                  </CardToggleSelection>
                </Flipped>
              )}
            </ContentContainer>
          </Flipped>
        </ErrorBoundary>
      </CardContainerView>
    );
  }
}
