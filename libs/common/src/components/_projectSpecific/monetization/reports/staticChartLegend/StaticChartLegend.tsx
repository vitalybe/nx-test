import * as React from "react";
import styled from "styled-components";
import { ColoredCircle } from "common/components/styled/ColoredCircle";
import { CommonColors } from "common/styling/commonColors";

// noinspection JSUnusedLocalSymbols

//region [[ Styles ]]
const LegendItemDiv = styled.div`
  display: flex;
  align-items: center;
  grid-gap: 0.25rem;
  font-size: 0.75rem;
  color: ${CommonColors.SHERPA_BLUE};
  font-weight: 600;
`;
const ColoredCircleStyled = styled(ColoredCircle)`
  width: 0.75rem;
  height: 0.75rem;
  margin-right: 0;
`;
const StaticChartLegendView = styled.div`
  display: grid;
  grid-auto-flow: column;
  grid-gap: 1rem;
  margin-left: auto;
`;

//endregion [[ Styles ]]

//region [[ Props ]]
export interface StaticLegendItem {
  color: string;
  label: string;
  value?: string;
}
export interface Props {
  items: StaticLegendItem[];
  className?: string;
}

//endregion [[ Props ]]

export const StaticChartLegend = (props: Props) => {
  return (
    <StaticChartLegendView className={props.className}>
      {props.items.map(({ label, color, value }) => (
        <LegendItemDiv key={label + color}>
          <ColoredCircleStyled color={color} />
          <span>
            {label}
            {value ? `: ${value}` : ""}
          </span>
        </LegendItemDiv>
      ))}
    </StaticChartLegendView>
  );
};
