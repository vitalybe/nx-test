import * as React from "react";
import styled from "styled-components";
import _ from "lodash";
import { UnitKindEnum, unitsFormatter } from "../../../../../../utils/unitsFormatter";
import { CommonColors as Colors } from "../../../../../../styling/commonColors";
import { NoDataFallback } from "../../../../../qcComponents/noDataFallback/NoDataFallback";
import { ColoredCircle } from "../../../../../styled/ColoredCircle";

//region [[ Styles ]]

const Legend = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  &:not(:last-child) {
    margin-bottom: 8px;
  }
`;

const PartLabel = styled.div`
  display: flex;
  align-items: center;
  flex: 1 1 auto;
`;

const ColoredCircleStyled = styled(ColoredCircle)<{ color: string }>`
  margin-bottom: 2px;
`;

const PartName = styled.span`
  font-size: 0.75rem;
  color: ${Colors.BLUE_WHALE};
  text-align: start;
`;

const PartValue = styled.span`
  font-size: 0.75rem;
  color: ${Colors.BLUE_WHALE};
  font-weight: 600;
  flex: 0 0 auto;
`;

const SvgPieChartView = styled.div<{}>`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 11px 16px;
  svg {
    border-radius: 50%;
    margin-bottom: 15px;
  }
`;

//endregion [[ Styles ]]

//region [[ Props ]]

export interface Props {
  radius?: number;
  unitType?: UnitKindEnum;
  parts: {
    value: number;
    name: string;
    color: string;
  }[];
  className?: string;
}

//endregion [[ Props ]]

export const SvgPieChart = ({ parts, radius = 16, unitType = UnitKindEnum.COUNT, ...props }: Props) => {
  const circleCircumference = 2 * radius * Math.PI;
  const total = _.sumBy(parts, part => part.value);
  return (
    <SvgPieChartView className={props.className}>
      {total > 0 ? (
        <>
          <svg width="50%" viewBox="0 0 32 32">
            {parts.map((part, i) => {
              const percentOfTotal = (part.value / total) * 100;
              const bgStrokeValue = (circleCircumference / 100) * percentOfTotal;
              const nextPartsPercent = (circleCircumference * _.sumBy(parts.slice(i + 1), part => part.value)) / total;
              return (
                <circle
                  cx={"50%"}
                  cy={"50%"}
                  key={part.name}
                  stroke={part.color}
                  strokeDasharray={`${bgStrokeValue}, ${circleCircumference - bgStrokeValue}`}
                  strokeDashoffset={circleCircumference - nextPartsPercent + 0.25 * circleCircumference}
                  strokeWidth={radius * 2}
                  fill={"transparent"}
                  r={radius}
                />
              );
            })}
          </svg>
          <Legend>
            {parts.map(part => (
              <LegendItem key={part.name}>
                <PartLabel>
                  <ColoredCircleStyled color={part.color} />
                  <PartName>{part.name}</PartName>
                </PartLabel>
                <PartValue>{unitsFormatter.format(part.value, unitType, 0).getPrettyWithUnit()}</PartValue>
              </LegendItem>
            ))}
          </Legend>
        </>
      ) : (
        <NoDataFallback label="" message={"No data"} />
      )}
    </SvgPieChartView>
  );
};
