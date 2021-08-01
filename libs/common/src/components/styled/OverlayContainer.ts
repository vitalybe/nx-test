import styled, { css } from "styled-components";

export const OverlayContainer = styled.div<{ isAbsolute?: boolean; bgColor?: string }>`
  position: ${props => (props.isAbsolute ? "absolute" : "relative")};
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  ${props =>
    props.bgColor === "transparent"
      ? ""
      : css`
          bottom: 0;
          height: 100%;
        `};
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9;
  background-color: ${props => props.bgColor || "white"};
`;
