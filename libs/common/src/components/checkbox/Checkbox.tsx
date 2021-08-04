import * as React from "react";
import { MouseEvent, MouseEventHandler, ReactNode } from "react";
import styled from "styled-components";
import { faCheck } from "@fortawesome/free-solid-svg-icons/faCheck";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CssAnimations } from "../../styling/animations/cssAnimations";
import { CommonColors } from "../../styling/commonColors";

//region [[ Styles ]]

const SemiCheckIcon = styled.span`
  font-size: 26px;
  line-height: 5px;
  animation: 300ms ${CssAnimations.FADE_SLIDE_IN} ease-in-out;
`;

const CheckboxContainer = styled.div`
  display: grid;
  grid-auto-flow: column;
  justify-content: flex-start;
  column-gap: 0.5rem;
  align-items: center;
`;

const CheckboxView = styled.div<{ borderColor: string; checkColor: string; isDisabled: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;

  width: 16px;
  height: 16px;

  background-color: ${(props) => (props.isDisabled ? CommonColors.SILVER_SAND : "transparent")};

  border: 2px solid ${(props) => props.borderColor || "black"};
  border-radius: 3px;

  cursor: ${(props) => (props.isDisabled ? "auto" : "pointer")};

  .check-icon {
    color: ${(props) => (props.isDisabled ? CommonColors.NEVADA : props.checkColor)};
    font-size: 10px;

    animation: 300ms ${CssAnimations.FADE_SLIDE_IN} ease-in-out;
  }
`;

const ChildrenContainer = styled.div<{ isDisabled: boolean }>`
  cursor: ${(props) => (props.isDisabled ? "auto" : "pointer")};
`;

//endregion

export interface CheckboxProps {
  isChecked: boolean;
  isPartialCheck?: boolean;
  children?: ReactNode;

  onClick?: MouseEventHandler<HTMLDivElement>;

  borderColor?: string;
  checkColor?: string;
  isDisabled?: boolean;

  className?: string;
}

const SemiCheck = () => <SemiCheckIcon>-</SemiCheckIcon>;

export const Checkbox = ({ ...props }: CheckboxProps) => {
  function onClick(e: MouseEvent<HTMLDivElement>) {
    if (!props.isDisabled && props.onClick) {
      props.onClick(e);
    }
  }

  return (
    <CheckboxContainer className={props.className}>
      <CheckboxView
        onClick={onClick}
        borderColor={props.borderColor || CommonColors.MATISSE}
        checkColor={props.checkColor || CommonColors.MATISSE}
        isDisabled={props.isDisabled || false}>
        {props.isChecked ? (
          <FontAwesomeIcon className={"check-icon"} icon={faCheck} />
        ) : props.isPartialCheck ? (
          <SemiCheck />
        ) : null}
      </CheckboxView>
      {props.children && (
        <ChildrenContainer isDisabled={props.isDisabled || false} onClick={onClick}>
          {props.children}
        </ChildrenContainer>
      )}
    </CheckboxContainer>
  );
};
