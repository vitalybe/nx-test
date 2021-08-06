import * as React from "react";
import { useMemo } from "react";
import styled from "styled-components";
import { OverallPeak } from "../overallPeakBehavior/overallPeak/OverallPeak";
import { ChartSeriesArray } from "../../_domain/chartSeriesArray";
import { ApiDetailedSeriesStat } from "../../../../backend/mediaAnalytics/mediaAnalyticsTypes";
import { UnitKindEnum } from "../../../../utils/unitsFormatter";
import { HistogramPointType } from "../../../../utils/histograms/utils/histogramUtils";

//region [[ Styles ]]

const MeasuredPeakLayerView = styled.div`
  pointer-events: auto;
`;

const MeasuredPeakStyled = styled(OverallPeak)<{ x: number }>`
  position: absolute;
  top: 20px;
  left: ${(props) => props.x + "px"};
  transform: translateX(-50%);
`;

//endregion

export interface Props {
  seriesArray: ChartSeriesArray;
  measuredPeakInfo: ApiDetailedSeriesStat;
  currentIndex: number | undefined;
  onChangeIndex: (peakIndex: number) => void;

  className?: string;
}

export const MeasuredPeakLayer = ({ seriesArray, measuredPeakInfo, ...props }: Props) => {
  const peakPoint = useMemo(() => {
    const axisPoint = findPointForTimestamp(seriesArray, measuredPeakInfo.timestamp);
    const chartPoint = axisPoint && seriesArray.getXAxisChartPoint(axisPoint.index);

    return (
      axisPoint &&
      chartPoint && {
        plotX: chartPoint.plotX,
        y: measuredPeakInfo.value,
        index: chartPoint.index,
      }
    );
  }, [seriesArray, measuredPeakInfo]);

  return peakPoint ? (
    <MeasuredPeakLayerView className={props.className}>
      <MeasuredPeakStyled
        x={peakPoint.plotX}
        value={peakPoint.y}
        unitsKind={UnitKindEnum.TRAFFIC}
        onMouseMove={() => props.onChangeIndex(peakPoint.index)}
        isHighlighted={peakPoint.index === props.currentIndex}
      />
    </MeasuredPeakLayerView>
  ) : null;
};

function findPointForTimestamp(seriesArray: ChartSeriesArray, timestamp: number): HistogramPointType | undefined {
  if (seriesArray.axisPoints.length > 1) {
    const interval = seriesArray.axisPoints[1].x - seriesArray.axisPoints[0].x;
    return seriesArray.axisPoints.find((point) => {
      const startTime = point.x;
      const endTime = startTime + interval;
      return startTime <= timestamp && timestamp < endTime;
    });
  }
}
