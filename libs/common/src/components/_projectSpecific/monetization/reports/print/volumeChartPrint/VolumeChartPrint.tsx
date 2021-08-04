import * as React from "react";
import styled from "styled-components";
import { loggerCreator } from "common/utils/logger";
import { ChartSeriesData } from "common/components/qwiltChart/_domain/chartSeriesData";
import { VolumeChart } from "common/components/_projectSpecific/monetization/reports/monetizationMiniCharts/volumeChart/VolumeChart";

// noinspection JSUnusedLocalSymbols
const moduleLogger = loggerCreator(__filename);

//region [[ Styles ]]

const VolumeChartPrintView = styled.div`
  height: 320px;
  margin-top: 48px;
`;

//endregion [[ Styles ]]

//region [[ Props ]]

export interface Props {
  data: ChartSeriesData;
  className?: string;
}

//endregion [[ Props ]]

export const VolumeChartPrint = (props: Props) => {
  return (
    <VolumeChartPrintView className={props.className}>
      <VolumeChart
        isTrendVisible
        isXAxisEnabled
        isDataLabelsEnabled
        barsWidth={45}
        data={processSeriesData(props.data)}
      />
    </VolumeChartPrintView>
  );
};

function processSeriesData(data: ChartSeriesData) {
  data.histogram.lastPoint.pointWidth = 60;
  return data;
}
