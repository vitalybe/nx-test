import * as React from "react";
import { TooltipContentView, TooltipTitle, TooltipValue } from "../_styled/tooltipParts";
import styled from "styled-components";
import { UnitNameEnum } from "../../../../utils/unitsFormatter";

const TooltipContentViewStyled = styled(TooltipContentView)`
  min-width: 6.25rem;
`;

export interface Props {
  value: number;
  trafficUnit: UnitNameEnum;
  className?: string;
}

export function PricingRateTooltip({ ...props }: Props) {
  return (
    <TooltipContentViewStyled>
      {props.value > 0 ? (
        <>
          <TooltipTitle>Price Per {props.trafficUnit}</TooltipTitle>
          <TooltipValue>${props.value}</TooltipValue>
        </>
      ) : (
        <TooltipTitle>{"No pricing available"}</TooltipTitle>
      )}
    </TooltipContentViewStyled>
  );
}
