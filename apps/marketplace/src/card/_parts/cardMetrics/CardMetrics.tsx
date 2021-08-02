import * as React from "react";
import styled from "styled-components";
import { MarketplaceMetrics } from "../../../_domain/marketplaceMetrics";
import { observer } from "mobx-react";
import { CardStyle } from "../../cardStyle";
import { Colors } from "../../../_styling/colors";
import { Description, Metric, Unit, Value } from "@qwilt/common/components/metrics/Metric";
import { Fonts } from "@qwilt/common/styling/fonts";

const MapCardMetricsView = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 0 ${CardStyle.HORIZONTAL_PADDING};
`;

const MetricStyled = styled(Metric)<{
  availableMetric: boolean;
}>`
  margin: 1em 0;
  color: ${(props) => (props.availableMetric ? Colors.BLUE_3 : Colors.NAVY_3)};

  ${Value} {
    font-size: ${Fonts.FONT_SIZE_16};
  }

  ${Unit} {
    font-size: ${Fonts.FONT_SIZE_12};
  }

  ${Description} {
    font-size: ${Fonts.FONT_SIZE_10};
    opacity: 0.7;
    margin-top: 4px;
  }
`;

export interface Props {
  metrics: MarketplaceMetrics;

  className?: string;
}

const initialState = {};

type State = Readonly<typeof initialState>;

@observer
export class CardMetrics extends React.Component<Props, State> {
  static defaultProps = {};
  readonly state: State = initialState;

  render() {
    const metrics = this.props.metrics;
    return (
      <MapCardMetricsView className={this.props.className} {...this.props}>
        <MetricStyled
          availableMetric={true}
          description={"Bandwidth".toUpperCase()}
          value={metrics.bandwidthFormatted.getPretty()}
          units={metrics.bandwidthFormatted.unit}
        />
        <MetricStyled
          availableMetric={true}
          description={"TPS".toUpperCase()}
          value={metrics.tpsFormatted.getPretty()}
          units={metrics.tpsFormatted.unit}
        />
        <MetricStyled
          availableMetric={false}
          description={"Avg. Bitrate".toUpperCase()}
          value={metrics.avgBitrateFormatted.getPretty()}
          units={metrics.avgBitrateFormatted.unit}
        />
        <MetricStyled
          availableMetric={false}
          description={"Coverage".toUpperCase()}
          value={metrics.coverageFormatted}
          units={""}
        />
      </MapCardMetricsView>
    );
  }
}
