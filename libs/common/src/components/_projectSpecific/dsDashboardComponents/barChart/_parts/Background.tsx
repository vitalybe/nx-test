import * as React from "react";
import { useMemo } from "react";
import { UnitKindEnum, unitsFormatter } from "../../../../../utils/unitsFormatter";
import styled from "styled-components";
import { CommonColors as Colors } from "../../../../../styling/commonColors";
import { CssAnimations } from "../../../../../styling/animations/cssAnimations";
import { BarChartYAxisOptions } from "../_types/_types";
import { BarChartModel } from "../_types/barChartModel";
import { HierarchyUtils } from "../../../../../utils/hierarchyUtils";
import _ from "lodash";

//region [[ Styles ]]
const AxisLabel = styled.span`
  flex: 0 0 auto;
  font-size: 0.625rem;
  color: ${Colors.BLUE_WHALE};
  padding: 0 4px;
`;
const AxisLine = styled.div`
  height: 1px;
  flex: 1 1 auto;
  background-color: ${Colors.PATTENS_BLUE};
`;
const AxisLineContainer = styled.div<{ bottomPercent: number; index: number }>`
  position: absolute;
  bottom: ${(props) => props.bottomPercent + "%"};
  display: flex;
  align-items: flex-end;
  animation: ${CssAnimations.GROW_FULL_WIDTH} 500ms forwards ease-out;
  animation-delay: ${(props) => props.index * 100}ms;
`;
const BackgroundView = styled.div`
  position: absolute;
  background-color: transparent;
  width: 100%;
  height: 100%;
  z-index: 2;
`;
//endregion [[ Styles ]]

//region [[ Props ]]

export interface Props {
  model: BarChartModel;
  yAxisOptions: BarChartYAxisOptions;
}
//endregion [[ Props ]]

export function Background({ model, ...props }: Props) {
  const yAxisOptions: Required<BarChartYAxisOptions> = useMemo(() => {
    const { max, unitType, ticks, disable } = props.yAxisOptions;
    return {
      disable: !!disable,
      max: max || model.maxValue,
      ticks: ticks || getAxisTicks(model, max),
      unitType: unitType || UnitKindEnum.COUNT,
    };
  }, [model, props.yAxisOptions]);

  const { max, unitType, ticks, disable } = yAxisOptions;

  return (
    <BackgroundView>
      {!disable &&
        ticks.map((value, i) => {
          const percentValue = (value / max) * 100;
          const formattedValue = unitsFormatter.format(value, unitType, 0);
          return (
            <AxisLineContainer key={value} bottomPercent={percentValue} index={i}>
              <AxisLabel>{formattedValue.getPrettyWithUnit()}</AxisLabel>
              <AxisLine />
            </AxisLineContainer>
          );
        })}
    </BackgroundView>
  );
}

function getAxisTicks(model: BarChartModel, maxOption?: number) {
  const ticks: number[] = [];
  const items = HierarchyUtils.flatEntitiesHierarchy(model.data);
  const max = maxOption || model.maxValue;
  const min = Math.min(_.minBy(items, (item) => item.value)?.value || 0, 0);
  const count = 4;
  const range = max - min;
  const interval = normaliseRangeTick(range / count);
  const newMin = interval * Math.round(min / interval);
  const newMax = maxOption || interval * Math.round(1 + max / interval);

  for (let value = newMin; value <= newMax; value += interval) {
    ticks.push(value);
  }
  return ticks;
}

function normaliseRangeTick(interval: number) {
  const pow10 = Math.ceil(Math.log10(interval) - 1);
  return Math.ceil(interval / pow10) * pow10;
}
