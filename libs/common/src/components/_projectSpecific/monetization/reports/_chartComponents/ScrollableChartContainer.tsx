import * as React from "react";
import { PropsWithChildren, useRef, useState } from "react";
import styled from "styled-components";
import _ from "lodash";

const leftArrowSrc = require("common/images/left-arrow.svg");
const rightArrowSrc = require("common/images/right-arrow.svg");

// region [[ Styles ]]
const ArrowImg = styled.img`
  width: 1.5rem;
  height: 1.5rem;
`;
const ChartScrollBtn = styled.button<{ isHidden?: boolean }>`
  position: absolute;
  top: 24px;
  bottom: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background-color: rgba(232, 238, 240, 0.7);
  opacity: ${(props) => (props.isHidden ? 0 : 1)};
  cursor: pointer;
  transition: 0.3s ease-in;
`;
const LeftChartScrollBtn = styled(ChartScrollBtn)<{ isHidden?: boolean }>`
  left: 24px;
`;
const RightChartScrollBtn = styled(ChartScrollBtn)<{ isHidden?: boolean }>`
  right: 0;
`;

const ChartContainerDiv = styled.div`
  overflow-x: auto;
  overflow-y: hidden;
  position: relative;
`;

// endregion

//region [[ Props ]]
export interface Props {
  className?: string;
}
//endregion

export function ScrollableChartContainer(props: PropsWithChildren<Props>) {
  const chartContainerRef = useRef<HTMLDivElement | null>(null);
  const highchartsRef = useRef<HTMLDivElement | null>(null);
  const [isChartScrollMin, setIsChartScrollMin] = useState(true);
  const [isChartScrollMax, setIsChartScrollMax] = useState(true);

  const getHighchartsElement = () => {
    return chartContainerRef.current?.querySelector(".highcharts-scrolling") as HTMLDivElement | null | undefined;
  };

  const listenToChartScroll = () => {
    const callback = _.debounce(function (this: HTMLDivElement) {
      updateBtnVisibility(this);
    }, 100);

    if (chartContainerRef.current) {
      const highchartsElement = getHighchartsElement();

      updateBtnVisibility(highchartsElement);

      if (highchartsElement && !_.isEqual(highchartsElement, highchartsRef.current)) {
        highchartsElement?.addEventListener("scroll", callback);
        highchartsRef.current = highchartsElement;
      }
    }
  };

  const scrollChartTo = (fn: (prev: number) => number) => {
    const highchartsElement = getHighchartsElement();
    if (highchartsElement) {
      highchartsElement.scrollTo({ left: fn(highchartsElement.scrollLeft), behavior: "smooth" });
    }
  };

  const updateBtnVisibility = (element: HTMLDivElement | undefined | null) => {
    if (element) {
      setIsChartScrollMin(element.scrollLeft <= 0);
      setIsChartScrollMax(element.scrollLeft + element.clientWidth >= element.scrollWidth);
    } else {
      setIsChartScrollMin(true);
      setIsChartScrollMax(true);
    }
  };

  return (
    <ChartContainerDiv
      className={props.className}
      ref={chartContainerRef}
      onMouseMove={_.throttle(listenToChartScroll, 3000)}>
      {props.children}
      <LeftChartScrollBtn onClick={() => scrollChartTo((prev) => prev - 300)} isHidden={isChartScrollMin}>
        <ArrowImg src={leftArrowSrc} alt={"left arrow"} />
      </LeftChartScrollBtn>
      <RightChartScrollBtn onClick={() => scrollChartTo((prev) => prev + 300)} isHidden={isChartScrollMax}>
        <ArrowImg src={rightArrowSrc} alt={"right arrow"} />
      </RightChartScrollBtn>
    </ChartContainerDiv>
  );
}
