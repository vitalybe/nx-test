import styled from "styled-components";

interface CellProps {
  direction?: "column" | "row";
  align?: string;
  justify?: string;
  fontWeight?: number;
  lineHeight?: string;
}
export const Cell = styled.div<CellProps>`
  display: flex;
  padding: 2px;
  height: 100%;
  color: #133049cf;
  span:not(:first-child) {
    margin-left: 8px;
  }

  align-items: ${({ align = "center" }) => align};
  justify-content: ${({ justify = "flex-start" }) => justify};
  flex-direction: ${({ direction = "row" }) => direction};
  font-weight: ${({ fontWeight = 500 }) => fontWeight};
  line-height: ${({ lineHeight = "inherit" }) => lineHeight};

  transition: color 300ms ease-out;
`;
