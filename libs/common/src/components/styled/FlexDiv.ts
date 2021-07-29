import styled, { css } from "styled-components";

export type FlexDivProps = {
  align?: "center";
  justify?: "center" | "flex-start" | "flex-end";
  direction?: "column" | "row";
};

export const FlexDiv = styled.div`
  ${(props: FlexDivProps) => css`
    display: flex;
    justify-content: ${props.justify};
    align-items: ${props.align};
    flex-direction: ${props.direction};
  `};
`;
