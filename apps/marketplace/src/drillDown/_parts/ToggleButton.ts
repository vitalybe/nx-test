import styled, { css } from "styled-components";
import { Colors } from "src/_styling/colors";

export const ToggleButton = styled.button`
  ${(props: { isSelected: boolean }) => css`
    padding: 6px 12px;
    flex: 0 0 fit-content;
    border-radius: 12px;
    border: none;
    align-items: center;
    color: white;
    opacity: ${props.isSelected ? 1 : 0.5};
    background-color: ${Colors.NAVY_8};
    ${!props.isSelected &&
      css`
        background-color: transparent;
      `};
    text-transform: uppercase;
    cursor: pointer;
    transition: 0.2s ease-out;
    &:hover {
      opacity: ${props.isSelected ? 1 : 0.7};
    }
  `};
`;
