import * as React from "react";
import styled, { css } from "styled-components";
import { observer } from "mobx-react";
import { SelectionBarCard } from "src/overview/selectionBar/selectionCard/SelectionBarCard";
import { Colors } from "src/_styling/colors";
import { lighten, transparentize } from "polished";
import { Fonts } from "common/styling/fonts";
import { SelectionBarModel } from "src/overview/selectionBar/selectionBarModel";
import { RoundImageButton } from "src/_parts/roundImageButton/RoundImageButton";
import { Flipped } from "react-flip-toolkit";
import { FlipperIds } from "common/config/flipperIds";
import { NativeScrolling } from "src/_parts/NativeScrolling";

const SelectionBarView = styled.div`
  background-color: ${transparentize(0.6, Colors.NAVY_3)};
  padding: 0 24px 0.5em;
  position: relative;
`;

const TopSection = styled.div`
  display: flex;
  padding: 0.7em 0;
  color: ${Colors.GRAY_1};
  font-size: ${Fonts.FONT_SIZE_12};
`;

const SelectionText = styled.div`
  text-transform: uppercase;
`;

const ClearAction = styled.div`
  margin-left: 0.5em;
  cursor: pointer;
  transition: 0.2s ease;
  color: ${transparentize(0.5, Colors.GRAY_1)};
  &:hover {
    color: ${Colors.GRAY_1};
  }

  &:active {
    color: ${lighten(0.2, Colors.GRAY_1)};
  }
`;

const Container = styled.div`
  display: flex;
  margin-bottom: ${Fonts.FONT_SIZE_12};
`;

const SelectionCardStyled = styled(SelectionBarCard)`
  margin-right: 1em;
  flex-shrink: 0;
`;

const DrillDownButton = styled(RoundImageButton)`
  ${(props: {}) => {
    const size = RoundImageButton.size;
    return css`
      position: absolute;
      top: -${size / 3 + 8}px;
      right: ${size / 2}px;
    `;
  }};
`;

export interface Props {
  model: SelectionBarModel;

  className?: string;
}

const initialState = {};

type State = Readonly<typeof initialState>;

@observer
export class SelectionBar extends React.Component<Props, State> {
  static defaultProps = {};
  readonly state: State = initialState;

  onCardClose = (id: string) => {
    this.props.model.cardClose(id);
  };

  onClearAllCards = () => {
    this.props.model.cardCloseAll();
  };

  render() {
    const model = this.props.model;
    const selectionCards = model.selectionCards;
    const cardsCount = selectionCards.length;

    return (
      <SelectionBarView className={this.props.className} {...this.props}>
        <TopSection>
          <React.Fragment>
            <SelectionText>
              {cardsCount} selection
              {cardsCount > 1 ? "s" : ""}
            </SelectionText>
            <ClearAction onClick={this.onClearAllCards}>clear all</ClearAction>
          </React.Fragment>
        </TopSection>
        <NativeScrolling axis={"x"}>
          <Flipped flipId={FlipperIds.SELECTION_BAR} translate>
            <Container>
              {selectionCards.map((selectionCard) => (
                <SelectionCardStyled key={selectionCard.id} model={selectionCard} onClose={this.onCardClose} />
              ))}
            </Container>
          </Flipped>
        </NativeScrolling>
        <DrillDownButton imagePath={require("src/_images/chart.svg")} onClick={model.showDrilldown} />
      </SelectionBarView>
    );
  }
}
