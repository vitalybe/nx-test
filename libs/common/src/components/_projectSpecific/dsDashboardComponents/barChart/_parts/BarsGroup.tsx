import * as React from "react";
import styled from "styled-components";
import { BarChartDataItem } from "common/components/_projectSpecific/dsDashboardComponents/barChart/_types/_types";
import { Tooltip } from "common/components/Tooltip";
import { BarChartTooltip } from "common/components/_projectSpecific/dsDashboardComponents/barChart/barChartTooltip/BarChartTooltip";
import { UnitKindEnum, unitsFormatter } from "common/utils/unitsFormatter";
import { Bar, BarView } from "common/components/_projectSpecific/dsDashboardComponents/barChart/_parts/Bar";
import { ImageWithFallback } from "common/components/imageWithFallback/ImageWithFallback";
import { TruncatedSpn } from "common/components/styled/TruncatedSpn";

//region [[ Styles ]]
export const BARS_GROUP_MAX_WIDTH = 150;

export const IconImg = styled(ImageWithFallback)`
  display: flex;
  flex: 0 0 16px;
  margin-right: 4px;
`;

export const ItemUnitSpn = styled.span`
  font-size: 0.75rem;
  margin-left: 2px;
`;
export const ItemValueSpn = styled.span<{ isSubValue?: boolean }>`
  font-size: ${(props) => (props.isSubValue ? "0.75rem" : "0.88rem")};
  font-weight: ${(props) => (props.isSubValue ? 500 : 600)};
`;
export const PercentValueSpn = styled(ItemValueSpn)`
  margin-right: 4px;
`;

const OutsideLabel = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  max-width: ${BARS_GROUP_MAX_WIDTH + "px"};
`;
const TopLabel = styled(OutsideLabel)`
  top: -23px;
  width: 100%;
`;

const BottomLabel = styled(OutsideLabel)`
  bottom: -23px;
  font-size: 0.75rem;
`;
const BarsGroupView = styled.div<{ isHighlighted?: boolean; toFront?: boolean }>`
  position: relative;
  height: 100%;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  z-index: ${(props) => (props.toFront ? 2 : 0)};
  ${BarView} {
    z-index: ${(props) => (props.toFront ? 1 : 0)};
  }
  max-width: ${BARS_GROUP_MAX_WIDTH + "px"};
  flex: 1 1 auto;
`;
//endregion [[ Styles ]]

//region [[ Props ]]
export interface Props {
  item: BarChartDataItem;
  relativeSum?: number;
  isDefaultHighlightColor?: boolean;
  isHighlighted?: boolean;
  highlightedChildren: BarChartDataItem[];
  max: number;
  maxWidth?: number;
  isOutsideLabels?: boolean;
  isCondensedWidth?: boolean;
}
//endregion [[ Props ]]

export function BarsGroup({
  item,
  relativeSum,
  max,
  maxWidth,
  highlightedChildren,
  isHighlighted,
  isDefaultHighlightColor,
  isOutsideLabels,
  isCondensedWidth,
}: Props) {
  if (!isNaN(item.value) && item.value > 0) {
    const isHighlightedGroup = isDefaultHighlightColor || isHighlighted;
    const percentOfTotal = relativeSum
      ? unitsFormatter.format((item.value / relativeSum) * 100, UnitKindEnum.PERCENT)
      : undefined;
    const formattedValue = unitsFormatter.format(item.value, item.unitType || UnitKindEnum.COUNT);

    return (
      <BarsGroupView isHighlighted={isHighlightedGroup} toFront={isHighlighted}>
        <Tooltip
          disabled={!isCondensedWidth && isOutsideLabels}
          content={
            <BarChartTooltip
              itemValue={formattedValue}
              percentOfTotal={percentOfTotal}
              title={item.name ?? item.id.toString()}
              icon={item.icon}
            />
          }>
          <Bar
            isParent
            value={item.value}
            percentOfTotal={percentOfTotal?.originalValue}
            color={item.color}
            margin={highlightedChildren.length > 0 ? -1 : undefined}
            isHighlighted={isHighlightedGroup}
            max={max}
            maxWidth={maxWidth || item.maxWidth}
            topLabelComponent={
              isOutsideLabels ? (
                <TopLabel>
                  {percentOfTotal && <PercentValueSpn>{percentOfTotal.getPrettyWithUnit()}</PercentValueSpn>}
                  {!isCondensedWidth || !percentOfTotal ? (
                    <ItemValueSpn isSubValue={percentOfTotal !== undefined}>{formattedValue.getPretty()}</ItemValueSpn>
                  ) : null}
                  {!isCondensedWidth || !percentOfTotal ? <ItemUnitSpn>{formattedValue.unit}</ItemUnitSpn> : null}
                </TopLabel>
              ) : undefined
            }
          />
        </Tooltip>
        {highlightedChildren.map((childItem, j) => {
          return (
            <Bar
              key={childItem.id || `${item.id}_${j}`}
              isHighlighted
              margin={-1}
              value={childItem.value}
              percentOfTotal={relativeSum ? (childItem.value / relativeSum) * 100 : undefined}
              color={childItem.color}
              max={max}
              maxWidth={maxWidth || childItem.maxWidth || 25}
            />
          );
        })}
        {isOutsideLabels && (
          <BottomLabel>
            {item.icon && <IconImg imagePath={item.icon} />}
            {!isCondensedWidth && <TruncatedSpn>{item.name}</TruncatedSpn>}
          </BottomLabel>
        )}
      </BarsGroupView>
    );
  } else {
    return null;
  }
}
