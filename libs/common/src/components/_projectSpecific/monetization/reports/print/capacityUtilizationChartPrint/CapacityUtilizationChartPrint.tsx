import * as React from "react";
import styled from "styled-components";
import { loggerCreator } from "../../../../../../utils/logger";
import { ChartSeriesData } from "../../../../../qwiltChart/_domain/chartSeriesData";
import { CapacityUtilizationChart } from "../../monetizationMiniCharts/capacityUtilizationChart/CapacityUtilizationChart";

// noinspection JSUnusedLocalSymbols
const moduleLogger = loggerCreator("__filename");

//region [[ Styles ]]

const CapacityUtilizationChartPrintView = styled.div`
  height: 320px;
`;

//endregion [[ Styles ]]

//region [[ Props ]]

export interface Props {
  data: ChartSeriesData[];
  className?: string;
}

//endregion [[ Props ]]

export const CapacityUtilizationChartPrint = (props: Props) => {
  return (
    <CapacityUtilizationChartPrintView className={props.className}>
      <CapacityUtilizationChart
        isXAxisEnabled
        isDataLabelsEnabled
        barsWidth={16}
        seriesData={processSeriesData(props.data)}
      />
    </CapacityUtilizationChartPrintView>
  );
};

function processSeriesData(data: ChartSeriesData[]) {
  data.forEach(({ histogram }) => {
    histogram.lastPoint.pointWidth = 19.2;
  });
  return data;
}
