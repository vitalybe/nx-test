import * as React from "react";
import { memo, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { CommonColors as Colors } from "../../../../../styling/commonColors";
import _ from "lodash";
import {
  BarChartDataItem,
  BarChartPlotOptions,
  BarChartYAxisOptions,
} from "../_types/_types";
import { HierarchyUtils } from "../../../../../utils/hierarchyUtils";
import { BarsGroup } from "./BarsGroup";
import { UnitKindEnum } from "../../../../../utils/unitsFormatter";
import { BarChartModel } from "../_types/barChartModel";

//region [[ Styles ]]
const AvgLine = styled.div<{ value: number }>`
  position: absolute;
  height: 1px;
  border-bottom: 1px dashed ${Colors.BLUE_WHALE};
  bottom: ${(props) => props.value + "%"};
  right: 0;
  left: 0;
  z-index: 1;
  pointer-events: none;
  span {
    position: absolute;
    right: 0.625rem;
    top: -1rem;
    font-size: 0.75rem;
  }
  transition: bottom 200ms ease-out;
`;

const PlotView = styled.div`
  position: relative;
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  z-index: 3;
  padding: 0 1.5rem;
`;

//endregion [[ Styles ]]

//region [[ Props ]]

export interface Props {
  model: BarChartModel;
  itemsList: Array<BarChartDataItem>;
  isDrilldown?: boolean;
  highlightedChildren?: Array<BarChartDataItem>;
  plotOptions: BarChartPlotOptions;
  yAxisOptions: BarChartYAxisOptions;

  className?: string;
}

//endregion [[ Props ]]

export const Plot = memo(
  ({ itemsList, model, isDrilldown, highlightedChildren, plotOptions, yAxisOptions, ...props }: Props) => {
    const highlightIds = highlightedChildren?.map((child) => child.id);
    const averageValue = plotOptions.showAverageLine && getAverageValue(itemsList, highlightedChildren);
    const items = itemsList.flatMap((item) => (item.isFlatParent && item.children ? item.children : [item]));

    const shouldUsePercentValues =
      yAxisOptions.unitType === UnitKindEnum.PERCENT &&
      items.some(({ unitType }) => unitType !== yAxisOptions.unitType);
    const totalSum = shouldUsePercentValues
      ? isDrilldown && !plotOptions.includeDrilldownParent && items.length > 1
        ? _.sumBy(items, (item) => item.value)
        : model.sum
      : undefined;

    const max = yAxisOptions.max || model.maxValue;

    const viewRef = useRef<HTMLDivElement | null>(null);
    const [viewWidth, setViewWidth] = useState<number>(0);
    useEffect(() => {
      if (viewRef.current) {
        setViewWidth(viewRef.current.clientWidth);
      }
    }, []);

    return (
      <PlotView className={props.className} ref={viewRef}>
        {items.map((item, i) => {
          const isHighlighted = highlightIds?.includes(item.id) || isDrilldown;
          let highlightedItemChildren: BarChartDataItem[] = [];

          if (highlightIds && !isHighlighted) {
            highlightedItemChildren = HierarchyUtils.getChildren(item, (child) => highlightIds.includes(child.id));
          }
          return (
            <BarsGroup
              key={i}
              item={item}
              relativeSum={totalSum}
              isDefaultHighlightColor={plotOptions.defaultHighlight}
              isHighlighted={isHighlighted || highlightedItemChildren.length > 0}
              highlightedChildren={highlightedItemChildren}
              max={max}
              maxWidth={plotOptions.maxBarWidth}
              isOutsideLabels={plotOptions.outsideLabels}
              isCondensedWidth={viewWidth / items.length < 115}
            />
          );
        })}
        {averageValue ? (
          <AvgLine value={averageValue}>
            <span>Average</span>
          </AvgLine>
        ) : null}
      </PlotView>
    );
  },
  propsAreEqual
);

function getAverageValue(items: BarChartDataItem[], highlightedChildren?: BarChartDataItem[]) {
  const allVisibleItems = _.uniqBy(items.concat(highlightedChildren || []), (item) => item.id);
  return allVisibleItems.length > 0 && _.meanBy(allVisibleItems, (item) => item.value || 0);
}

function propsAreEqual(prevProps: Props, props: Props) {
  return _.isEqual(prevProps, props);
}
