import * as React from "react";
import { useMemo } from "react";
import styled from "styled-components";
import { loggerCreator } from "../../../../../utils/logger";
import { QwiltChart } from "../../../../qwiltChart/QwiltChart";
import { ChartSeriesData } from "../../../../qwiltChart/_domain/chartSeriesData";
import { useAnimatedMarkersOnHoverBehavior } from "../../_hooks/useAnimatedMarkersOnHoverBehavior";
import { useLiveValuesLegend } from "../../_hooks/useLiveValuesLegend";
import { getOverallRevenueChartBehaviors } from "./_utils";
import { MonetizationProjectEntity } from "../../_domain/monetizationProjectEntity";
import _ from "lodash";
import { MonetizationPanelHeader } from "../monetizationPanelHeader/MonetizationPanelHeader";
import { MonetizationChartLegend } from "../monetizationChartLegend/MonetizationChartLegend";
import { OverallRevenuePrintLegend } from "../print/overallRevenuePrintLegend/OverallRevenuePrintLegend";

const moduleLogger = loggerCreator("__filename");

//region [[ Styles ]]

const OverallRevenueChartView = styled.div`
  display: flex;
  flex-direction: column;
  grid-gap: 1rem;
  width: 100%;
`;

//endregion [[ Styles ]]

//region [[ Props ]]

export interface Props {
  isPrintMode?: boolean;
  seriesData: ChartSeriesData[];
  selectedProjects: MonetizationProjectEntity[];
  spSeriesId?: string;
  isSpRevenueLegendVisible?: boolean;
  className?: string;
}

//endregion [[ Props ]]

const markerBehaviorOptions = { borderColor: "white" };

export const OverallRevenueChart = ({
  seriesData,
  selectedProjects,
  isPrintMode,
  spSeriesId,
  isSpRevenueLegendVisible = true,
  ...props
}: Props) => {
  const { hoveredIndex, behavior: markersBehavior, onChartReady } = useAnimatedMarkersOnHoverBehavior(
    seriesData,
    markerBehaviorOptions
  );

  const behaviors = useMemo(() => {
    const startDate = _.minBy(selectedProjects, ({ startDate }) => startDate)?.startDate.startOf("month");
    const endDate = _.maxBy(selectedProjects, ({ endDate }) => endDate)?.endDate.endOf("month");

    if (startDate && endDate && selectedProjects.length > 0) {
      const monthEarlyStartDate = startDate.minus({ months: 1 });
      return getOverallRevenueChartBehaviors(
        markersBehavior,
        monthEarlyStartDate,
        endDate,
        selectedProjects,
        isPrintMode
      );
    } else {
      return [];
    }
  }, [isPrintMode, selectedProjects, markersBehavior]);

  const legendVisibleSeries = useMemo(() => {
    return isSpRevenueLegendVisible
      ? seriesData
      : seriesData.filter(({ id }) => (spSeriesId ? id !== spSeriesId : id?.includes("sp-")));
  }, [seriesData, isSpRevenueLegendVisible, spSeriesId]);

  const liveLegendState = useLiveValuesLegend(legendVisibleSeries, hoveredIndex);

  return (
    <OverallRevenueChartView className={props.className}>
      <MonetizationPanelHeader title={"Overall Revenue Over Time"}>
        {isPrintMode ? (
          <OverallRevenuePrintLegend isSingleProject={selectedProjects.length === 1} />
        ) : (
          <MonetizationChartLegend useTotalForSingleValue {...liveLegendState} />
        )}
      </MonetizationPanelHeader>
      <QwiltChart
        mouseHoverLeaveMode={"chart"}
        shouldIgnoreMissingData
        behaviors={behaviors}
        seriesData={seriesData}
        onChartReady={onChartReady}
      />
    </OverallRevenueChartView>
  );
};
