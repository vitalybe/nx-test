import * as React from "react";
import styled from "styled-components";

import { Map } from "src/map/Map";
import { MarketplaceModel } from "./marketplaceModel";
import { observer } from "mobx-react";
import { TopBar } from "src/topBar/TopBar";
import { MarketplaceOverview } from "src/overview/MarketplaceOverview";
import { DrillDown } from "src/drillDown/DrillDown";
import { Flipper } from "react-flip-toolkit";
import { ErrorBoundary } from "common/components/ErrorBoundary";
import { LoadingSpinner } from "common/components/loadingSpinner/loadingSpinner/LoadingSpinner";

const MarketplaceView = styled.div`
  height: 100%;
  width: 100%;
  position: relative;
`;

const TopBarStyled = styled(TopBar)`
  pointer-events: initial;
`;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const FlipperMapOverlay = styled(Flipper as any)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  display: flex;
  flex-direction: column;
  pointer-events: none;
`;

const MarketplaceOverviewStyled = styled(MarketplaceOverview)`
  flex: 1;
  pointer-events: none;
  & > * {
    pointer-events: initial;
  }
`;

const DrillDownStyled = styled(DrillDown)`
  min-height: 0;
  flex: 1;
  pointer-events: initial;
  // below needed to show drilldown button beyond i
  overflow: visible;
  z-index: 1;
`;

const LoadingSpinnerContainer = styled.div`
  position: relative;
  height: 100%;
  width: 100%;

  display: flex;
  justify-content: center;
  align-items: center;
`;

export interface Props {
  model: MarketplaceModel;
  className?: string;
}

const initialState = {};

type State = Readonly<typeof initialState>;

@observer
export class Marketplace extends React.Component<Props, State> {
  static defaultProps = {};
  readonly state: State = initialState;

  constructor(props: Props) {
    super(props);
  }

  render() {
    const model = this.props.model;

    return !model.isLoading ? (
      <MarketplaceView className={this.props.className}>
        <ErrorBoundary>
          <Map model={model.map} />
          <FlipperMapOverlay flipKey={String(model.isDrillDown)}>
            <TopBarStyled model={model.topbar} />
            {model.isDrillDown === false ? (
              <MarketplaceOverviewStyled model={model.marketplaceOverview} />
            ) : (
              <DrillDownStyled model={model.marketplaceDrillDown} />
            )}
          </FlipperMapOverlay>
        </ErrorBoundary>
      </MarketplaceView>
    ) : (
      <LoadingSpinnerContainer>
        <LoadingSpinner />
      </LoadingSpinnerContainer>
    );
  }
}

export class MarketplaceFlipperIds {
  static readonly DRILLDOWN_BUTTON = "DRILLDOWN_BUTTON";
}
