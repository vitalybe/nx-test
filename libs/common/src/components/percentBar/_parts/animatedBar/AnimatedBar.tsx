import * as React from "react";
import styled from "styled-components";
import { CommonColors as Colors } from "common/styling/commonColors";
import { ColoredDiv } from "common/components/styled/ColoredDiv";
import { CssAnimations } from "common/styling/animations/cssAnimations";

//region [[ Styles ]]

const Bar = styled(ColoredDiv)<{
  height: string | number;
  minHeight?: string | number;
}>`
  width: 100%;
  height: ${(props) => props.height};
  min-height: ${(props) => props.minHeight ?? 0};
  flex: 0 0 auto;
  transition: 1s ease-out;
  will-change: transform;
`;

const ChildBar = styled(Bar)`
  position: absolute;
  bottom: 0;
`;

const AnimatedContainer = styled.div<{ animateToHeight: number | string }>`
  height: ${(props) => props.animateToHeight};
  width: 100%;
  animation: ${CssAnimations.GROW_HEIGHT} 1s forwards ease-out;
  will-change: transform;
  overflow-y: hidden;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
`;

const FixedContainer = styled.div<{ height: number | string }>`
  height: ${(props) => props.height};
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
`;

//endregion [[ Styles ]]

//region [[ Props ]]

export interface Props {
  totalHeight: string;
  gapHeight: string;
  barHeight: string;
  minBarHeight?: string;
  barColor: string;
  isPattern?: boolean;
  gapColor?: string;
  childPart?: {
    height: number;
    color: string;
    isPattern?: boolean;
  };
  className?: string;
}

//endregion [[ Props ]]

export const AnimatedBar = ({
  totalHeight,
  gapHeight,
  barHeight,
  minBarHeight = "1px",
  barColor,
  gapColor = Colors.ALICE_BLUE,
  childPart,
  ...props
}: Props) => {
  return (
    <FixedContainer height={totalHeight} className={props.className}>
      <AnimatedContainer animateToHeight={totalHeight}>
        {gapHeight ? <Bar height={gapHeight} color={gapColor} /> : null}
        <Bar isPattern={props.isPattern} height={barHeight} minHeight={minBarHeight} color={barColor} />
        {
          <ChildBar
            height={(childPart?.height || 0) + "px"}
            color={childPart?.color || barColor}
            isPattern={!!childPart?.height && childPart?.isPattern}
          />
        }
      </AnimatedContainer>
    </FixedContainer>
  );
};
