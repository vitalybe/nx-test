import styled from "styled-components";
import { Fonts } from "../../../../styling/fonts";

export const TooltipContentView = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.5rem;
  background-color: white;
  font-family: ${Fonts.FONT_FAMILY};
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.16);
  grid-gap: 0.1875rem;
  border-radius: 3px;
`;
export const TooltipTitle = styled.div`
  font-size: 0.625rem;
  font-weight: 600;
  opacity: 0.5;
`;
export const TooltipSubValue = styled.div`
  font-size: 0.75rem;
  font-weight: 600;
`;
export const TooltipValue = styled.div`
  font-size: 1rem;
  font-weight: 600;
`;
