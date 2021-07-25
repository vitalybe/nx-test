import * as React from "react";
import styled, { css } from "styled-components";
import { loggerCreator } from "common/utils/logger";
import { Tooltip } from "common/components/Tooltip";
import { UnitKindEnum, unitsFormatter } from "common/utils/unitsFormatter";
import { CommonColors } from "common/styling/commonColors";
import { BwPeakIcon } from "common/components/metrics/icons/bwPeakIcon/BwPeakIcon";

const moduleLogger = loggerCreator(__filename);

//region [[ Styles ]]

const OverallPeakContainer = styled.div`
  display: inline-block;
`;

const OverallPeakView = styled.div`
  ${(props: { isHighlighted: boolean }) => css`
    background-color: ${CommonColors.TARAWERA};
    border: 2px solid ${CommonColors.CORNFLOWER};
    width: 32px;
    height: 32px;
    border-radius: 0 50% 50% 50%;
    transform: rotate(225deg);
    display: flex;
    justify-content: center;
    align-items: center;
    transition: 200ms ease-in-out;
    ${props.isHighlighted &&
    css`
      box-shadow: 0 0 10px 1px ${CommonColors.CORNFLOWER};
    `}
  `};
`;

const PeakImage = styled(BwPeakIcon)`
  height: 80%;
  width: 80%;
  transform: rotate(-225deg);
`;

const TooltipContainer = styled.div`
  padding: 0.5em;
  background-color: ${CommonColors.BLUMINE};
`;

const TooltipTitle = styled.div``;

const TooltipValue = styled.div``;

const TooltipValueNumber = styled.span`
  font-weight: bold;
`;

//endregion

export interface Props {
  isHighlighted: boolean;
  onMouseMove: () => void;
  value: number;
  unitsKind: UnitKindEnum;

  className?: string;
}

export const OverallPeak = ({ ...props }: Props) => {
  function onMouseMove() {
    props.onMouseMove();
  }

  const valueFormatted = unitsFormatter.format(props.value, props.unitsKind);

  return (
    <Tooltip
      theme={"ops-dashboard-dark"}
      hideOnClick
      maxWidth={600}
      /* NOTE: Delay is necessary here - Otherwise tooltip may not show if hovering triggers a re-render */
      delay={1}
      arrow={false}
      distance={10}
      placement={"right"}
      animateFill={false}
      ignoreBoundaries
      content={
        <TooltipContainer>
          <TooltipTitle>Peak BW</TooltipTitle>
          <TooltipValue>
            <TooltipValueNumber>{valueFormatted.getPretty()}</TooltipValueNumber> {valueFormatted.unit}
          </TooltipValue>
        </TooltipContainer>
      }>
      <OverallPeakContainer className={props.className}>
        <OverallPeakView isHighlighted={props.isHighlighted} onMouseMove={onMouseMove}>
          <PeakImage iconTheme={"bright"} />
        </OverallPeakView>
      </OverallPeakContainer>
    </Tooltip>
  );
};
