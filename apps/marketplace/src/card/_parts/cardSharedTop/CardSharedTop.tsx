import * as React from "react";
import styled from "styled-components";
import { observer } from "mobx-react";
import { CardSharedTopModel } from "src/card/_parts/cardSharedTop/cardSharedTopModel";
import { Flipped } from "react-flip-toolkit";
import { FlipperIds } from "common/config/flipperIds";
import { CloseButton } from "common/components/closeButton/CloseButton";
import { MarketplaceEntityHeader } from "src/_parts/marketplaceEntityHeader/marketplaceEntityHeader";
import { CardMetrics } from "src/card/_parts/cardMetrics/CardMetrics";
import { CardShared } from "src/card/_utils/cardShared";
import { EntityIcon } from "src/_parts/entityIcon/EntityIcon";
import { CardStyle } from "src/card/cardStyle";
import { LoadingSpinner } from "common/components/loadingSpinner/loadingSpinner/LoadingSpinner";

const CardSharedTopView = styled.div``;

const Toolbar = styled.div`
  display: flex;
  flex-direction: row-reverse;
  justify-content: space-between;
  padding: 0 ${CardStyle.HORIZONTAL_PADDING};
`;

const EntityIconStyled = styled(EntityIcon)`
  height: 20px;
  width: 30px;
`;

const CloseButtonStyled = styled(CloseButton)`
  width: 20px;
  height: 20px;
`;

const MarketplaceEntityHeaderStyled = styled(MarketplaceEntityHeader)``;

const MapCardMetricsStyled = styled(CardMetrics)`
  overflow: hidden;
`;

const LoadingSpinnerContainer = styled.div`
  display: flex;
  justify-content: center;
  padding: 1em 0;
`;

export interface Props {
  model: CardSharedTopModel;

  onClose: () => void;
  className?: string;
}
export type DefaultPropsKeys = never;

const initialState = {};

type State = Readonly<typeof initialState>;

@observer
export class CardSharedTop extends React.Component<Props, State> {
  static defaultProps: Pick<Props, DefaultPropsKeys> = {};
  readonly state: State = initialState;

  render() {
    const { model } = this.props;

    return (
      <CardSharedTopView className={this.props.className}>
        <Flipped flipId={FlipperIds.MARKER_TOOLBAR} onAppear={CardShared.delayedFadeIn}>
          <Toolbar>
            <CloseButtonStyled onClick={this.props.onClose} />
            {model.hasIcon && <EntityIconStyled model={model.entityIcon} />}
          </Toolbar>
        </Flipped>
        <Flipped flipId={FlipperIds.MARKER_CARD_HEADER}>
          <MarketplaceEntityHeaderStyled model={model.marketplaceEntityHeader} />
        </Flipped>
        <Flipped flipId={FlipperIds.MARKER_CARD_METRICS} onAppear={CardShared.delayedFadeIn}>
          {model.cardMetrics ? (
            <MapCardMetricsStyled metrics={model.cardMetrics} />
          ) : (
            <LoadingSpinnerContainer>
              <LoadingSpinner size={10} shakeAnimation={true} />
            </LoadingSpinnerContainer>
          )}
        </Flipped>
      </CardSharedTopView>
    );
  }
}
