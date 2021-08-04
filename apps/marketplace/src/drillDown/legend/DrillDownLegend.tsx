import * as React from "react";
import { RefObject } from "react";
import styled from "styled-components";
import { observer } from "mobx-react";
import { Colors } from "src/_styling/colors";
import { Fonts } from "common/styling/fonts";
import { DrillDownLegendCard } from "src/drillDown/legend/card/DrillDownLegendCard";
import { DrillDownLegendModel } from "src/drillDown/legend/drillDownLegendModel";
import { DrilldownLegendMetricSelector } from "src/drillDown/legend/metricSelector/DrilldownLegendMetricSelector";
import { Flipped } from "react-flip-toolkit";
import { FlipperIds } from "common/config/flipperIds";
import Scrollbars from "react-custom-scrollbars";
import { NativeScrolling } from "src/_parts/NativeScrolling";

const LegendView = styled.div`
  padding: 0 15px 0.6em;
`;

const TopSection = styled.div`
  display: flex;
  justify-content: flex-start;
  padding: 0.7em 0;
  color: ${Colors.GRAY_1};
  font-size: ${Fonts.FONT_SIZE_12};
`;

const Container = styled.div`
  display: flex;
  margin: 0 auto ${Fonts.FONT_SIZE_12};
  align-items: flex-end;
  height: 70px;
`;
const CurrentDate = styled.div`
  text-transform: uppercase;
  width: calc(100% / 3);
  text-align: center;
  flex: 1 0 0;
  padding-top: 5px;
  min-width: 85px;
  font-weight: bold;
`;
const WhiteSpace = styled.div`
  width: calc(100% / 3);
  flex: 1 1 0;
`;
export interface Props {
  model: DrillDownLegendModel;
}

const initialState = {};

type State = Readonly<typeof initialState>;
@observer
export class DrillDownLegend extends React.Component<Props, State> {
  scrollerRef: RefObject<Scrollbars> = React.createRef();

  getScrollerRef = (scroller: RefObject<Scrollbars>) => {
    this.scrollerRef = scroller;
  };

  static defaultProps = {};

  readonly state: State = initialState;

  render() {
    const { cards, date, metricType, setMetricType } = this.props.model;
    return (
      <Flipped flipId={FlipperIds.SELECTION_BAR} translate>
        <LegendView>
          <TopSection>
            <DrilldownLegendMetricSelector selectedMetric={metricType} selectCallback={setMetricType} />
            <CurrentDate>
              <span>{date}</span>
            </CurrentDate>
            <WhiteSpace />
          </TopSection>
          <NativeScrolling getRef={this.getScrollerRef} axis={"x"}>
            <Container>
              {cards.map((card) => (
                <DrillDownLegendCard key={card.id} model={card} sideScroller={this.scrollerRef} />
              ))}
            </Container>
          </NativeScrolling>
        </LegendView>
      </Flipped>
    );
  }
}
