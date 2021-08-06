import * as React from "react";
import { ReactElement } from "react";
import styled from "styled-components";
import { loggerCreator } from "../../../../../utils/logger";
import { MonetizationPanelHeader } from "../monetizationPanelHeader/MonetizationPanelHeader";
import { QwiltPieChartOptions, QwiltPieChartPart } from "../../../../qwiltPieChart/_types";
import { CommonColors } from "../../../../../styling/commonColors";
import { QwiltPieChart } from "../../../../qwiltPieChart/QwiltPieChart";
import { MonetizationDistributionLegend } from "./_parts/monetizationDistributionLegend/MonetizationDistributionLegend";

// noinspection JSUnusedLocalSymbols
const moduleLogger = loggerCreator("__filename");

//region [[ Styles ]]

const DollarSpn = styled.span`
  font-size: 2rem;
  color: ${CommonColors.DANUBE};
  font-weight: 600;
  opacity: 0.3;
`;

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

const PanelHeaderStyled = styled(MonetizationPanelHeader)`
  grid-column: span 2;
`;
const MonetizationDistributionPieView = styled.div`
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
  legendComponent?: (props: { parts: QwiltPieChartPart[] }) => ReactElement;
  title: string;
  isPrint?: boolean;
  className?: string;
}

//endregion [[ Props ]]
const chartOptions: QwiltPieChartOptions = { innerSize: "42%", dataLabelsDistance: -30 };

export const MonetizationDistributionPie = ({ parts, ...props }: Props) => {
  return (
    <MonetizationDistributionPieView className={props.className}>
      <PanelHeaderStyled title={props.title} />
      <RelativeContainer>
        <AbsoluteDiv>
          <DollarSpn>$</DollarSpn>
        </AbsoluteDiv>
        <QwiltPieChart parts={parts} options={chartOptions} />
      </RelativeContainer>
      {props.legendComponent ? (
        props.legendComponent({ parts: parts })
      ) : (
        <MonetizationDistributionLegend isPrint={props.isPrint} parts={parts} />
      )}
    </MonetizationDistributionPieView>
  );
};
