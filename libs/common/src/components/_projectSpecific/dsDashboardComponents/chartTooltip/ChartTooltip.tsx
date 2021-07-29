import * as React from "react";
import styled from "styled-components";
import { UnitKindEnum, unitsFormatter } from "../../../../utils/unitsFormatter";
import { DateTime, Duration } from "luxon";
import { ChartSeriesData } from "../../../qwiltChart/_domain/chartSeriesData";
import { HistogramPoint } from "../../../../utils/histograms/domain/histogramPoint";
import { Shadows } from "../../../../styling/shadows";
import { transparentize } from "polished";
import { ColoredCircle } from "../../../styled/ColoredCircle";
import { TruncatedSpn } from "../../../styled/TruncatedSpn";
import { CssAnimations } from "../../../../styling/animations/cssAnimations";
import { CommonColors } from "../../../../styling/commonColors";

export const AVG_SERIES_NAME = "Average";
export const INACTIVE_SERIES_COLOR = CommonColors.PATTENS_BLUE;

//region [[ Styles ]]
const ColoredHalo = styled(ColoredCircle)`
  height: 16px;
  width: 16px;
  opacity: 0.5;
  top: -4px;
  left: -4px;
  position: absolute;
  background-color: ${(props) => transparentize(0.5, props.color)};
  border: 1px solid ${(props) => props.color};
  animation: ${CssAnimations.SCALE_UP} 300ms ease-out forwards;
`;

const TooltipSubSpn = styled.span`
  font-size: 0.6875rem;
  opacity: 0.6;
  color: ${CommonColors.HEATHER};
  margin-bottom: 4px;
  width: 100%;
  text-align: center;
`;

const TooltipTimestamp = styled(TooltipSubSpn)`
  font-size: 0.625rem;
  padding-bottom: 3px;
  color: ${CommonColors.NEVADA};
  border-bottom: 1px solid ${CommonColors.HEATHER};
  margin-bottom: 6px;
`;

const PointTitle = styled.div`
  margin-bottom: 4px;
  display: flex;
  flex: 1 1 auto;
  align-items: center;
`;

const PointUnit = styled.span`
  font-size: 0.75rem;
  margin-left: 4px;
`;
const PointValue = styled.span<{ isHighlighted?: boolean; color: string }>`
  font-size: 0.88rem;
  padding: 3px;
  font-weight: 600;
  color: ${(props) => (props.isHighlighted ? props.color : "inherit")};
  background-color: ${(props) => (props.isHighlighted ? transparentize(0.7, props.color) : "transparent")};
  border-radius: 3px;
`;
const PointDataView = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 0 16px;
  align-items: center;
`;
const ChartTooltipView = styled.div`
  padding: 8px 0;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: ${CommonColors.WHITE};
  box-shadow: ${Shadows.CARD_SHADOW};
  width: 220px;
  font-family: Avenir, sans-serif;
  color: ${CommonColors.BLACK_PEARL};
`;
//endregion [[ Styles ]]

//region [[ Props ]]

export interface Props {
  index: number;
  chartSeriesDataItems: ChartSeriesData[];
  className?: string;
}
interface PointProps {
  seriesName: string;
  point: HistogramPoint;
  unit?: UnitKindEnum;
  isPeak?: boolean;
  color: string;
  className?: string;
}
//endregion [[ Props ]]

function PointData({ seriesName, unit, point, isPeak, color, ...props }: PointProps) {
  const formatted = unitsFormatter.format(point.y ?? 0, unit || UnitKindEnum.COUNT);
  return (
    <PointDataView className={props.className}>
      <PointTitle>
        <ColoredCircle color={color}>{isPeak && <ColoredHalo color={color} />}</ColoredCircle>
        <TruncatedSpn>{seriesName}</TruncatedSpn>
      </PointTitle>
      <PointValue isHighlighted={isPeak} color={color}>
        {formatted.getPretty()}
        <PointUnit>{formatted.unit}</PointUnit>
      </PointValue>
    </PointDataView>
  );
}

export const ChartTooltip = ({ chartSeriesDataItems, ...props }: Props) => {
  const histogram = chartSeriesDataItems[0]?.histogram;
  const startTime = DateTime.fromMillis(histogram?.points[props.index].x);
  const xDelta = Duration.fromMillis(histogram?.pointInterval);
  const endTime = startTime.plus(xDelta);

  const avgSeries = chartSeriesDataItems.find((series) => series.name === AVG_SERIES_NAME);
  const filteredData = chartSeriesDataItems.filter((series) => {
    return !avgSeries || (series.name !== avgSeries.name && series.color !== INACTIVE_SERIES_COLOR);
  });
  const topSeries = filteredData.slice(0, 5);
  const otherSeriesCount = filteredData.length - topSeries.length;

  const { startTimeFormat, endTimeFormat } = getTimestampFormats(startTime, endTime);
  return (
    <ChartTooltipView className={props.className}>
      {startTime && (
        <TooltipTimestamp>
          {startTime.toFormat(startTimeFormat)} - {endTime.toFormat(endTimeFormat)}
        </TooltipTimestamp>
      )}
      {topSeries.map((series) => (
        <PointData
          key={series.id || series.name}
          seriesName={series.name}
          color={series.color}
          unit={series.unitType}
          point={series.histogram.points[props.index]}
          isPeak={props.index === series.histogram.peakPoint.index}
        />
      ))}
      {otherSeriesCount > 0 ? <TooltipSubSpn>+{otherSeriesCount} more</TooltipSubSpn> : null}
      {avgSeries && (
        <PointData
          key={avgSeries.id || avgSeries.name}
          seriesName={avgSeries.name}
          unit={avgSeries.unitType}
          color={avgSeries.color}
          point={avgSeries.histogram.points[props.index]}
          isPeak={props.index === avgSeries.histogram.peakPoint.index}
        />
      )}
    </ChartTooltipView>
  );
};

function getTimestampFormats(startTime: DateTime, endTime: DateTime) {
  const isStartTimeExtended = !startTime.hasSame(DateTime.local(), "day");
  const isEndTimeExtended = !endTime.hasSame(startTime, "day");
  const startTimeFormat = `${isStartTimeExtended ? "MMM dd" : ""} HH:mm`;
  const endTimeFormat = `${isEndTimeExtended ? "MMM dd" : ""} HH:mm`;

  return { startTimeFormat, endTimeFormat };
}
