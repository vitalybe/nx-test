import * as React from "react";
import styled from "styled-components";
import { loggerCreator } from "common/utils/logger";
import { ChartSeriesData } from "common/components/qwiltChart/_domain/chartSeriesData";
import { PeakBandwidthChart } from "common/components/_projectSpecific/monetization/reports/monetizationMiniCharts/peakBandwidthChart/PeakBandwidthChart";

// noinspection JSUnusedLocalSymbols
const moduleLogger = loggerCreator(__filename);

//region [[ Styles ]]

const PeakDeliveryChartPrintView = styled.div`
  height: 320px;
`;

//endregion [[ Styles ]]

//region [[ Props ]]

export interface Props {
  data: ChartSeriesData;
  className?: string;
}

//endregion [[ Props ]]

export const PeakBandwidthChartPrint = (props: Props) => {
  return (
    <PeakDeliveryChartPrintView className={props.className}>
      <PeakBandwidthChart isPrintMode barsWidth={16} data={processSeriesData(props.data)} />
    </PeakDeliveryChartPrintView>
  );
};

function processSeriesData(data: ChartSeriesData) {
  data.histogram.lastPoint.pointWidth = 19.2;
  return data;
}
