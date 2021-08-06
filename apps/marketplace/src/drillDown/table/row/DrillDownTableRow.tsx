import * as React from "react";
import styled, { css } from "styled-components";
import { observer } from "mobx-react";
import { DrillDownTableRowModel } from "./drillDownTableRowModel";
import { ClickableImage } from "@qwilt/common/components/clickableImage/ClickableImage";
import { Fonts } from "@qwilt/common/styling/fonts";
import { transparentize } from "polished";
import { DrillDownTableRowCircle } from "./drillDownRowCircle/DrillDownTableRowCircle";
import { DrillDownTableStyles } from "../drillDownTableStyles";
import { MetricTypesEnum } from "../../../_domain/metricTypes";
import { MarketplaceEntityHeader } from "../../../_parts/marketplaceEntityHeader/marketplaceEntityHeader";
import { UnitsFormatterResult } from "@qwilt/common/utils/unitsFormatter";
import { DrillDownTableLoadingCell } from "./drillDownLoadingCell/DrillDownTableLoadingCell";

const DrillDownRowView = styled.tr`
  ${(props: { isEnabled: boolean }) => css`
    height: 60px;
    font-size: ${Fonts.FONT_SIZE};

    transition: background-color 0.2s ease;
    background-color: transparent;
    opacity: ${props.isEnabled ? 1 : 0.5};
    &:hover {
      background-color: ${transparentize(0.97, "#010d2f")};
    }
  `};
`;

const Td = styled.td`
  ${(props: { isHighlighted?: boolean }) => css`
    ${props.isHighlighted &&
    css`
      background-color: ${DrillDownTableStyles.HIGHLIGHT_COLOR};
    `};

    ${DrillDownTableStyles.CELL_STYLE};
  `};
`;

const ColorTd = styled.td`
  text-align: right;
  padding-left: 1em;
`;

const TitleTd = styled.td``;

const TdActionsIcons = styled(Td)`
  text-align: right;

  transition: opacity 0.2s ease;
  opacity: 0;
  ${DrillDownRowView}:hover & {
    opacity: 1;
  }
`;

const DrillDownRowCircleStyled = styled(DrillDownTableRowCircle)``;

const TitleValue = styled.span`
  vertical-align: middle;
`;

const ActionIcon = styled(ClickableImage)`
  &:not(:first-of-type) {
    margin-left: 1em;
  }
`;

export interface Props {
  model: DrillDownTableRowModel;
  highlightedMetricsColumn: MetricTypesEnum;

  className?: string;
}

const initialState = {};

type State = Readonly<typeof initialState>;

@observer
export class DrillDownTableRow extends React.Component<Props, State> {
  static defaultProps = {};
  readonly state: State = initialState;

  render() {
    const model = this.props.model;
    const highlightedMetricsColumn = this.props.highlightedMetricsColumn;

    let averageBandwidth: UnitsFormatterResult | undefined;
    let peakBandwidth: UnitsFormatterResult | undefined;
    let averageTps: UnitsFormatterResult | undefined;
    let peakTps: UnitsFormatterResult | undefined;
    let averageBitrate: UnitsFormatterResult | undefined;
    let peakBitrate: UnitsFormatterResult | undefined;

    if (!model.isLoading) {
      averageBandwidth = model.averageMetrics.bandwidth;
      peakBandwidth = model.peakMetrics.bandwidth;

      averageTps = model.averageMetrics.tps;
      peakTps = model.peakMetrics.tps;

      averageBitrate = model.averageMetrics.bitrate;
      peakBitrate = model.peakMetrics.bitrate;
    }

    return (
      <DrillDownRowView isEnabled={model.isEnabled} className={this.props.className}>
        <ColorTd>
          <DrillDownRowCircleStyled onClick={model.toggleRow} isEnabled={model.isEnabled} color={model.color} />
        </ColorTd>
        <TitleTd>
          <TitleValue>
            <MarketplaceEntityHeader model={model.marketplaceEntityHeader} nameFontSize={"16px"} />
          </TitleValue>
        </TitleTd>
        <Td isHighlighted={highlightedMetricsColumn === MetricTypesEnum.AVAILABLE_BW}>
          <DrillDownTableLoadingCell displayedValue={averageBandwidth} isAvailable={true} />
        </Td>
        <Td isHighlighted={highlightedMetricsColumn === MetricTypesEnum.AVAILABLE_BW}>
          <DrillDownTableLoadingCell displayedValue={peakBandwidth} isAvailable={true} />
        </Td>
        <Td isHighlighted={highlightedMetricsColumn === MetricTypesEnum.AVAILABLE_TPS}>
          <DrillDownTableLoadingCell displayedValue={averageTps} isAvailable={true} />
        </Td>
        <Td isHighlighted={highlightedMetricsColumn === MetricTypesEnum.AVAILABLE_TPS}>
          {<DrillDownTableLoadingCell displayedValue={peakTps} isAvailable={true} />}
        </Td>
        <Td isHighlighted={highlightedMetricsColumn === MetricTypesEnum.BITRATE}>
          {<DrillDownTableLoadingCell displayedValue={averageBitrate} isAvailable={false} />}
        </Td>
        <Td isHighlighted={highlightedMetricsColumn === MetricTypesEnum.BITRATE}>
          {<DrillDownTableLoadingCell displayedValue={peakBitrate} isAvailable={false} />}
        </Td>
        <Td>{model.coverage}%</Td>
        <Td>{model.ispCount}</Td>
        <TdActionsIcons>
          <ActionIcon imagePath={require("@qwilt/common/images/card.svg")} onClick={model.showCard} />
          <ActionIcon imagePath={require("../../../_images/x.svg")} onClick={model.removeRow} />
        </TdActionsIcons>
      </DrillDownRowView>
    );
  }
}
