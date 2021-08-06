import * as React from "react";
import styled, { css } from "styled-components";
import { observer } from "mobx-react";
import { Colors } from "../../../_styling/colors";
import { MarketplaceMetrics } from "../../../_domain/marketplaceMetrics";
import { Tooltip } from "@qwilt/common/components/Tooltip";
import { Description, DescriptionRow, Metric, Value } from "@qwilt/common/components/metrics/Metric";
import { Fonts } from "@qwilt/common/styling/fonts";

const TopBarMetricsView = styled.div`
  display: flex;
  flex-direction: row;
  margin: 1em 0;
`;

const MetricContainer = styled.div`
  text-align: center;
  &:first-child {
    margin-right: 3em;
  }
`;

const MetricsType = styled.div`
  ${(props: { isAvailable: boolean }) => css`
    font-size: 12px;
    margin-bottom: 1em;
    color: ${props.isAvailable ? Colors.MALIBU : "inherit"};
  `};
`;

const Metrics = styled.div`
  display: flex;
`;

const MetricStyled = styled(Metric)<{ availableMetric: boolean }>`
  &:first-child {
    margin-right: 1em;
  }
  color: ${(props) => (props.availableMetric ? Colors.MALIBU : Colors.WHITE)};

  ${Value} {
    font-size: ${Fonts.FONT_SIZE_22};
  }

  ${DescriptionRow} {
    margin-top: 4px;
  }

  ${Description} {
    font-size: ${Fonts.FONT_SIZE_10};
    color: ${(props) => (props.availableMetric ? Colors.STEEL_BLUE : Colors.SILVER_SAND)};
  }
`;

const TooltipSpn = styled.span`
  padding: 0.2rem 0.4rem;
  &:focus {
    outline: none;
  }
`;
const TooltipSpnStyled = styled(TooltipSpn)`
  font-size: 10px;
  text-transform: uppercase;
  font-weight: bold;
`;

export interface Props {
  metrics: MarketplaceMetrics;
  className?: string;
}

const initialState = {};

type State = Readonly<typeof initialState>;

@observer
export class TopBarMetrics extends React.Component<Props, State> {
  static defaultProps = {};
  readonly state: State = initialState;

  render() {
    return (
      <TopBarMetricsView className={this.props.className}>
        <MetricContainer>
          <MetricsType isAvailable={true}>AVAILABILITY</MetricsType>
          <Metrics>
            <MetricStyled
              availableMetric={true}
              description={"BANDWIDTH"}
              value={this.props.metrics.bandwidthFormatted.getPretty()}
              units={this.props.metrics.bandwidthFormatted.unit}
            />
            <MetricStyled
              availableMetric={true}
              description={"TPS"}
              value={this.props.metrics.tpsFormatted.getPretty()}
              units={this.props.metrics.tpsFormatted.unit}
            />
          </Metrics>
        </MetricContainer>
        <MetricContainer>
          <MetricsType isAvailable={false}>QUALITY</MetricsType>
          <Metrics>
            <MetricStyled
              availableMetric={false}
              description={"BITRATE"}
              value={this.props.metrics.avgBitrateFormatted.getPretty()}
              units={this.props.metrics.avgBitrateFormatted.unit}
            />
            <Tooltip
              maxWidth={450}
              placement={"bottom"}
              content={
                <TooltipSpnStyled>
                  The service covers {this.props.metrics.coverageFormatted} of the selected ISP’s total internet
                  subscribers
                </TooltipSpnStyled>
              }>
              <MetricStyled
                availableMetric={false}
                description={"COVERAGE"}
                value={this.props.metrics.coverageFormatted}
                units={""}
              />
            </Tooltip>
          </Metrics>
        </MetricContainer>
      </TopBarMetricsView>
    );
  }
}
