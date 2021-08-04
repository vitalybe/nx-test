import * as React from "react";
import styled from "styled-components";
import * as _ from "lodash";
import { Options } from "highcharts";
import { Fonts } from "@qwilt/common/styling/fonts";
import { Colors } from "../../../../_styling/colors";
import { UnitKindEnum, UnitNameEnum, unitsFormatter } from "@qwilt/common/utils/unitsFormatter";
import { observer } from "mobx-react";
import { LoadingSpinner } from "@qwilt/common/components/loadingSpinner/loadingSpinner/LoadingSpinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons/faExclamationTriangle";
import { Snippets } from "@qwilt/common/utils/snippets";
import { ReactHighchartWrapper } from "@qwilt/common/components/qwiltChart/reactHighchartWrapper/ReactHighchartWrapper";

const GRID_LINES_COLOR = "#EDEDED";

const CardHistogramView = styled.div`
  overflow: hidden;

  height: 425px;
  width: 100%;
  border-top: 1px solid ${GRID_LINES_COLOR};
`;

const FallbackContainer = styled.div`
  position: relative;
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ErrorView = styled.div`
  display: flex;
  align-items: center;
  color: ${Colors.NAVY_2};
  opacity: 0.5;
  font-size: 1rem;
`;
const ErrorMessage = styled.span`
  margin-left: 6px;
`;
const LoadingSpinnerStyled = styled(LoadingSpinner)``;

export interface Props {
  qoeValues: number[] | undefined;
  hasError: boolean;

  errorMessage?: string;
  className?: string;
}

const initialState = {};

type State = Readonly<typeof initialState>;

@observer
export class CardHistogram extends React.Component<Props, State> {
  static defaultProps = {};
  readonly state: State = initialState;

  axisLabelsColor = Colors.NAVY_1;
  axisLabelsOpacity = 0.4;

  createHighchartConfig(values: number[], unit: UnitNameEnum): Options {
    return {
      title: {
        text: "LAST 30 DAYS BITRATE",
        floating: true,
        align: "center",
        y: 15,
        style: {
          fontSize: Fonts.FONT_SIZE_12,
        },
      },
      chart: {
        type: "area",
        margin: [0, 0, 0, -5],
        style: {
          fontFamily: Fonts.FONT_FAMILY,
          fontSize: "10px",
          fontWeight: "bold",
        },
      },
      legend: {
        enabled: false,
      },
      credits: {
        enabled: false,
      },
      plotOptions: {
        series: {
          lineWidth: 0,
          color: "rgba(44, 255, 208, 0.8)",
          marker: {
            enabled: false,
            states: {
              hover: {
                enabled: false,
              },
            },
          },
        },
      },
      xAxis: {
        gridLineColor: GRID_LINES_COLOR,
        gridLineWidth: 1,
        alternateGridColor: "#fdfdfd",
        labels: {
          enabled: false,
        },
        tickLength: 0,
        maxPadding: 0,
      },
      yAxis: {
        gridLineColor: GRID_LINES_COLOR,
        gridLineWidth: 1,
        showLastLabel: false,
        showFirstLabel: false,
        maxPadding: 0.08,
        labels: {
          align: "left",
          x: 10,
          y: -3,
          style: {
            color: this.axisLabelsColor,
            opacity: this.axisLabelsOpacity,
          },
          formatter: function () {
            return unitsFormatter.convert(this.value, unit).getRounded(2).toString();
          },
        },
        title: {
          text: unit.toUpperCase(),
          x: 10,
          y: 20,
          align: "high",
          textAlign: "left",
          rotation: 0,
          reserveSpace: false,
          style: {
            color: this.axisLabelsColor,
            opacity: this.axisLabelsOpacity,
          },
        },
      },
      series: [
        {
          data: values,
        },
      ],
      tooltip: {
        enabled: false,
      },
    };
  }

  render() {
    let chartConfig: Options | undefined;
    if (this.props.qoeValues !== undefined) {
      const unit = unitsFormatter.format(_.max(this.props.qoeValues)!, UnitKindEnum.TRAFFIC).unit;
      chartConfig = this.createHighchartConfig(this.props.qoeValues, unit);
    }

    return (
      <CardHistogramView className={this.props.className}>
        {chartConfig ? (
          <ReactHighchartWrapper chartConfig={chartConfig} />
        ) : (
          <FallbackContainer>
            {this.props.hasError ? (
              <ErrorView>
                <FontAwesomeIcon icon={faExclamationTriangle} />
                <ErrorMessage>{this.props.errorMessage || Snippets.FETCH_DATA_FAIL}</ErrorMessage>
              </ErrorView>
            ) : (
              <LoadingSpinnerStyled shakeAnimation={true} size={15} />
            )}
          </FallbackContainer>
        )}
      </CardHistogramView>
    );
  }
}
