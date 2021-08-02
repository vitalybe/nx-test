import * as React from "react";
import { useMemo } from "react";
import styled from "styled-components";
import { loggerCreator } from "common/utils/logger";
import { QwiltPieChart } from "common/components/qwiltPieChart/QwiltPieChart";
import { QwiltPieChartOptions, QwiltPieChartPart } from "common/components/qwiltPieChart/_types";
import _ from "lodash";
import { CurrencyUnitEnum, CurrencyUtils } from "common/components/_projectSpecific/monetization/_utils/currencyUtils";
import { CommonColors } from "common/styling/commonColors";
import { MonetizationPanelHeader } from "common/components/_projectSpecific/monetization/reports/monetizationPanelHeader/MonetizationPanelHeader";

const moduleLogger = loggerCreator(__filename);

//region [[ Styles ]]

const AbsoluteDiv = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 2;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
const RelativeContainer = styled.div`
  position: relative;
  width: 17.5rem;
  height: 17.5rem;
  padding: 1rem;
  justify-self: end;
  align-self: center;
`;

const ColoredText = styled.span<{ color?: string }>`
  color: ${(props) => props.color ?? CommonColors.BLUE_WHALE};
`;
const LargeText = styled(ColoredText)`
  font-size: 1.5rem;
  font-weight: 600;
`;
const TextSpn = styled(ColoredText)`
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.2rem;
`;
const DollarSpn = styled.span`
  font-size: 1.5rem;
  color: ${CommonColors.CASPER};
  font-weight: 600;
`;
const RowDiv = styled.div`
  display: flex;
  align-items: flex-end;
  grid-gap: 0.5rem;
`;
const LegendItem = styled.div`
  display: flex;
  flex-direction: column;
  grid-gap: 0.5rem;
`;
const Legend = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  font-size: 1rem;
  font-weight: 600;
  grid-gap: 1.5rem;
`;
const MonetizationPanelHeaderStyled = styled(MonetizationPanelHeader)`
  width: 100%;
  grid-column: span 2;
`;
const RevenuePieChartView = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: min-content 300px;
  min-width: min-content;
  width: 100%;
`;

//endregion [[ Styles ]]

//region [[ Props ]]

export interface Props {
  parts: QwiltPieChartPart[];
  className?: string;
}

//endregion [[ Props ]]

const chartOptions: QwiltPieChartOptions = { innerSize: "68%", tooltip: { disabled: true }, disableLabels: true };

export const RevenueBreakdownPie = ({ parts, ...props }: Props) => {
  const totalValue = useMemo(() => _.sumBy(parts, ({ y }) => y), [parts]);
  const sortedParts = _.orderBy(parts, ({ y }) => y, "desc");
  return (
    <RevenuePieChartView className={props.className}>
      <MonetizationPanelHeaderStyled title={"From Project Start"} />
      <RelativeContainer>
        <AbsoluteDiv>
          <DollarSpn>$</DollarSpn>
        </AbsoluteDiv>
        <QwiltPieChart parts={sortedParts} options={chartOptions} />
      </RelativeContainer>
      <Legend>
        {sortedParts.map(({ name, y, color }) => (
          <LegendItem key={name}>
            <TextSpn>{name}</TextSpn>
            <RowDiv>
              <LargeText color={color}>{CurrencyUtils.format(y, CurrencyUnitEnum.US_DOLLAR)}</LargeText>
              <TextSpn color={color}>({((y / totalValue) * 100).toFixed(1)}%)</TextSpn>
            </RowDiv>
          </LegendItem>
        ))}
      </Legend>
    </RevenuePieChartView>
  );
};
