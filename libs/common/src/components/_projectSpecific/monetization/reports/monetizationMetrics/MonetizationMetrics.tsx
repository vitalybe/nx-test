import * as React from "react";
import styled, { css } from "styled-components";
import { loggerCreator } from "../../../../../utils/logger";
import { Tooltip } from "../../../../Tooltip";
import { ColoredCircle } from "../../../../styled/ColoredCircle";
import { CurrencyUnitEnum, CurrencyUtils } from "../../_utils/currencyUtils";
import { TextTooltip } from "../../../../textTooltip/TextTooltip";
import { MetricData } from "../../../dsDashboardComponents/dsDashboardTopbar/DsDashboardTopBar";
import {
  Description as MetricDescription,
  Metric,
  Value as MetricValue,
  ValueRow as MetricValueRow,
} from "../../../../metrics/Metric";
import { CommonColors } from "../../../../../styling/commonColors";

// noinspection JSUnusedLocalSymbols
const moduleLogger = loggerCreator("__filename");
const approvedIcon = require("../../_media/icons/approved.svg");

//region [[ Styles ]]
const ApprovedIcon = styled.img.attrs({ src: approvedIcon })`
  width: 1.5rem;
  position: absolute;
  top: 0;
  right: 0;
  transform: translate(60%, -60%);
`;

const ReceivedLabel = styled.div`
  padding: 0.5rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: ${CommonColors.SHERPA_BLUE};
  opacity: 0.5;
`;

const metricTooltipCss = css`
  font-weight: 600;
`;

const RelativeWrapper = styled.div`
  position: relative;
`;

const ExecutiveMetric = styled(Metric)<{ isBold?: boolean }>`
  grid-gap: 0.25rem;
  display: flex;
  flex-direction: column;
  ${MetricValueRow} {
    white-space: nowrap;
  }
  ${MetricValue} {
    font-weight: ${(props) => (props.isBold ? 600 : 500)};
    font-size: 1.5625rem;
    color: ${CommonColors.SHERPA_BLUE};
  }
  ${MetricDescription} {
    font-size: 0.75rem;
    color: ${CommonColors.SHERPA_BLUE};
    max-width: max-content;
  }
`;

const MonetizationMetricsView = styled.div`
  display: flex;
  grid-gap: 2.75rem;
`;

//endregion [[ Styles ]]

//region [[ Props ]]
export interface ExecutiveMetricData extends Omit<MetricData, "iconComponent"> {
  // for financial metrics, show payment received check for overall revenue only
  showCheck?: boolean;
  valueAddition?: string;
  hideCurrency?: boolean;
  isBold?: boolean; // true for financial metrics by default
  color?: string;
  checkTooltip?: string;
  tooltip?: string;
}

export interface Props {
  financialMetrics: ExecutiveMetricData[] | undefined;
  trafficMetrics: ExecutiveMetricData[] | undefined;
  className?: string;
}

//endregion [[ Props ]]

export const MonetizationMetrics = ({ financialMetrics, trafficMetrics, ...props }: Props) => {
  return (
    <MonetizationMetricsView className={props.className}>
      {financialMetrics?.map(
        ({ value, valueAddition, tooltip, isBold, description, showCheck, checkTooltip, hideCurrency, color }) => (
          <RelativeWrapper key={description}>
            {showCheck ? (
              <Tooltip
                disabled={!checkTooltip}
                ignoreBoundaries
                arrow={false}
                placement={"top"}
                content={<ReceivedLabel>{checkTooltip}</ReceivedLabel>}>
                <ApprovedIcon />
              </Tooltip>
            ) : null}
            <TextTooltip content={tooltip ?? ""} disabled={!tooltip} textCss={metricTooltipCss}>
              <ExecutiveMetric
                isBold={isBold !== false}
                valueAddition={valueAddition}
                iconComponent={color ? <ColoredCircle color={color} /> : undefined}
                description={description}
                value={
                  value
                    ? hideCurrency
                      ? value.getPrettyWithUnit(false)
                      : CurrencyUtils.format(value.originalValue, CurrencyUnitEnum.US_DOLLAR)
                    : "0"
                }
                units={""}
              />
            </TextTooltip>
          </RelativeWrapper>
        )
      )}
      {trafficMetrics?.map(({ value, tooltip, ...metric }) => (
        <TextTooltip content={tooltip ?? ""} disabled={!tooltip} key={metric.description} textCss={metricTooltipCss}>
          <ExecutiveMetric {...metric} value={value?.getPretty() ?? ""} units={` ${value?.unit}`} />
        </TextTooltip>
      ))}
    </MonetizationMetricsView>
  );
};
