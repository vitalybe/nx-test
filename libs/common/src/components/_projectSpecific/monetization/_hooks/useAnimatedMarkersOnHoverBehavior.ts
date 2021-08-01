import {
  MarkersOnHoverBehavior,
  MarkersOnHoverOptions,
} from "common/components/qwiltChart/_behaviors/markersOnHoverBehavior/markersOnHoverBehavior";
import { ChartSeriesData } from "common/components/qwiltChart/_domain/chartSeriesData";
import { useEffect, useMemo, useRef, useState } from "react";
import { ChartSeriesArray } from "common/components/qwiltChart/_domain/chartSeriesArray";
import { useEventCallback } from "common/utils/hooks/useEventCallback";
import { ChartObject } from "highcharts";
import { ChartSeries } from "common/components/qwiltChart/_domain/chartSeries";
import { NativeAnimations } from "common/styling/animations/nativeAnimations";

interface HookReturnType {
  hoveredIndex: number | undefined;
  behavior: MarkersOnHoverBehavior;
  onChartReady: (chart: ChartObject) => void;
}
export function useAnimatedMarkersOnHoverBehavior(
  seriesData: ChartSeriesData[],
  options?: Omit<MarkersOnHoverOptions, "onHoveredIndexChange">
): HookReturnType {
  const lastPointIndexDefault = seriesData[0]?.histogram.lastPoint.index;
  const prevHoveredIndex = useRef<number | undefined>(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | undefined>(lastPointIndexDefault);
  const [chartSeriesGroup, setChartSeriesGroup] = useState<ChartSeriesArray | undefined>(undefined);

  const behavior = useMemo(() => {
    return new MarkersOnHoverBehavior({
      bubbles: true,
      verticalLine: { color: "black" },
      onHoveredIndexChange: setHoveredIndex,
      ...options,
    });
  }, [options]);

  const onChartReady = useEventCallback((chart: ChartObject) => {
    if (chart.series.length > 0) {
      const csg = new ChartSeriesArray(seriesData.map((serieData) => new ChartSeries(serieData, chart)));
      // set default index, using setTimeout to make it work right after chart callback is finished.
      setTimeout(() => behavior.onChartHoverIndexChanged(hoveredIndex, csg));
      setChartSeriesGroup(csg);
    }
  });

  useEffect(() => {
    if (hoveredIndex === undefined && chartSeriesGroup) {
      // animate to default index when hovered is undefined
      animateHoverToIndex(prevHoveredIndex.current ?? 0, lastPointIndexDefault ?? 0, 400, (index) =>
        behavior.onChartHoverIndexChanged(index, chartSeriesGroup)
      );
    }
    prevHoveredIndex.current = hoveredIndex;
  }, [behavior, hoveredIndex, chartSeriesGroup, lastPointIndexDefault]);

  return { hoveredIndex, behavior, onChartReady };
}

function animateHoverToIndex(
  prevIndex: number,
  index: number,
  animationDuration: number,
  callback: (index: number) => void
) {
  NativeAnimations.runValues(prevIndex, index - prevIndex, animationDuration, (newIndex: number) => {
    callback(Math.round(newIndex));
  });
}
