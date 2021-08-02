import * as React from "react";
import styled, { css } from "styled-components";
import { observer } from "mobx-react";
import { MarketplaceOverviewModel } from "src/overview/marketplaceOverviewModel";
import { SelectionBar } from "src/overview/selectionBar/SelectionBar";
import { Flipped, Flipper } from "react-flip-toolkit";
import { fadeIn, fadeOut } from "common/styling/animations/animeAnimations";
import { FlipperIds } from "common/config/flipperIds";
import { CardMoreDetails } from "src/card/cardMoreDetails/CardMoreDetails";

const FlipperMarketplaceOverviewView = styled(Flipper as any)`
  display: flex;
  flex-direction: column;
  pointer-events: none;
`;

const MapCardContainer = styled.div`
  flex: 1;
  align-self: start;
  min-height: 0;
  padding: 1em;
`;

const CardMoreDetailsStyled = styled(CardMoreDetails)`
  height: 100%;
`;

const SelectionBarContainer = styled.div`
  margin-top: auto;
`;

const HiddenTableContainer = styled.div`
  height: 0px;
  background-color: white;
`;

export interface Props {
  model: MarketplaceOverviewModel;
  className?: string;
}

const initialState = {};

type State = Readonly<typeof initialState>;

@observer
export class MarketplaceOverview extends React.Component<Props, State> {
  static defaultProps = {};
  readonly state: State = initialState;

  render() {
    const model = this.props.model;
    const flipKey = `${!!model.activeMoreDetailsCard}_${model.selectionBar.selectionCards.length}`;

    return (
      <FlipperMarketplaceOverviewView flipKey={flipKey} className={this.props.className}>
        {model.activeMoreDetailsCard &&
          ((
            <Flipped flipId={FlipperIds.MORE_DETAILS_CARD} onAppear={fadeIn()} onExit={fadeOut()}>
              <MapCardContainer key={"moreDetailsCard"}>
                <CardMoreDetailsStyled
                  model={model.activeMoreDetailsCard}
                  onClose={model.closeMoredDetailsCard}
                  onEntityClick={model.changeMoredDetailsCard}
                />
              </MapCardContainer>
            </Flipped>
          ) as any)}
        {model.selectionBar.selectionCards.length > 0 &&
          ((
            <SelectionBarContainer key={"selectionBar"}>
              <Flipped flipId={FlipperIds.SELECTION_BAR_CONTAINER} onAppear={fadeIn()} onExit={fadeOut()} translate>
                <SelectionBar model={model.selectionBar} />
              </Flipped>
            </SelectionBarContainer>
          ) as any)}
        <Flipped flipId={FlipperIds.DRILL_DOWN_TABLE_CONTAINER}>
          <HiddenTableContainer />
        </Flipped>
      </FlipperMarketplaceOverviewView>
    );
  }
}
