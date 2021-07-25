import { ChartSeriesData } from "common/components/qwiltChart/_domain/chartSeriesData";
import { useMemo } from "react";
import _ from "lodash";
import { DateTime } from "luxon";

export interface LegendItem {
  label: string;
  value: number;
  color?: string;
}
export interface LiveLegendState {
  isLastPoint: boolean;
  legendItems: LegendItem[];
  currentDate: DateTime | undefined;
  total: LegendItem;
}

export function useLiveValuesLegend(seriesData: ChartSeriesData[], hoveredIndex: number | undefined): LiveLegendState {
  const legendItems: LegendItem[] = useMemo(
    () =>
      seriesData.map(({ name, color, histogram }) => {
        const point = (hoveredIndex !== undefined ? histogram.points[hoveredIndex] : undefined) ?? histogram.lastPoint;
        return {
          label: name,
          color,
          value: point.y ?? 0,
        };
      }),
    [seriesData, hoveredIndex]
  );

  const total: LegendItem = useMemo(() => {
    let value = 0;
    if (seriesData.length > 0) {
      const index = hoveredIndex !== undefined ? hoveredIndex : seriesData[0].histogram.lastPoint.index;
      value = _.sumBy(seriesData, ({ histogram }) => (histogram.points[index] ? histogram.points[index].y ?? 0 : 0));
    }
    return { label: "Total", value };
  }, [seriesData, hoveredIndex]);

  const currentDate = useMemo(() => {
    if (seriesData.length > 0) {
      const point =
        seriesData[0] &&
        (hoveredIndex !== undefined ? seriesData[0].histogram.points[hoveredIndex] : seriesData[0].histogram.lastPoint);
      if (point) {
        return DateTime.fromMillis(point.x);
      }
    }
  }, [hoveredIndex, seriesData]);

  const isLastPoint =
    !!seriesData[0] && !!currentDate && seriesData[0].histogram.lastPoint.x === currentDate.toMillis();

  return { legendItems, total, currentDate, isLastPoint };
}
