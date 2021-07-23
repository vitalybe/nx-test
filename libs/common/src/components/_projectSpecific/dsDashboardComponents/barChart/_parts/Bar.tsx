import * as React from "react";
import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { CommonColors as Colors } from "../../../../../styling/commonColors";
import { BARS_GROUP_MAX_WIDTH } from "./BarsGroup";

//region [[ Styles ]]
export const BarView = styled.div<{
  color?: string;
  height: string;
  isHighlighted?: boolean;
  maxWidth?: number;
  isParent?: boolean;
  margin?: number;
}>`
  position: relative;
  background-color: ${({ isHighlighted, color }) => (isHighlighted && color ? color : Colors.PATTENS_BLUE)};
  height: ${(props) => props.height};
  flex: 1 1 auto;
  max-width: ${({ maxWidth }) => (maxWidth || BARS_GROUP_MAX_WIDTH) + "px"};
  min-width: ${({ isParent }) => (isParent ? "4px" : "2px")};
  margin: ${({ margin }) => (margin ? `0 ${margin}px` : "0 3px")};
  border-radius: 6px 6px 0 0;
  transition: 200ms ease-out, height 400ms ease-out;
  will-change: transform;
  border: 1px solid white;
  border-bottom-color: transparent;
  &:hover {
    background-color: ${({ color }) => color || Colors.PATTENS_BLUE};
    z-index: 1;
  }
  &:focus {
    outline: none;
  }
`;
//endregion [[ Styles ]]

//region [[ Props ]]
export interface Props {
  value: number;
  percentOfTotal?: number;
  max: number;
  color?: string;
  isHighlighted?: boolean;
  maxWidth?: number;
  isParent?: boolean;
  margin?: number;
  topLabelComponent?: JSX.Element;
  className?: string;
}
//endregion [[ Props ]]

export function Bar({ value, color, max, isHighlighted, percentOfTotal, topLabelComponent, ...props }: Props) {
  const percent = percentOfTotal ? percentOfTotal : (value / max) * 100;
  const isMountedRef = useRef(false);
  const [barHeight, setBarHeight] = useState("0");

  useEffect(() => {
    const nextBarHeight = Math.min(percent, 100).toFixed(0) + "%";
    if (!isMountedRef.current) {
      isMountedRef.current = true;
      setTimeout(() => {
        if (isMountedRef.current) {
          setBarHeight(nextBarHeight);
        }
      });
    } else {
      setBarHeight(nextBarHeight);
    }
    return () => {
      isMountedRef.current = false;
    };
  }, [percent]);

  return (
    <BarView
      className={props.className}
      height={barHeight}
      maxWidth={props.maxWidth}
      isParent={props.isParent}
      margin={props.margin}
      isHighlighted={isHighlighted}
      color={color}>
      {topLabelComponent}
    </BarView>
  );
}
