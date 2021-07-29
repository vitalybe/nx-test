import * as React from "react";
import styled from "styled-components";
import { transparentize } from "polished";
import { UnitKindEnum, unitsFormatter } from "common/utils/unitsFormatter";
import { formatPercentage } from "common/components/qwiltPieChart/_utils";
import { TooltipProps } from "common/components/qwiltPieChart/_types";
import { CommonColors } from "common/styling/commonColors";

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 0.75rem;
  width: 100%;
  max-width: 100%;
  flex-direction: column;
  min-width: 140px;
  border-bottom: 1px solid ${transparentize(0.8, "#979797")};
  margin-bottom: 0.3125rem;
`;
const TooltipText = styled.div<{ fontSize?: string }>`
  font-size: ${(props) => props.fontSize || "0.75rem"};
  max-width: 100%;
  text-align: center;
  padding: 0.25rem 0.75rem;
`;

const PieChartTooltipView = styled.div`
  padding: 0.5rem 0;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 200px;
  white-space: normal;
  font-family: Avenir, sans-serif;
  color: ${CommonColors.BLUE_WHALE};
  font-weight: 600;
  font-size: 0.75rem;
`;

export function PieChartTooltip({ name, value, unit, percentage, ...props }: TooltipProps) {
  const formattedValue = unitsFormatter.format(value, unit || UnitKindEnum.COUNT);
  return (
    <PieChartTooltipView className={props.className}>
      <Header>
        <TooltipText fontSize={"0.875rem"}>{name}</TooltipText>
      </Header>
      <TooltipText key={name}>
        {formattedValue.getPrettyWithUnit(true)} ({formatPercentage(percentage)}%)
      </TooltipText>
    </PieChartTooltipView>
  );
}
