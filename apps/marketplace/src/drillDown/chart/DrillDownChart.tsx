import * as React from "react";
import { RefObject } from "react";
import styled, { css } from "styled-components";
import { observer } from "mobx-react";
import { DrillDownChartModel } from "./drillDownChartModel";
import { LoadingSpinner } from "@qwilt/common/components/loadingSpinner/loadingSpinner/LoadingSpinner";
import { ToggleButton } from "../_parts/ToggleButton";
import { Fonts } from "@qwilt/common/styling/fonts";
import { Colors } from "../../_styling/colors";
import { ReactHighchartWrapper } from "@qwilt/common/components/qwiltChart/reactHighchartWrapper/ReactHighchartWrapper";

const DrillDownChartView = styled.div`
  height: 300px;
  position: relative;
  background-color: white;

  .highcharts-tick {
    display: none;
  }
`;

const LoadingSpinnerStyled = styled(LoadingSpinner)`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
`;

const ChartContainer = styled.div`
  height: 100%;
  width: 100%;
`;

const ButtonsBar = styled.div`
  position: absolute;
  top: 5px;
  left: 5em;
  font-weight: bold;
`;

const DurationButton = styled(ToggleButton)`
  ${(props: { isSelected: boolean }) => css`
    font-size: ${Fonts.FONT_SIZE_10};
    color: ${Colors.CASAL};
    background-color: ${props.isSelected ? Colors.PATTENS_BLUE : "transparent"};
    outline: none;
  `};
`;

export interface Props {
  model: DrillDownChartModel;

  className?: string;
}

const initialState = {};

type State = Readonly<typeof initialState>;

@observer
export class DrillDownChart extends React.Component<Props, State> {
  view: RefObject<HTMLDivElement> = React.createRef();

  static defaultProps = {};

  readonly state: State = initialState;

  componentDidMount() {
    this.props.model.init();
  }

  componentWillUnmount() {
    this.props.model.cleanUp();
  }

  setDataTimeSpan(span: "day" | "month") {
    this.props.model.marketplaceDrillDown.dataTimeSpan = span;
  }

  getIsSelected(span: "day" | "month") {
    return this.props.model.marketplaceDrillDown.dataTimeSpan === span;
  }

  render() {
    const { model } = this.props;

    return (
      <DrillDownChartView className={this.props.className} ref={this.view} {...this.props}>
        {model.isLoading ? (
          <LoadingSpinnerStyled />
        ) : (
          <ChartContainer>
            <ReactHighchartWrapper
              chartReadyCallback={this.props.model.chartIsReady}
              drawAdditionsCallback={this.props.model.drawAdditions}
              chartConfig={model.options}
            />
            <ButtonsBar>
              <DurationButton onClick={() => this.setDataTimeSpan("month")} isSelected={this.getIsSelected("month")}>
                last 30 days
              </DurationButton>
              <DurationButton onClick={() => this.setDataTimeSpan("day")} isSelected={this.getIsSelected("day")}>
                last 24 hours
              </DurationButton>
            </ButtonsBar>
          </ChartContainer>
        )}
      </DrillDownChartView>
    );
  }
}
