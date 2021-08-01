import * as React from "react";
import { useMemo } from "react";
import styled from "styled-components";
import { loggerCreator } from "../../../../../utils/logger";
import { useAnimatedMarkersOnHoverBehavior } from "../../_hooks/useAnimatedMarkersOnHoverBehavior";
import { useLiveValuesLegend } from "../../_hooks/useLiveValuesLegend";
import { QwiltChart } from "../../../../qwiltChart/QwiltChart";
import { MonetizationChartLegend } from "../monetizationChartLegend/MonetizationChartLegend";
import { MonetizationPanelHeader } from "../monetizationPanelHeader/MonetizationPanelHeader";
import { ChartSeriesData } from "../../../../qwiltChart/_domain/chartSeriesData";
import { MarkersOnHoverBehavior } from "../../../../qwiltChart/_behaviors/markersOnHoverBehavior/markersOnHoverBehavior";
import { AddSeriesBehavior } from "../../../../qwiltChart/_behaviors/addSeriesBehavior/addSeriesBehavior";
import { XAxisBehavior } from "../../../../qwiltChart/_behaviors/xAxisBehavior/xAxisBehavior";
import { YAxisBehavior } from "../../../../qwiltChart/_behaviors/yAxisBehavior/yAxisBehavior";
import { GlobalFontStore } from "../../../../GlobalFontProvider";
import { CurrencyUnitEnum } from "../../_utils/currencyUtils";
import {
  commonXAxisOptions,
  getCommonYAxisOptions,
} from "../_chartBehaviors/_constants";
import { ColumnSeriesBehavior } from "../_chartBehaviors/columnSeriesBehavior";
import { NoTooltipBehavior } from "../_chartBehaviors/noTooltipBehavior";
import { CommonColors } from "../../../../../styling/commonColors";

const moduleLogger = loggerCreator("__filename");

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
