import * as React from "react";
import styled from "styled-components";
import { observer } from "mobx-react";
import { UnitsFormatterResult } from "common/utils/unitsFormatter";
import { LoadingSpinner } from "common/components/loadingSpinner/loadingSpinner/LoadingSpinner";
import { Colors } from "src/_styling/colors";
import { Metric, Unit } from "common/components/metrics/Metric";
import { Fonts } from "common/styling/fonts";

const DrillDownLoadingCellView = styled.div``;

const MetricStyled = styled(Metric)<{
  availableMetric: boolean;
}>`
  display: inline-block;
  color: ${(props) => (props.availableMetric ? Colors.BLUE_3 : Colors.NAVY_3)};

  ${Unit} {
    font-size: ${Fonts.FONT_SIZE_12};
  }
`;

const LoadingSpinnerStyled = styled(LoadingSpinner)`
  display: inline-block;
`;

export interface Props {
  displayedValue: UnitsFormatterResult | undefined;
  isAvailable: boolean;

  className?: string;
}
export type DefaultPropsKeys = never;

const initialState = {};

type State = Readonly<typeof initialState>;

@observer
export class DrillDownTableLoadingCell extends React.Component<Props, State> {
  static defaultProps: Pick<Props, DefaultPropsKeys> = {};
  readonly state: State = initialState;

  render() {
    const { displayedValue, isAvailable } = this.props;

    return (
      <DrillDownLoadingCellView className={this.props.className}>
        {displayedValue ? (
          <MetricStyled
            value={displayedValue.getPretty()}
            units={displayedValue.unit}
            availableMetric={isAvailable}
            description={""}
          />
        ) : (
          <LoadingSpinnerStyled shakeAnimation={false} size={10} />
        )}
      </DrillDownLoadingCellView>
    );
  }
}
