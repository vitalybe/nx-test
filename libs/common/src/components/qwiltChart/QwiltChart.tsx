import * as _ from "lodash";
import * as React from "react";
import { MutableRefObject, useCallback, useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";
import {
  getBaseChartConfig,
  ReactHighchartWrapper,
} from "./reactHighchartWrapper/ReactHighchartWrapper";
import { ChartBehavior } from "./_domain/chartBehavior";
import { ChartSeriesArray } from "./_domain/chartSeriesArray";
import { ChartSeriesData } from "./_domain/chartSeriesData";
import { ChartSeries } from "./_domain/chartSeries";
import { ChartObject, Options, SeriesObject } from "highcharts";
import { useAlertIfCallTooSoon } from "../../utils/hooks/useAlertIfCallTooSoon";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons/faExclamationTriangle";
import { loggerCreator } from "../../utils/logger";

const moduleLogger = loggerCreator("__filename");

//region [[ Styles ]]

const QwiltChartView = styled.div`
  position: relative;
  flex: 1 1 auto;
  height: 100%;
  width: 100%;
  .highcharts-tooltip {
    z-index: 2;
  }
`;

const StatusContainer = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 6;

  font-size: 18px;
  opacity: 0.5;

  .icon {
    margin-right: 0.5em;
  }
`;

//endregion

export interface Props {
  behaviors: ChartBehavior[];
  seriesData: ChartSeriesData[];
  children?: (
    chartSeries: ChartSeriesArray,
    index: number | undefined,
    onChangeIndex: (index: number | undefined) => void
  ) => JSX.Element;
  chartRef?: MutableRefObject<ChartObject | undefined>;
  onChartReady?: (chart: Highcharts.ChartObject) => void;
  mouseHoverLeaveMode?: "chart" | "series";
  shouldIgnoreMissingData?: boolean;
  className?: string;
}

export const QwiltChart = ({
  behaviors,
  seriesData,
  shouldIgnoreMissingData = false,
  mouseHoverLeaveMode = "series",
  ...props
}: Props) => {
  useAlertIfCallTooSoon("Chart re-renders too much - Are you passing the _chartBehaviors & data everytime?", [
    behaviors,
    seriesData,
  ]);
  const [chartSeriesArray, setChartSeriesArray] = useState<ChartSeriesArray | undefined>(undefined);
  const { onDrawAdditions } = useDrawAdditions(behaviors, chartSeriesArray);
  const { chartConfig, allSeriesData } = useChartConfig(behaviors, seriesData, shouldIgnoreMissingData);
  const { setHoveredIndex } = useHoveredIndex(chartConfig, behaviors, chartSeriesArray, mouseHoverLeaveMode);
  const localChartRef = useRef<Highcharts.ChartObject | undefined>(undefined);
  const onChartIsReady = (chart: Highcharts.ChartObject) => {
    try {
      if (chart) {
        localChartRef.current = chart;
        if (props.chartRef) {
          props.chartRef.current = chart;
        }
      }
      if (chart.series.length > 0) {
        const chartSeries = allSeriesData.map((serieData) => new ChartSeries(serieData, chart));
        setChartSeriesArray(new ChartSeriesArray(chartSeries));
      }
      if (props.onChartReady) {
        props.onChartReady(chart);
      }
    } catch (e) {
      moduleLogger.warn(e);
    }
  };

  const onChartMouseLeave =
    mouseHoverLeaveMode === "chart"
      ? () => {
          ((localChartRef.current?.tooltip as unknown) as { hide(): () => void }).hide();
          setHoveredIndex(undefined);
        }
      : undefined;
  return (
    <QwiltChartView className={props.className} onMouseLeave={onChartMouseLeave}>
      {chartConfig ? (
        <ReactHighchartWrapper
          chartConfig={chartConfig}
          chartReadyCallback={onChartIsReady}
          drawAdditionsCallback={onDrawAdditions}
        />
      ) : (
        <StatusContainer>
          <FontAwesomeIcon className="icon" icon={faExclamationTriangle} />
          <span>No data</span>
        </StatusContainer>
      )}
    </QwiltChartView>
  );
};

//region [[ Functions ]]

function useDrawAdditions(behaviors: ChartBehavior[], chartSeriesArray: ChartSeriesArray | undefined) {
  const drawAdditions = useCallback(
    (chartSeriesArray: ChartSeriesArray | undefined) => {
      if (chartSeriesArray && chartSeriesArray.highchartChart && chartSeriesArray.highchartChart.renderer) {
        for (const behavior of behaviors) {
          if (behavior.drawAdditions) {
            behavior.drawAdditions(chartSeriesArray);
          }
        }
      }
    },
    [behaviors]
  );

  useEffect(() => drawAdditions(chartSeriesArray), [chartSeriesArray, drawAdditions]);

  const onDrawAdditions = () => {
    drawAdditions(chartSeriesArray);
  };

  return { onDrawAdditions };
}

function useChartConfig(
  behaviors: ChartBehavior[],
  seriesData: ChartSeriesData[],
  shouldIgnoreMissingData: boolean
): { chartConfig: Options | undefined; allSeriesData: ChartSeriesData[] } {
  const allSeriesData = useMemo(() => {
    const additionalSeries = behaviors.flatMap((behavior) =>
      behavior.addSeriesData ? behavior.addSeriesData(seriesData) : []
    );

    return [...seriesData, ...additionalSeries];
  }, [seriesData, behaviors]);

  const config = useMemo<Options | undefined>(() => {
    const baseConfig: Options = getBaseChartConfig();
    const isMissingPoints = allSeriesData.some((serieData) => {
      return (serieData.type === "line" || serieData.type === "area") && serieData.histogram.points.length <= 2;
    });

    if (isMissingPoints && !shouldIgnoreMissingData) {
      moduleLogger.warn("No sufficient data - QwiltChart won't be displayed");
    } else {
      try {
        for (const behavior of behaviors) {
          if (behavior.modifyConfig) {
            behavior.modifyConfig(baseConfig, allSeriesData);
          }
        }
      } catch (e) {
        moduleLogger.error("Failed to create chart config", e);
      }
    }

    return baseConfig;
  }, [behaviors, allSeriesData, shouldIgnoreMissingData]);

  return { chartConfig: config, allSeriesData };
}

function useHoveredIndex(
  chartConfig: Options | undefined,
  behaviors: ChartBehavior[],
  chartSeriesArray: ChartSeriesArray | undefined,
  mouseHoverLeaveMode: "chart" | "series"
) {
  const [hoveredIndex, setHoveredIndex] = useState<number | undefined>(0);
  // subscribe to index change coming from the chart
  // NOTE: we're using useMemo and not useEffect because the config has to be modified immediately, before Highchart can
  useMemo(() => {
    if (!chartConfig) {
      return;
    }

    _.defaultsDeep(chartConfig, { plotOptions: { series: { events: {}, point: { events: {} } } } });
    const seriesOptions = chartConfig.plotOptions!.series!;
    const seriesEvents = seriesOptions.events!;
    const pointOptions = seriesOptions.point!;
    const pointEvents = pointOptions.events!;
    if (pointEvents.mouseOver || seriesEvents.mouseOut) {
      throw new Error(
        `unexpected - mouseOver or mouseOut can't be set via behaviors. use ChartBheavior.hoverIndexChanged`
      );
    }

    pointEvents.mouseOver = function (this: { index: number; series: SeriesObject }) {
      setHoveredIndex(this.index);
    };

    if (mouseHoverLeaveMode === "series") {
      seriesEvents.mouseOut = function (this: { chart: ChartObject }) {
        setHoveredIndex(undefined);
      };
    }
  }, [chartConfig, mouseHoverLeaveMode]);

  // subscribe to index change coming from _chartBehaviors
  useEffect(() => {
    if (!chartConfig) {
      return;
    }

    for (const behavior of behaviors) {
      if (behavior.subscribeHoverIndexChange) {
        behavior.subscribeHoverIndexChange((index) => {
          if (chartSeriesArray && chartSeriesArray.highchartChart) {
            const point = chartSeriesArray.highchartChart.series[0].data[index];
            if (point && point.setState) {
              point.setState("hover");
              if (chartConfig.tooltip?.shared) {
                chartSeriesArray.highchartChart.tooltip.refresh([point]);
              } else {
                chartSeriesArray.highchartChart.tooltip.refresh(point);
              }
            }
            setHoveredIndex(index);
          }
        });
      }
    }
  }, [behaviors, chartConfig, chartSeriesArray]);

  useEffect(() => {
    // update _chartBehaviors with index change
    if (chartSeriesArray?.highchartChart?.renderer) {
      for (const behavior of behaviors) {
        if (behavior.onChartHoverIndexChanged) {
          behavior.onChartHoverIndexChanged(hoveredIndex, chartSeriesArray);
        }
      }
    }
  }, [chartSeriesArray, behaviors, hoveredIndex]);

  return { hoveredIndex, setHoveredIndex };
}

//endregion [[ Functions ]]
