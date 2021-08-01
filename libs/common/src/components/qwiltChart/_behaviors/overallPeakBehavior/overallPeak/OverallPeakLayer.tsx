import * as React from "react";
import { useMemo } from "react";
import styled from "styled-components";
import { loggerCreator } from "../../../../../utils/logger";
import { HistogramSeries } from "../../../../../utils/histograms/domain/histogramSeries";
import { ChartSeriesArray } from "../../../_domain/chartSeriesArray";
import { UnitKindEnum } from "../../../../../utils/unitsFormatter";
import { OverallPeak } from "./OverallPeak";

const moduleLogger = loggerCreator("__filename");

//region [[ Styles ]]

const OverallPeakLayerView = styled.div`
  pointer-events: auto;
`;

const OverallPeakStyled = styled(OverallPeak)<{ x: number }>`
  position: absolute;
  top: 45px;
  left: ${(props) => props.x}px;
  opacity: ${(props) => (props.x < 60 ? 0.5 : 1)};
  transform: translateX(-50%);
  &:hover {
    opacity: 1;
  }
`;

//endregion

export interface Props {
  chartSeriesGroup: ChartSeriesArray;
  currentIndex: number | undefined;
  onChangeIndex: (peakIndex: number) => void;
  seriesWithoutPeak?: string[];

  className?: string;
}

function getPeakPoint(chartSeriesGroup: ChartSeriesArray, seriesWithoutPeak: string[] = []) {
  const allSeries = HistogramSeries.fromMultipleSeriesSum(
    chartSeriesGroup.series.filter((serie) => !seriesWithoutPeak.includes(serie.name)).map((serie) => serie.histogram)
  );
  const peakPoint = allSeries.peakPoint;
  const chartPeakPoint = { ...chartSeriesGroup.getXAxisChartPoint(peakPoint.index), y: peakPoint.y };

  return chartPeakPoint;
}

export const OverallPeakLayer = ({ ...props }: Props) => {
  const peakPoint = useMemo(() => getPeakPoint(props.chartSeriesGroup, props.seriesWithoutPeak), [
    props.chartSeriesGroup,
    props.seriesWithoutPeak,
  ]);

  return peakPoint ? (
    <OverallPeakLayerView className={props.className}>
      <OverallPeakStyled
        x={peakPoint.plotX}
        value={peakPoint.y ?? 0}
        unitsKind={UnitKindEnum.TRAFFIC}
        onMouseMove={() => props.onChangeIndex(peakPoint.index)}
        isHighlighted={peakPoint.index === props.currentIndex}
      />
    </OverallPeakLayerView>
  ) : null;
};
