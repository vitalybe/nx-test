import * as React from "react";
import styled from "styled-components";
import { observer } from "mobx-react";
import { MetricTypesEnum } from "../../../_domain/metricTypes";
import { ToggleButton } from "../../_parts/ToggleButton";

const MetricSelectorView = styled.div`
  display: flex;
  align-items: center;
  flex: 1 1 0;
`;

const ToggleButtonStyled = styled(ToggleButton)``;

export interface Props {
  className?: string;
  selectedMetric: MetricTypesEnum;
  selectCallback: (type: MetricTypesEnum) => void;
}

const initialState = {};

type State = Readonly<typeof initialState>;

@observer
export class DrilldownLegendMetricSelector extends React.Component<Props, State> {
  static defaultProps = {};
  readonly state: State = initialState;
  render() {
    return (
      <MetricSelectorView className={this.props.className}>
        <ToggleButtonStyled
          isSelected={this.props.selectedMetric === MetricTypesEnum.AVAILABLE_BW}
          onClick={() => this.props.selectCallback(MetricTypesEnum.AVAILABLE_BW)}>
          Available BW
        </ToggleButtonStyled>
        <ToggleButtonStyled
          isSelected={this.props.selectedMetric === MetricTypesEnum.AVAILABLE_TPS}
          onClick={() => this.props.selectCallback(MetricTypesEnum.AVAILABLE_TPS)}>
          Available TPS
        </ToggleButtonStyled>
        <ToggleButtonStyled
          isSelected={this.props.selectedMetric === MetricTypesEnum.BITRATE}
          onClick={() => this.props.selectCallback(MetricTypesEnum.BITRATE)}>
          Bitrate
        </ToggleButtonStyled>
      </MetricSelectorView>
    );
  }
}
