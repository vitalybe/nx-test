import * as React from "react";
import styled from "styled-components";
import { loggerCreator } from "common/utils/logger";
import { CurrencyUnitEnum, CurrencyUtils } from "common/components/_projectSpecific/monetization/_utils/currencyUtils";
import { ColoredDiv } from "common/components/styled/ColoredDiv";
import { LiveLegendState } from "common/components/_projectSpecific/monetization/_hooks/useLiveValuesLegend";
import { CommonColors } from "common/styling/commonColors";

const moduleLogger = loggerCreator(__filename);

//region [[ Styles ]]
const LegendItemView = styled.div`
  display: flex;
  align-items: center;
  grid-gap: 0.5rem;
  font-size: 0.75rem;
  color: ${CommonColors.SHERPA_BLUE};
  font-weight: 600;
`;
const ColoredDivStyled = styled(ColoredDiv)`
  width: 0.75rem;
  height: 0.75rem;
  border-radius: 50%;
`;

const ChartLegendView = styled.div`
  display: grid;
  grid-auto-flow: column;
  grid-gap: 1rem;
  margin-left: auto;
`;

//endregion [[ Styles ]]

//region [[ Props ]]

export interface Props extends LiveLegendState {
  useTotalForSingleValue?: boolean;
  className?: string;
}

//endregion [[ Props ]]

export const MonetizationChartLegend = ({ isLastPoint, currentDate, total, legendItems, ...props }: Props) => {
  const items =
    legendItems.length === 1 && props.useTotalForSingleValue
      ? [{ ...legendItems[0], label: "" }]
      : [...legendItems, total];
  return (
    <ChartLegendView className={props.className}>
      {currentDate && (
        <LegendItemView>
          {items.length === 1 && items[0].color && <ColoredDivStyled color={items[0].color} />}
          {isLastPoint ? "Current Month" : `${currentDate.monthLong} ${currentDate.year}`}
          {items.length === 1 ? ":" : ""}
        </LegendItemView>
      )}
      {items.map(({ label, color, value }) => (
        <LegendItemView key={label}>
          {color && items.length > 1 && <ColoredDivStyled color={color} />}
          {`${label ? `${label}:` : ""} ${CurrencyUtils.format(value, CurrencyUnitEnum.US_DOLLAR)}`}
        </LegendItemView>
      ))}
    </ChartLegendView>
  );
};
