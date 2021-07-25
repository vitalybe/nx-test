import { RefObject, useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";

const DEFAULT_ACTIVE_OPACITY = 0.2;

//this hook "listens" to HTMLElement vertical scroll changes and returns an opacity value when scroll isn't on top.
//can be used to easily create a styling effect using the styled component ScrollShadow as the affected element
export function useScrollShadow<T extends HTMLElement>(activeOpacity = DEFAULT_ACTIVE_OPACITY): [RefObject<T>, number] {
  const [opacity, setOpacity] = useState<number>(0);
  const ref = useRef<T | null>(null);

  const onScroll = useCallback(() => {
    if (ref.current) {
      if (ref.current.scrollTop !== 0) {
        if (opacity !== activeOpacity) {
          setOpacity(activeOpacity);
        }
      } else {
        setOpacity(0);
      }
    }
  }, [opacity, activeOpacity]);

  useEffect(() => {
    if (ref.current && !ref.current.onscroll) {
      ref.current.onscroll = onScroll;
    }
  }, [onScroll]);

  return [ref, opacity];
}

export const ScrollShadow = styled.div<{ boxShadowOpacity: number }>`
  box-shadow: 0 5px 9px -4px inset rgba(0, 0, 0, ${props => props.boxShadowOpacity});
  transition: 0.3s ease-in;
`;
