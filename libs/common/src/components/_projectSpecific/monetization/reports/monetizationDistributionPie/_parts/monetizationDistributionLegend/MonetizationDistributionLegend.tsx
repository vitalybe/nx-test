import * as React from "react";
import styled from "styled-components";
import { loggerCreator } from "../../../../../../../utils/logger";
import { UnitKindEnum, unitsFormatter } from "../../../../../../../utils/unitsFormatter";
import { ColoredCircle } from "../../../../../../styled/ColoredCircle";
import { VirtualizedListButton } from "../../../../../../virtualizedListButton/VirtualizedListButton";
import { CurrencyUnitEnum, CurrencyUtils } from "../../../../_utils/currencyUtils";
import { QwiltPieChartPart } from "../../../../../../qwiltPieChart/_types";
import _ from "lodash";
import { CommonColors } from "../../../../../../../styling/commonColors";
import { OverflowingText } from "../../../../../../overflowingText/OverflowingText";

// noinspection JSUnusedLocalSymbols
const moduleLogger = loggerCreator("__filename");

//region [[ Styles ]]

const LegendText = styled.span<{ textAlign?: "center" | "right" | "left" }>`
  font-size: 0.75rem;
  color: ${CommonColors.SHERPA_BLUE};
  font-weight: 600;
  text-align: ${(props) => props.textAlign ?? "left"};
  min-width: max-content;
`;

const OverflowingTextStyled = styled(OverflowingText)`
  font-size: 0.75rem;
  color: ${CommonColors.SHERPA_BLUE};
  font-weight: 600;
`;
const LegendItemRow = styled.div`
  display: grid;
  grid-auto-columns: 1rem minmax(50px, min-content) auto auto;
  grid-auto-flow: column;
  align-items: center;
  grid-gap: 0.3rem;
`;

const LegendDivPrint = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-auto-rows: 24px;
  grid-gap: 32px;
  width: 100%;
  align-content: center;
  ${LegendItemRow} {
    grid-gap: 12px;
    ${ColoredCircle} {
      height: 14px;
      width: 14px;
    }
    ${LegendText}, ${OverflowingTextStyled} {
      font-size: 14px;
    }
    ${LegendText} {
      font-weight: 400;
    }
  }
`;
const LegendDiv = styled.div`
  display: grid;
  grid-auto-flow: row;
  padding: 0 0.25rem;
  grid-auto-rows: 2rem;
  align-content: center;
  width: 100%;
  max-width: 21rem;
`;
//endregion [[ Styles ]]

export interface Props {
  isPrint?: boolean;
  parts: QwiltPieChartPart[];
  className?: string;
}

function LegendItems({ parts }: { parts: QwiltPieChartPart[] }) {
  const totalValue = _.sumBy(parts, ({ y }) => y);
  return (
    <>
      {parts.map(({ name, y, color, children }) => {
        const percentFormatted = unitsFormatter.format((y / totalValue) * 100, UnitKindEnum.PERCENT, 2);
        return (
          <LegendItemRow key={name}>
            <ColoredCircle color={color} />
            <OverflowingTextStyled>{name}</OverflowingTextStyled>
            {children && children.length > 1 ? (
              <VirtualizedListButton
                title={name ?? "Others"}
                relativeTotal={totalValue}
                currency={CurrencyUnitEnum.US_DOLLAR}
                unit={UnitKindEnum.COUNT}
                data={children.map(({ y, name }) => ({
                  name: name ?? "",
                  value: y ?? 0,
                  percentage: y ? (y / totalValue) * 100 : 0,
                }))}
              />
            ) : null}

            <LegendText textAlign={"right"}>
              {CurrencyUtils.format(y)} ({percentFormatted.getPrettyWithUnit()})
            </LegendText>
          </LegendItemRow>
        );
      })}
    </>
  );
}

export const MonetizationDistributionLegend = (props: Props) => {
  return props.isPrint ? (
    <LegendDivPrint>
      <LegendItems parts={props.parts} />
    </LegendDivPrint>
  ) : (
    <LegendDiv>
      <LegendItems parts={props.parts} />
    </LegendDiv>
  );
};
