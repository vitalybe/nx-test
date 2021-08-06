import * as React from "react";
import { memo, useEffect, useRef, useState } from "react";
import { NativeAnimations } from "../../../styling/animations/nativeAnimations";
import styled from "styled-components";

const Svg = styled.svg<{ disableHeightTransition?: boolean }>`
  will-change: transform;
  transition: ${(props) => (props.disableHeightTransition ? "none" : "height 1s ease-in")};
`;

export interface Props {
  svgHeight: number;
  svgWidth: number | string;
  barHeight: number;

  minHeight?: number;
  shouldAnimate?: boolean;
  transitionDelay?: number;
  disableSvgHeightTransition?: boolean;
  color: string;
  className?: string;
}

export const BarSvg = memo(
  ({ svgHeight, svgWidth, barHeight, minHeight = 0, color, shouldAnimate, transitionDelay, ...props }: Props) => {
    const [currentBarHeight, setCurrentBarHeight] = useState(minHeight);

    const allowedBarHeight = Math.max(currentBarHeight, minHeight);
    const allowedSvgHeight = Math.max(svgHeight, minHeight);

    // On mount only effect
    const isMountedRef = useRef(true);
    useEffect(() => {
      return () => {
        isMountedRef.current = false;
      };
    }, []);

    function animate() {
      if (isMountedRef.current && barHeight > minHeight) {
        NativeAnimations.runValues(currentBarHeight, barHeight - currentBarHeight, 1000, (nextValue) => {
          if (isMountedRef.current) {
            setCurrentBarHeight(nextValue);
          }
        });
      }
    }
    useEffect(() => {
      if (shouldAnimate) {
        if (transitionDelay) {
          setTimeout(animate, transitionDelay);
        } else {
          animate();
        }
      } else {
        setCurrentBarHeight(barHeight);
      }
      // currentBarHeight is being set inside a callback, can't depend on it
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [minHeight, barHeight, shouldAnimate]);

    return (
      <Svg height={allowedSvgHeight} width={svgWidth} disableHeightTransition={props.disableSvgHeightTransition}>
        <rect
          className={props.className}
          fill={color}
          width={"100%"}
          height={allowedBarHeight}
          y={allowedSvgHeight - allowedBarHeight}
        />
      </Svg>
    );
  }
);
