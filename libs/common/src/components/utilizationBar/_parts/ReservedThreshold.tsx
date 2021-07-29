import React from "react";
import styled from "styled-components";

const ReservedThresholdSvg = styled.svg<{ percent: string; isLarge?: boolean }>`
  position: absolute;
  width: ${(props) => (props.isLarge ? "4px" : "2px")};
  height: ${(props) => (props.isLarge ? "20px" : "14px")};
  left: ${({ percent }) => percent};
  line {
    stroke-width: ${(props) => (props.isLarge ? "4" : "2")};
    stroke: black;
  }
`;

interface Props {
  isLarge?: boolean;
  reservedPercent: number;
}

export function ReservedThreshold({ reservedPercent, isLarge, ...props }: Props) {
  return (
    <ReservedThresholdSvg percent={reservedPercent + "%"} isLarge={isLarge}>
      <line strokeDasharray="2, 2, 2, 2" x1="0" y1={isLarge ? "21" : "14"} x2="0" y2="0" />
    </ReservedThresholdSvg>
  );
}
