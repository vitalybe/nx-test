import * as React from "react";
import { SyntheticEvent } from "react";
import styled, { css } from "styled-components";
import { observer } from "mobx-react";
import { DrillDownModel } from "./drillDownModel";
import { DrillDownTable } from "./table/DrillDownTable";
import { Flipped } from "react-flip-toolkit";
import { fadeIn, fadeOut } from "@qwilt/common/styling/animations/animeAnimations";
import { DrillDownLegend } from "./legend/DrillDownLegend";
import { DrillDownChart } from "./chart/DrillDownChart";
import { Colors } from "../_styling/colors";
import { transparentize } from "polished";
import { RoundImageButton } from "../_parts/roundImageButton/RoundImageButton";
import { FlipperIds } from "@qwilt/common/config/flipperIds";
import { CardMoreDetails } from "../card/cardMoreDetails/CardMoreDetails";

const DrillDownView = styled.div`
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: ${transparentize(0.6, Colors.NAVY_3)};
`;

const Content = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const HideDrillDownButton = styled(RoundImageButton)`
  ${(props: {}) => {
    const size = RoundImageButton.size;
    return css`
      position: absolute;
      top: -${size / 3}px;
      right: ${size / 2}px;
    `;
  }};
`;

const BelowLegendContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const Filler = styled.div`
  background-color: white;
  flex: 1;
`;

const ClickDetector = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.3);
  cursor: pointer;
`;

const MapCardContainer = styled.div`
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translateX(-50%) translateY(-50%);
  height: 500px;
`;

const CardMoreDetailsStyled = styled(CardMoreDetails)``;

export interface Props {
  model: DrillDownModel;

  className?: string;
}

const initialState: { openModal: boolean; itemName: string } = {
  openModal: false,
  itemName: "",
};

type State = Readonly<typeof initialState>;

@observer
export class DrillDown extends React.Component<Props, State> {
  static defaultProps = {};
  readonly state: State = initialState;

  render() {
    const model = this.props.model;
    return (
      <Flipped flipId={FlipperIds.SELECTION_BAR_CONTAINER} translate>
        <DrillDownView className={this.props.className}>
          <Content>
            <DrillDownLegend model={this.props.model.legend} />
            <Flipped
              flipId={FlipperIds.BELOW_LEGEND_CONTENT}
              onAppear={fadeIn({ delay: 700, targets: null })}
              onExit={fadeOut()}>
              <BelowLegendContent>
                <DrillDownChart model={this.props.model.chart} />
                <DrillDownTable model={model.table} />
                <Filler />
              </BelowLegendContent>
            </Flipped>
            {model.moreDetailsCard && (
              <ClickDetector onClick={model.removeCard}>
                <MapCardContainer onClick={(e: SyntheticEvent) => e.stopPropagation()}>
                  <CardMoreDetailsStyled
                    model={model.moreDetailsCard}
                    onClose={() => {
                      this.setState({ openModal: false, itemName: "wefgweg" });
                      model.removeCard();
                    }}
                    onEntityClick={model.changeCard}
                  />
                </MapCardContainer>
              </ClickDetector>
            )}
          </Content>
          {model.isDrilldownActive && (
            <HideDrillDownButton
              imagePath={require("@qwilt/common/images/map.svg")}
              onClick={this.props.model.hideDrilldown}
            />
          )}
        </DrillDownView>
      </Flipped>
    );
  }
}
