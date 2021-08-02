import * as React from "react";
import styled from "styled-components";
import { CommonColors as Colors } from "common/styling/commonColors";
import { ReservedThreshold } from "common/components/utilizationBar/_parts/ReservedThreshold";
import { Tooltip } from "common/components/Tooltip";
import { UtilizationTooltip } from "common/components/utilizationBar/utilizationTooltip/UtilizationTooltip";
import { ColoredDiv } from "common/components/styled/ColoredDiv";
import { CssAnimations } from "common/styling/animations/cssAnimations";
import { DistributionPartInfo } from "common/components/distributionBars/DistributionBars";

//region [[ Styles ]]

const Bar = styled(ColoredDiv)<{ width: string }>`
  margin: 0;
  height: 100%;
  width: ${({ width }) => width};
  transition: 1s ease-out;
  will-change: transform;
`;

const ChildBar = styled(Bar)`
  position: absolute;
  left: 0;
`;

export const BarsContainer = styled.div<{ barHeight: string }>`
  width: 100%;
  height: ${(props) => props.barHeight};
  display: flex;
  border-radius: 2px 0 0 2px;
  overflow: hidden;
`;

const UtilizationBarView = styled.div<{ width: string; animate?: boolean }>`
  position: relative;
  width: ${({ width }) => width};
  max-width: 100%;
  display: flex;
  align-items: center;
  animation: ${(props) => (props.animate ? CssAnimations.GROW_WIDTH : "none")} 1s ease-out forwards;
`;

//endregion [[ Styles ]]

//region [[ Props ]]

export interface Props {
  relativePeak?: number;
  reserved?: number;
  value: number;
  childPart?: DistributionPartInfo;
  color?: string;
  isAllPattern?: boolean;
  animate?: boolean;
  disableTooltip?: boolean;
  isLarge?: boolean;
  className?: string;
}

//endregion [[ Props ]]

export const UtilizationBar = ({
  isLarge,
  isAllPattern,
  color = Colors.NEON_BLUE,
  relativePeak,
  reserved,
  value,
  childPart,
  ...props
}: Props) => {
  const total = reserved && reserved > value ? reserved : value;
  const percentFromPeak = relativePeak ? Math.round((total / relativePeak) * 100) : 100;

  const reservedPercent = reserved && Math.round((reserved / total) * 100);
  const valuePercent = Math.round((value / total) * 100);

  const usedReservedPercent = reserved ? (reserved > value ? valuePercent : reservedPercent!) : 100;
  const restPercent = reserved && (reserved > value ? 100 - valuePercent : 100 - reservedPercent!);

  return (
    <Tooltip
      disabled={props.disableTooltip}
      ignoreBoundaries
      interactive={false}
      content={<UtilizationTooltip color={color} value={value} reserved={reserved} />}>
      <UtilizationBarView className={props.className} width={percentFromPeak + "%"} animate={props.animate}>
        {reservedPercent && <ReservedThreshold reservedPercent={reservedPercent} isLarge={isLarge} />}
        <BarsContainer barHeight={isLarge ? "20px" : "8px"}>
          <Bar color={color} width={usedReservedPercent + "%"} isPattern={isAllPattern} />
          {reserved && (
            <Bar
              color={reserved > value ? Colors.PATTENS_BLUE : color}
              width={restPercent + "%"}
              isPattern={reserved < value}
            />
          )}
          <ChildBar
            isPattern={childPart?.colorPattern}
            width={childPart ? Math.round((usedReservedPercent * childPart.value) / value) + "%" : "0%"}
            color={childPart?.color ?? color}
          />
        </BarsContainer>
      </UtilizationBarView>
    </Tooltip>
  );
};
