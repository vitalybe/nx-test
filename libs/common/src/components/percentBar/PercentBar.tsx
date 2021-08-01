import * as React from "react";
import { memo, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { Utils } from "../../utils/utils";
import { CommonColors as Colors } from "../../styling/commonColors";
import { DistributionPartInfo } from "../distributionBars/DistributionBars";
import { CssAnimations } from "../../styling/animations/cssAnimations";
import { TextValues } from "./_parts/textValues/TextValues";
import { AnimatedBar } from "./_parts/animatedBar/AnimatedBar";

//region [[ Styles ]]
const Threshold = styled.svg`
  position: absolute;
  width: calc(100% + 14px);
  bottom: 0;
  display: flex;
  overflow: visible;
  opacity: 0;
  animation: ${CssAnimations.FADE_SLIDE_IN} 1s forwards;
  animation-delay: 1s;

  line {
    stroke-width: 1;
    stroke: black;
  }
  text {
    font-size: 10px;
    color: ${Colors.BLUE_WHALE};
    text-transform: capitalize;
  }
`;

const AbsoluteContainer = styled.div`
  position: absolute;
  bottom: -20px;
  width: max-content;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Label = styled.span`
  color: ${Colors.BLUE_LAGOON};
  text-transform: uppercase;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0;
`;

export const PercentBarView = styled.div<{ marginLeft: number }>`
  position: relative;
  padding: 0;
  margin: 0 9px 0 ${(props) => props.marginLeft + "px"};
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1 1;
`;

//endregion

export interface Props extends DistributionPartInfo {
  total: number;
  maxSiblingValue: number;

  className?: string;
}

export const PercentBar = memo(
  ({ childPart, value, unit, label, color, maxSiblingValue, threshold, ...props }: Props) => {
    const percentOfMaxSibling = Utils.calcPercent(value, maxSiblingValue);
    const percentOfThreshold = threshold && Utils.calcPercent(value, threshold.value);

    const maxSvgHeight = 100;
    const maxGapHeight = 135;
    const barHeight = maxSvgHeight * (percentOfMaxSibling / 100);
    const gapHeight = threshold
      ? Math.min((barHeight / percentOfThreshold!) * (100 - percentOfThreshold!), maxGapHeight)
      : 0;

    const thresholdTextSvgRef = useRef<SVGTextElement | null>(null);
    const [thresholdTextWidth, setThresholdTextX] = useState<number | undefined>(undefined);

    useEffect(() => {
      if (thresholdTextSvgRef.current) {
        setThresholdTextX(thresholdTextSvgRef.current.getBoundingClientRect().width + 2);
      }
    }, []);

    const totalBarHeight = (gapHeight || 0) + barHeight + "px";

    const childPartHeight = (childPart && Math.round((barHeight * childPart.value) / value)) || 0;
    return (
      <PercentBarView className={props.className} marginLeft={thresholdTextWidth || 9}>
        <TextValues
          value={childPart?.value ?? value}
          percent={Utils.calcPercent(childPart?.value ?? value, props.total)}
          unit={unit}
          thresholdValue={threshold?.value}
          containerValue={childPart && value}
          color={childPart?.color || color}
        />
        <AnimatedBar
          barHeight={barHeight + "px"}
          barColor={color}
          isPattern={props.colorPattern}
          gapHeight={gapHeight + "px"}
          totalHeight={totalBarHeight}
          childPart={
            childPart && {
              height: childPartHeight,
              color: childPart.color,
              isPattern: childPart.colorPattern,
            }
          }
        />
        {threshold && (
          <Threshold height={barHeight + gapHeight}>
            <text ref={thresholdTextSvgRef} y="3" x={thresholdTextWidth ? "-" + thresholdTextWidth : 0}>
              {threshold.label}
            </text>
            <line strokeDasharray="5" x1="0" y1="0" x2="100%" y2="0" />
          </Threshold>
        )}
        <AbsoluteContainer>
          <Label>{label}</Label>
        </AbsoluteContainer>
      </PercentBarView>
    );
  }
);
