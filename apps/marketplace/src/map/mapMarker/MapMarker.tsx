import * as React from "react";
import styled, { css } from "styled-components";
import { MapMarkerBubble } from "src/map/_parts/mapMarkerBubble/MapMarkerBubble";
import { CardMapHover } from "src/card/cardMapHover/CardMapHover";
import { CardMapClicked } from "src/card/cardMapClicked/cardMapClicked";
import { ErrorBoundary } from "common/components/ErrorBoundary";
import { observer } from "mobx-react";
import { MapMarkerModel } from "src/map/mapMarker/mapMarkerModel";
import { Flipped, Flipper } from "react-flip-toolkit";
import { fadeIn, fadeOut, flyOutLeft } from "common/styling/animations/animeAnimations";
import { FlipperIds } from "common/config/flipperIds";
import { Colors } from "src/_styling/colors";

// NOTE: Google Maps overrides fonts which requires us to reset them here
const MapMarkerStyled = styled.div`
  display: inline-block;
  position: relative;
`;

const CardContainer = styled.div`
  position: absolute;
  bottom: 100%;
  transform: translateX(-50%) translateY(-10px);
`;

const CardMapHoverStyled = styled(CardMapHover)``;

const CardMapClickedStyled = styled(CardMapClicked)``;

export interface Props {
  model: MapMarkerModel;
  currentZoom: number;
  // NOTE: These props are used by the parent map container, not by the actual component
  lat?: number;
  lng?: number;
}

const initialState = { moreDetailsClicked: false };

type State = Readonly<typeof initialState>;

@observer
export class MapMarker extends React.Component<Props, State> {
  readonly state: State = initialState;
  hideHoverCardTimeout: any;

  showActiveCard = () => {
    this.props.model.changeIsHoverCardActive(false);
    this.props.model.changeIsClickedCardActive(true);
  };

  hideActiveCard = () => {
    this.props.model.changeIsClickedCardActive(false);
  };

  showMoreDetails = () => {
    this.setState({ moreDetailsClicked: true }, () => {
      this.props.model.changeIsClickedCardActive(false);
      this.props.model.showMoreDetails();
    });
  };

  render() {
    const model = this.props.model;
    const isHoverCardActive = model.isHoverCardActive;
    const isClickedCardActive = model.isClickedCardActive;

    const flipKey = `hover: ${isHoverCardActive} clicked: ${isClickedCardActive}`;
    const flipIdMapCardContainer = FlipperIds.MAP_CARD_CONTAINER + model.id;
    const flipIdMapCard = FlipperIds.MAP_CARD + model.id;

    return (
      <MapMarkerStyled
        data-lng={model.location.lng}
        data-lat={model.location.lat}
        data-isp={model.marketplaceEntity.name}
        data-geo={model.geoParent.name}>
        <ErrorBoundary hidden={true}>
          <Flipper flipKey={flipKey} spring={"stiff"}>
            <MapMarkerBubble
              id={model.id}
              color={Colors.SPRAY}
              currentZoom={this.props.currentZoom}
              isHighlighted={model.isHighlighted}
              isEnlarged={false}
              enableAnimation={true}
              onMouseOver={() => model.changeIsHoverCardActive(true)}
              onMouseLeave={() => model.changeIsHoverCardActive(false)}
              onClick={this.showActiveCard}
            />

            {isHoverCardActive && (
              <Flipped flipId={flipIdMapCardContainer} onAppear={fadeIn()} onExit={fadeOut()} opacity>
                <CardContainer>
                  {/*NOTE: 2 flipped are needed due to some issue with transform -50%*/}
                  <Flipped flipId={flipIdMapCard}>
                    <CardMapHoverStyled model={model.cardHover} onClick={this.showActiveCard} />
                  </Flipped>
                </CardContainer>
              </Flipped>
            )}

            {isClickedCardActive &&
              ((
                <Flipped
                  flipId={flipIdMapCardContainer}
                  onAppear={fadeIn()}
                  onExit={this.state.moreDetailsClicked ? flyOutLeft({ duration: 1000, targets: null }) : fadeOut()}
                  opacity>
                  <CardContainer>
                    <Flipped flipId={flipIdMapCard}>
                      <CardMapClickedStyled
                        showArrow={true}
                        model={model.card}
                        onClose={this.hideActiveCard}
                        onMoreDetails={this.showMoreDetails}
                      />
                    </Flipped>
                  </CardContainer>
                </Flipped>
              ) as any)}
          </Flipper>
        </ErrorBoundary>
      </MapMarkerStyled>
    );
  }
}
