import * as React from "react";
import { MouseEvent } from "react";
import styled from "styled-components";
import { CommonColors } from "common/styling/commonColors";
import { darken } from "polished";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

const CloseButtonView = styled.button<{ color: string }>`
  color: ${({ color }) => color};
  transition: 0.2s ease;
  cursor: pointer;
  padding: 0;
  border: none;
  background-color: transparent;
  outline: none;

  & > .icon {
    width: 100%;
    height: 100%;
  }

  &:hover {
    color: ${({ color }) => darken(0.1, color)};
  }

  &:active {
    color: ${({ color }) => darken(0.2, color)};
  }
`;

export interface Props {
  onClick: (e: MouseEvent<HTMLButtonElement>) => void;
  color?: string;
  className?: string;
}

export const CloseButton = ({ color = CommonColors.HALF_BAKED, ...props }: Props) => {
  return (
    <CloseButtonView className={props.className} onClick={props.onClick} color={color}>
      <FontAwesomeIcon icon={faTimes} className={"icon"} />
    </CloseButtonView>
  );
};
