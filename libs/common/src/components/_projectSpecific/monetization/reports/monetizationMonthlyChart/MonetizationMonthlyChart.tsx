import * as React from "react";
import { useMemo } from "react";
import styled from "styled-components";
import { loggerCreator } from "common/utils/logger";
import { useAnimatedMarkersOnHoverBehavior } from "common/components/_projectSpecific/monetization/_hooks/useAnimatedMarkersOnHoverBehavior";
import { useLiveValuesLegend } from "common/components/_projectSpecific/monetization/_hooks/useLiveValuesLegend";
import { QwiltChart } from "common/components/qwiltChart/QwiltChart";
import { MonetizationChartLegend } from "common/components/_projectSpecific/monetization/reports/monetizationChartLegend/MonetizationChartLegend";
import { MonetizationPanelHeader } from "common/components/_projectSpecific/monetization/reports/monetizationPanelHeader/MonetizationPanelHeader";
import { ChartSeriesData } from "common/components/qwiltChart/_domain/chartSeriesData";
import { MarkersOnHoverBehavior } from "common/components/qwiltChart/_behaviors/markersOnHoverBehavior/markersOnHoverBehavior";
import { AddSeriesBehavior } from "common/components/qwiltChart/_behaviors/addSeriesBehavior/addSeriesBehavior";
import { XAxisBehavior } from "common/components/qwiltChart/_behaviors/xAxisBehavior/xAxisBehavior";
import { YAxisBehavior } from "common/components/qwiltChart/_behaviors/yAxisBehavior/yAxisBehavior";
import { GlobalFontStore } from "common/components/GlobalFontProvider";
import { CurrencyUnitEnum } from "common/components/_projectSpecific/monetization/_utils/currencyUtils";
import {
  commonXAxisOptions,
  getCommonYAxisOptions,
} from "common/components/_projectSpecific/monetization/reports/_chartBehaviors/_constants";
import { ColumnSeriesBehavior } from "common/components/_projectSpecific/monetization/reports/_chartBehaviors/columnSeriesBehavior";
import { NoTooltipBehavior } from "common/components/_projectSpecific/monetization/reports/_chartBehaviors/noTooltipBehavior";
import { CommonColors } from "common/styling/commonColors";

const moduleLogger = loggerCreator(__filename);

//region [[ Styles ]]

const MonthlyRevenueChartView = styled.div`
  display: flex;
  flex-direction: column;
  height: 23rem;
  grid-gap: 1.5rem;
  width: 100%;
`;

//endregion [[ Styles ]]

//region [[ Props ]]

export interface Props {
  seriesData: ChartSeriesData[];
  barsWidth?: number;
  isLegendHidden?: boolean;
  title: string;
  subTitle: string;
  legendFilterPredicate?: (series: ChartSeriesData) => boolean;
  className?: string;
}

//endregion [[ Props ]]
const markerOptions = {
  bubbles: false,
  verticalLine: undefined,
  highlightRect: {
    color: CommonColors.SHMATTENS_BLUE,
  },
};

export const MonetizationMonthlyChart = ({ seriesData, barsWidth, legendFilterPredicate, ...props }: Props) => {
  const { behavior: markersBehavior, hoveredIndex, onChartReady } = useAnimatedMarkersOnHoverBehavior(
    seriesData,
    markerOptions
  );

  const behaviors = useMemo(() => getBehaviors(markersBehavior, barsWidth), [markersBehavior, barsWidth]);

  const legendVisibleSeries = useMemo(() => {
    return legendFilterPredicate ? seriesData.filter((series) => legendFilterPredicate!(series)) : seriesData;
  }, [seriesData, legendFilterPredicate]);

  const liveLegendState = useLiveValuesLegend(legendVisibleSeries, hoveredIndex);

  return (
    <MonthlyRevenueChartView className={props.className}>
      <MonetizationPanelHeader title={props.title} subTitle={props.subTitle}>
        {!props.isLegendHidden && <MonetizationChartLegend useTotalForSingleValue {...liveLegendState} />}
      </MonetizationPanelHeader>
      <QwiltChart
        behaviors={behaviors}
        seriesData={seriesData}
        onChartReady={onChartReady}
        mouseHoverLeaveMode={"chart"}
      />
    </MonthlyRevenueChartView>
  );
};

export function getBehaviors(markersBehavior: MarkersOnHoverBehavior, barsWidth?: number) {
  return [
    new AddSeriesBehavior(),
    new XAxisBehavior(commonXAxisOptions),
    new YAxisBehavior({
      ...getCommonYAxisOptions(CurrencyUnitEnum.US_DOLLAR),
      tickAmount: 6,
    }),
    markersBehavior,
    new NoTooltipBehavior(),
    new ColumnSeriesBehavior({
      borderWidth: 2,
      minPointLength: GlobalFontStore.instance.remToPixels(0.25),
      borderRadius: 2,
      borderColor: "white",
      pointWidth: barsWidth ?? GlobalFontStore.instance.remToPixels(3.75),
    }),
  ];
}
