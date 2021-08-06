import * as React from "react";
import { SyntheticEvent } from "react";
import styled, { css } from "styled-components";
import { observer } from "mobx-react";
import { transparentize } from "polished";
import { MarketplaceEntityHeader } from "../../../_parts/marketplaceEntityHeader/marketplaceEntityHeader";
import { SelectionBarCardModel } from "./selectionBarCardModel";
// @ts-ignore
import { Colors } from "../../../_styling/colors";
import { CloseButton } from "@qwilt/common/components/closeButton/CloseButton";
import { LoadingSpinner } from "@qwilt/common/components/loadingSpinner/loadingSpinner/LoadingSpinner";
import { Metric, Unit, Value } from "@qwilt/common/components/metrics/Metric";
import { Fonts } from "@qwilt/common/styling/fonts";

const CloseButtonStyled = styled(CloseButton)`
  position: absolute;
  right: 0.7em;
  top: 0.5em;
  opacity: 0;

  width: 10px;
`;

const SelectionCardView = styled.div`
  display: flex;
  flex-direction: column;

  width: 166px;
  height: 166px;

  background-color: ${Colors.GRAY_2};
  border-radius: 6px;
  cursor: pointer;

  &:hover {
    ${CloseButtonStyled} {
      opacity: 1;
    }
  }
`;

const Header = styled.div`
  position: relative;
`;

const MarketplaceEntityHeaderStyled = styled(MarketplaceEntityHeader)`
  background-color: #ffffff;
  height: 71px;
  display: flex;
  flex-direction: column;
  justify-content: center;

  border-radius: 6px;
  padding: 1em;
`;

const Rows = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  margin: 0 1em;
`;

const Row = styled.div`
  ${(props: { separator?: boolean }) => css`
    flex: 1;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    ${props.separator
      ? css`
          border-bottom: 1px solid ${transparentize(0.9, "#979797")};
        `
      : null};
  `};
`;

const MetricStyled = styled(Metric)<{
  availableMetric: boolean;
}>`
  color: ${(props) => (props.availableMetric ? Colors.BLUE_3 : Colors.NAVY_3)};

  ${Value} {
    font-size: ${Fonts.FONT_SIZE_16};
  }

  ${Unit} {
    font-size: ${Fonts.FONT_SIZE_12};
  }
`;

const LoadingSpinnerContainer = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export interface Props {
  model: SelectionBarCardModel;
  onClose: (id: string) => void;

  className?: string;
}

const initialState = {};

type State = Readonly<typeof initialState>;

@observer
export class SelectionBarCard extends React.Component<Props, State> {
  static defaultProps = {};
  readonly state: State = initialState;

  onCloseClick = (e: SyntheticEvent<Element>) => {
    this.props.onClose(this.props.model.id);
    e.stopPropagation();
  };

  render() {
    const { model } = this.props;
    const cardMetrics = model.cardMetrics;
    return (
      <SelectionCardView onClick={model.showMoreDetails} className={this.props.className}>
        <Header>
          <MarketplaceEntityHeaderStyled model={model.marketplaceEntityHeaderModel} />
          <CloseButtonStyled onClick={this.onCloseClick} />
        </Header>
        {!cardMetrics ? (
          <LoadingSpinnerContainer>
            <LoadingSpinner shakeAnimation={true} size={15} />
          </LoadingSpinnerContainer>
        ) : (
          <Rows>
            <Row separator={true}>
              <MetricStyled
                availableMetric={true}
                value={cardMetrics.bandwidthFormatted.getPretty()}
                units={cardMetrics.bandwidthFormatted.unit}
                description={""}
              />
              <MetricStyled
                availableMetric={true}
                value={cardMetrics.tpsFormatted.getPretty()}
                units={cardMetrics.tpsFormatted.unit}
                description={""}
              />
            </Row>
            <Row>
              <MetricStyled
                availableMetric={false}
                value={cardMetrics.avgBitrateFormatted.getPretty()}
                units={cardMetrics.avgBitrateFormatted.unit}
                description={""}
              />
              <MetricStyled availableMetric={false} value={cardMetrics.coverageFormatted} units={""} description={""} />
            </Row>
          </Rows>
        )}
      </SelectionCardView>
    );
  }
}
