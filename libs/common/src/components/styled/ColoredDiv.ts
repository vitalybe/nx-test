import styled, { css } from "styled-components";
import { darken } from "polished";

export const ColoredDiv = styled.div<{ color: string; isPattern?: boolean }>`
  ${({ color, isPattern }) =>
    isPattern
      ? css`
          background: repeating-linear-gradient(
            45deg,
            ${darken(0.15, color)} 8px,
            ${darken(0.15, color)} 10px,
            ${color} 0px,
            ${color} 13px,
            ${darken(0.15, color)} 12px
          );
        `
      : css`
          background-color: ${color};
        `}
`;
