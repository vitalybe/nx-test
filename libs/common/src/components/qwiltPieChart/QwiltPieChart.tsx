import * as React from "react";
import { useEffect, useMemo, useRef } from "react";
import styled from "styled-components";
import { loggerCreator } from "../../utils/logger";
import { ReactHighchartWrapper } from "../qwiltChart/reactHighchartWrapper/ReactHighchartWrapper";
import { ChartObject } from "highcharts";
import { useEventCallback } from "../../utils/hooks/useEventCallback";
import { getChartOptions } from "./_utils";
import { QwiltPieChartOptions, QwiltPieChartPart } from "./_types";

const moduleLogger = loggerCreator("__filename");

//region [[ Styles ]
const ReactHighchartWrapperStyled = styled(ReactHighchartWrapper)`
  max-width: 100%;
  max-height: 100%;
  flex: 1 1 auto;
`;

const QwiltPieChartView = styled.div`
  width: 100%;
  height: 100%;
  min-height: 3rem;
  display: flex;
  flex-direction: column;
  .highcharts-tooltip > span {
    white-space: initial !important;
  }
  z-index: 1;
`;

//endregion [[ Styles ]]

//region [[ Props ]]

export interface Props {
  parts: QwiltPieChartPart[];
  options?: QwiltPieChartOptions;
  onChartReady?: (chart: ChartObject) => void;
  className?: string;
}

//endregion [[ Props ]]

export const QwiltPieChart = ({ parts, onChartReady, options, ...props }: Props) => {
  const chartRef = useRef<ChartObject>();

  const config = useMemo(() => getChartOptions(options ?? {}), [options]);

  useEffect(() => {
    if (chartRef.current && chartRef.current.series[0]) {
      chartRef.current.series[0].update({ data: parts });
    }
  }, [parts]);

  const chartReadyCallback = useEventCallback((chart: ChartObject) => {
    try {
      chartRef.current = chart;
      chart.series[0].update({ data: parts });

      onChartReady?.(chart);
    } catch (e) {
      moduleLogger.warn(e);
    }
  });

  return (
    <QwiltPieChartView className={props.className}>
      <ReactHighchartWrapperStyled chartConfig={config} chartReadyCallback={chartReadyCallback} />
    </QwiltPieChartView>
  );
};
