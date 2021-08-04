import * as React from "react";
import { useMemo } from "react";
import { loggerCreator } from "common/utils/logger";
import { QwiltChart } from "common/components/qwiltChart/QwiltChart";
import { ChartSeriesData } from "common/components/qwiltChart/_domain/chartSeriesData";
import { AddSeriesBehavior } from "common/components/qwiltChart/_behaviors/addSeriesBehavior/addSeriesBehavior";
import { YAxisBehavior } from "common/components/qwiltChart/_behaviors/yAxisBehavior/yAxisBehavior";
import { GlobalFontStore } from "common/components/GlobalFontProvider";
import { DateTime } from "luxon";
import { UnitKindEnum, unitsFormatter } from "common/utils/unitsFormatter";
import {
  MiniChartPanelHeader,
  MiniChartView,
} from "common/components/_projectSpecific/monetization/_styled/miniChartPanelHeader";
import {
  TooltipContentView,
  TooltipTitle,
  TooltipValue,
} from "common/components/_projectSpecific/monetization/_styled/tooltipParts";
import { XAxisBehavior } from "common/components/qwiltChart/_behaviors/xAxisBehavior/xAxisBehavior";
import styled from "styled-components";
import { ColumnSeriesBehavior } from "common/components/_projectSpecific/monetization/reports/_chartBehaviors/columnSeriesBehavior";
import {
  commonDataLabelsOption,
  commonXAxisOptions,
  getCommonYAxisOptions,
} from "common/components/_projectSpecific/monetization/reports/_chartBehaviors/_constants";
import {
  BasicChartsTooltipBehavior,
  ThisTooltipShared,
} from "common/components/_projectSpecific/monetization/reports/_chartBehaviors/basicChartsTooltipBehavior";
import { NoXAxisBehavior } from "common/components/_projectSpecific/monetization/reports/_chartBehaviors/noXAxisBehavior";
import { CommonColors } from "common/styling/commonColors";

const moduleLogger = loggerCreator(__filename);

// region [[ Styles ]]
const RecentPeakDiv = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: auto;
  align-items: flex-end;
`;
const RecentPeakTitle = styled.span`
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 8px;
`;
const RecentPeakDateSpn = styled.span`
  font-size: 12px;
  font-weight: 500;
  margin-bottom: 8px;
  color: ${CommonColors.SHERPA_BLUE};
`;
const RecentPeakValue = styled.span`
  font-size: 14px;
  font-weight: 600;
`;
// endregion

//region [[ Props ]]

export interface Props {
  data: ChartSeriesData;
  barsWidth?: number;
  isPrintMode?: boolean;
  className?: string;
}

//endregion [[ Props ]]

export const PeakBandwidthChart = ({ data, barsWidth, isPrintMode, ...props }: Props) => {
  const behaviors = useMemo(
    () =>
      getBehaviors({
        barsWidth,
        isXAxisEnabled: isPrintMode,
        isDataLabelsEnabled: isPrintMode,
      }),
    [barsWidth, isPrintMode]
  );

  const seriesData = useMemo(() => [data], [data]);
  return (
    <MiniChartView className={props.className}>
      <MiniChartPanelHeader title={"Peak Bandwidth"} subTitle={"Last 12 months"}>
        {isPrintMode ? (
          <RecentPeakDiv>
            <RecentPeakTitle>{"Recent Peak:"}</RecentPeakTitle>
            <RecentPeakDateSpn>
              {DateTime.fromMillis(data.histogram.lastPoint.x).toFormat("MMM dd, hh:mm")}
            </RecentPeakDateSpn>
            <RecentPeakValue>
              {unitsFormatter.format(data.histogram.lastPoint.y ?? 0, UnitKindEnum.TRAFFIC).getPrettyWithUnit(true)}
            </RecentPeakValue>
          </RecentPeakDiv>
        ) : null}
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
          const formatted = unitsFormatter.format(this.y, UnitKindEnum.TRAFFIC);
          return `<span>${formatted.getRounded(0)}</span>`;
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
  const date = point?.date;
  const formattedValue = point && unitsFormatter.format(point.y ?? 0, UnitKindEnum.TRAFFIC);
  return (
    <TooltipContentView>
      {date && formattedValue ? (
        <>
          <TooltipTitle>{`${date.monthShort} ${date.day} ${date.year}`}</TooltipTitle>
          <TooltipTitle>{`${date.toFormat("HH:mm")}`}</TooltipTitle>
          <TooltipValue>{formattedValue.getPrettyWithUnit(true)}</TooltipValue>
        </>
      ) : (
        <span>No Data</span>
      )}
    </TooltipContentView>
  );
}
