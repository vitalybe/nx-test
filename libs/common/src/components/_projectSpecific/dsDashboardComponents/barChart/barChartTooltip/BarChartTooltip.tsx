import * as React from "react";
import styled from "styled-components";
import { UnitsFormatterResult } from "common/utils/unitsFormatter";
import { CommonColors as Colors } from "common/styling/commonColors";
import {
  IconImg,
  ItemUnitSpn,
  ItemValueSpn,
  PercentValueSpn,
} from "common/components/_projectSpecific/dsDashboardComponents/barChart/_parts/BarsGroup";

//region [[ Styles ]]

const Header = styled.div`
  display: flex;
  width: 100%;
  padding: 0 16px;
  justify-content: center;
  align-items: center;
  margin-bottom: 4px;
`;
const TooltipTitle = styled.span`
  font-size: 0.75rem;
`;

const ValuesContainer = styled.div`
  padding: 0 16px;
`;
const ChartTooltipView = styled.div`
  padding: 8px 0;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 150px;

  span {
    font-family: Avenir, sans-serif;
    color: ${Colors.BLACK_PEARL};
  }
`;
//endregion [[ Styles ]]

export interface Props {
  itemValue: UnitsFormatterResult;
  title: string;
  icon?: string;
  percentOfTotal?: UnitsFormatterResult;
  className?: string;
}

export const BarChartTooltip = ({ itemValue, title, icon, percentOfTotal, ...props }: Props) => {
  return (
    <ChartTooltipView className={props.className}>
      <Header>
        {icon && <IconImg imagePath={icon} />}
        <TooltipTitle>{title}</TooltipTitle>
      </Header>
      <ValuesContainer>
        {percentOfTotal && <PercentValueSpn>{percentOfTotal.getPrettyWithUnit()}</PercentValueSpn>}
        <ItemValueSpn isSubValue={percentOfTotal !== undefined}>{itemValue.getPretty()}</ItemValueSpn>
        <ItemUnitSpn>{itemValue.unit}</ItemUnitSpn>
      </ValuesContainer>
    </ChartTooltipView>
  );
};
