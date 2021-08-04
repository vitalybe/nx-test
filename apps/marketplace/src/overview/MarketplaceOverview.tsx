import * as React from "react";
import styled from "styled-components";
import { observer } from "mobx-react";
import { MarketplaceOverviewModel } from "./marketplaceOverviewModel";
import { SelectionBar } from "./selectionBar/SelectionBar";
import { Flipped, Flipper } from "react-flip-toolkit";
import { fadeIn, fadeOut } from "@qwilt/common/styling/animations/animeAnimations";
import { FlipperIds } from "@qwilt/common/config/flipperIds";
import { CardMoreDetails } from "../card/cardMoreDetails/CardMoreDetails";

const FlipperMarketplaceOverviewView = styled(Flipper)`
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
          ) as unknown)}
        {model.selectionBar.selectionCards.length > 0 &&
          ((
            <SelectionBarContainer key={"selectionBar"}>
              <Flipped flipId={FlipperIds.SELECTION_BAR_CONTAINER} onAppear={fadeIn()} onExit={fadeOut()} translate>
                <SelectionBar model={model.selectionBar} />
              </Flipped>
            </SelectionBarContainer>
          ) as unknown)}
        <Flipped flipId={FlipperIds.DRILL_DOWN_TABLE_CONTAINER}>
          <HiddenTableContainer />
        </Flipped>
      </FlipperMarketplaceOverviewView>
    );
  }
}
