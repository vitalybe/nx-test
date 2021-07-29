import * as React from "react";
import { useMemo } from "react";
import { loggerCreator } from "../../../../../../utils/logger";
import { QwiltChart } from "../../../../../qwiltChart/QwiltChart";
import { ChartSeriesData } from "../../../../../qwiltChart/_domain/chartSeriesData";
import { AddSeriesBehavior } from "../../../../../qwiltChart/_behaviors/addSeriesBehavior/addSeriesBehavior";
import { YAxisBehavior } from "../../../../../qwiltChart/_behaviors/yAxisBehavior/yAxisBehavior";
import { GlobalFontStore } from "../../../../../GlobalFontProvider";
import { DateTime } from "luxon";
import { UnitKindEnum, unitsFormatter } from "../../../../../../utils/unitsFormatter";
import {
  MiniChartPanelHeader,
  MiniChartView,
} from "../../../_styled/miniChartPanelHeader";
import {
  TooltipContentView,
  TooltipTitle,
  TooltipValue,
} from "../../../_styled/tooltipParts";
import { XAxisBehavior } from "../../../../../qwiltChart/_behaviors/xAxisBehavior/xAxisBehavior";
import styled from "styled-components";
import { HistogramSeries } from "../../../../../../utils/histograms/domain/histogramSeries";
import { ColumnSeriesBehavior } from "../../_chartBehaviors/columnSeriesBehavior";
import {
  commonDataLabelsOption,
  commonXAxisOptions,
  getCommonYAxisOptions,
} from "../../_chartBehaviors/_constants";
import {
  BasicChartsTooltipBehavior,
  ThisTooltipShared,
} from "../../_chartBehaviors/basicChartsTooltipBehavior";
import { NoXAxisBehavior } from "../../_chartBehaviors/noXAxisBehavior";

const moduleLogger = loggerCreator("__filename");

// region [[ Styles ]]
const TrendDiv = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: auto;
  align-items: flex-end;
`;
const TrendTitle = styled.span`
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 8px;
`;
const TrendValue = styled.span`
  font-size: 14px;
  font-weight: 600;
  opacity: 0.4;
`;
// endregion

//region [[ Props ]]

export interface Props {
  data: ChartSeriesData;
  barsWidth?: number;
  isXAxisEnabled?: boolean;
  isDataLabelsEnabled?: boolean;
  isTrendVisible?: boolean;
  className?: string;
}

//endregion [[ Props ]]

export const VolumeChart = ({
  data,
  barsWidth,
  isXAxisEnabled,
  isDataLabelsEnabled,
  isTrendVisible,
  ...props
}: Props) => {
  const behaviors = useMemo(() => getBehaviors({ barsWidth, isXAxisEnabled, isDataLabelsEnabled }), [
    barsWidth,
    isXAxisEnabled,
    isDataLabelsEnabled,
  ]);
  const seriesData = useMemo(() => [data], [data]);
  return (
    <MiniChartView className={props.className}>
      <MiniChartPanelHeader title={"Volume"} subTitle={"Last 12 months"}>
        {isTrendVisible && (
          <TrendDiv>
            <TrendTitle>{"Trend:"}</TrendTitle>
            <TrendValue>{getLastPointTrend(data.histogram)}</TrendValue>
          </TrendDiv>
        )}
      </MiniChartPanelHeader>
      <QwiltChart behaviors={behaviors} seriesData={seriesData} />
    </MiniChartView>
  );
};

interface BehaviorOptions {
  barsWidth?: number;
  isXAxisEnabled?: boolean;
  isDataLabelsEnabled?: boolean;
}
function getBehaviors({ barsWidth, isXAxisEnabled, isDataLabelsEnabled }: BehaviorOptions) {
  const behaviors = [
    new AddSeriesBehavior(),
    new ColumnSeriesBehavior({
      pointWidth: barsWidth ?? GlobalFontStore.instance.remToPixels(1.2),
      borderRadius: 3,
      borderWidth: 0,
      minPointLength: GlobalFontStore.instance.remToPixels(0.25),
      dataLabels: {
        ...commonDataLabelsOption,
        enabled: isDataLabelsEnabled,
        formatter(this: { y: number; x: number }) {
          const formatted = unitsFormatter.format(this.y, UnitKindEnum.VOLUME);
          return `<span>${formatted.getPrettyWithUnit(true)}</span>`;
        },
      },
    }),
    new YAxisBehavior(getCommonYAxisOptions()),
    new BasicChartsTooltipBehavior<ThisTooltipShared>(
      ({ tooltip, chartSeriesDataItems }) => (
        <TooltipContent index={tooltip.index} chartSeriesDataItems={chartSeriesDataItems} />
      ),
      {
        outside: true,
        shared: true,
      }
    ),
  ];

  if (isXAxisEnabled) {
    behaviors.push(new XAxisBehavior(commonXAxisOptions));
  } else {
    behaviors.push(new NoXAxisBehavior());
  }

  return behaviors;
}

function TooltipContent({ index, chartSeriesDataItems }: { index: number; chartSeriesDataItems: ChartSeriesData[] }) {
  const series = chartSeriesDataItems.length > 0 ? chartSeriesDataItems[0] : undefined;
  const point = series?.histogram.points[index];
  const date = point && DateTime.fromMillis(point.x);
  const formattedValue = point && unitsFormatter.format(point.y ?? 0, UnitKindEnum.VOLUME);
  return (
    <TooltipContentView>
      {date && formattedValue ? (
        <>
          <TooltipTitle>{`${date.monthShort} ${date.year}`}</TooltipTitle>
          <TooltipValue>{formattedValue.getPrettyWithUnit(true)}</TooltipValue>
        </>
      ) : (
        <span>No Data</span>
      )}
    </TooltipContentView>
  );
}

function getLastPointTrend(histogram: HistogramSeries) {
  const trendValue = (histogram.lastPoint.y ?? 0) - (histogram.points[histogram.lastPoint.index - 1].y ?? 0);
  const formattedTrend = unitsFormatter.format(Math.abs(trendValue), UnitKindEnum.VOLUME);

  return (trendValue > 0 ? "+" : "-") + formattedTrend.getPrettyWithUnit(true);
}
