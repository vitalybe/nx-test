import * as React from "react";
import styled from "styled-components";
import { loggerCreator } from "../../../../../../utils/logger";
import { ChartSeriesData } from "../../../../../qwiltChart/_domain/chartSeriesData";
import { unitsFormatter } from "../../../../../../utils/unitsFormatter";
import { HistogramSeries } from "../../../../../../utils/histograms/domain/histogramSeries";
import { MonetizationMonthlyChart } from "../../monetizationMonthlyChart/MonetizationMonthlyChart";

// noinspection JSUnusedLocalSymbols
const moduleLogger = loggerCreator("__filename");

//region [[ Styles ]]
const Label = styled.div`
  font-weight: 600;
`;
const GridRow = styled.div`
  display: grid;
  grid-template-columns: 42px repeat(14, 69.3px);
  grid-auto-flow: column;
  span {
    justify-self: center;
  }
`;
const ValuesTable = styled.div`
  display: grid;
  grid-auto-flow: row;
  font-size: 12px;
  grid-gap: 24px;
  margin-top: 12px;
  height: 88px;
`;
const MonthlyRevenueChartStyled = styled(MonetizationMonthlyChart)`
  flex: 1 1 auto;
  height: 260px;
`;
const MonthlyRevenueChartPrintView = styled.div`
  display: flex;
  flex-direction: column;
  max-height: 360px;
  margin-bottom: 2rem;
`;

//endregion [[ Styles ]]

//region [[ Props ]]

export interface Props {
  data: ChartSeriesData[];
  className?: string;
}

//endregion [[ Props ]]

export const MonetizationMonthlyChartPrint = (props: Props) => {
  const totalSeries =
    props.data.length > 1
      ? new ChartSeriesData({
          name: "Total",
          histogram: HistogramSeries.fromMultipleSeriesSum(props.data.map(({ histogram }) => histogram)),
          unitType: props.data[0]?.unitType,
        })
      : undefined;

  const tableSeries = totalSeries ? [totalSeries, ...props.data] : props.data;
  return (
    <MonthlyRevenueChartPrintView className={props.className}>
      <MonthlyRevenueChartStyled
        title={"Monthly Revenue"}
        subTitle={"Last 12 months"}
        isLegendHidden
        seriesData={processSeriesData(props.data)}
        barsWidth={45}
      />
      <ValuesTable>
        {tableSeries.map((series) => (
          <GridRow key={series.name}>
            <Label>{series.name}</Label>
            {series.histogram.points.map(({ y, x }) => (
              <span key={x}>{unitsFormatter.format(y ?? 0, series.unitType).getPrettyWithUnit()}</span>
            ))}
          </GridRow>
        ))}
      </ValuesTable>
    </MonthlyRevenueChartPrintView>
  );
};

function processSeriesData(data: ChartSeriesData[]) {
  data.forEach(({ histogram }) => {
    histogram.lastPoint.pointWidth = 60;
  });
  return data;
}
