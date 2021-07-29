import * as React from "react";
import styled from "styled-components";
import { loggerCreator } from "common/utils/logger";
import { UnitKindEnum, unitsFormatter } from "common/utils/unitsFormatter";
import { CurrencyUnitEnum, CurrencyUtils } from "common/components/_projectSpecific/monetization/_utils/currencyUtils";
import { BarsContainer, UtilizationBar } from "common/components/utilizationBar/UtilizationBar";
import { CellDiv } from "../_styled";

// noinspection JSUnusedLocalSymbols
const moduleLogger = loggerCreator(__filename);

//region [[ Styles ]]
const ColoredPercentBar = styled(UtilizationBar)`
  ${BarsContainer} {
    border-radius: 2px;
    height: 10px;
  }
`;
const ThinTextSpn = styled.span`
  font-weight: 300;
`;
const BoldTextSpn = styled.span`
  margin-right: 2px;
  font-weight: 600;
`;

const BarValuesDiv = styled.div`
  display: grid;
  grid-auto-flow: column;
  align-items: center;
  grid-auto-columns: min-content;
  grid-auto-rows: auto;
  grid-gap: 0.5rem;
  line-height: 1.25rem;
`;
const BarCellDiv = styled(CellDiv)`
  grid-auto-flow: row;
  grid-auto-rows: min-content 1rem;
`;

//endregion [[ Styles ]]

export interface Props {
  value: number;
  relativePeak: number;
  totalForPercent?: number;
  currency?: CurrencyUnitEnum;
  unitKind?: UnitKindEnum;
  color: string;
  className?: string;
}

export function MonetizationBarCell(props: Props) {
  const formattedValue = unitsFormatter.format(props.value, props.unitKind);
  const percentOfTotalFormatted =
    props.totalForPercent && unitsFormatter.format((props.value / props.totalForPercent) * 100, UnitKindEnum.PERCENT);

  return (
    <BarCellDiv>
      <BarValuesDiv>
        <ThinTextSpn>
          {props.currency && CurrencyUtils.getCurrencySign(props.currency)}
          <BoldTextSpn>{formattedValue.getPretty()}</BoldTextSpn>
          {formattedValue.unit}
        </ThinTextSpn>
        {percentOfTotalFormatted && <ThinTextSpn>{percentOfTotalFormatted.getPrettyWithUnit()}</ThinTextSpn>}
      </BarValuesDiv>
      <ColoredPercentBar disableTooltip color={props.color} value={props.value} relativePeak={props.relativePeak} />
    </BarCellDiv>
  );
}
