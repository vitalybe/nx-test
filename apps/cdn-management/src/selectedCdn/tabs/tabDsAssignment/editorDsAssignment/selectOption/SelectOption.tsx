import * as React from "react";
import { ReactChild } from "react";
import styled, { css } from "styled-components";
import { loggerCreator } from "common/utils/logger";
import { darken } from "polished";
import { Colors } from "src/_styling/colors";
import { ValueType } from "react-select/src/types";
import { OptionProps } from "react-select/src/components/Option";

const moduleLogger = loggerCreator(__filename);

//region [[ Styles ]]

const SelectOptionView = styled.div<{ highlighted: boolean; disabled: boolean }>`
  ${(props) =>
    props.disabled
      ? css`
          opacity: 0.5;
          pointer-events: none;
        `
      : null};
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 0.7em 16px;
  background-color: ${(props) => (props.highlighted ? darken(0.2, Colors.MYSTIC_2) : "inherited")};
  &:hover {
    background-color: ${darken(0.1, Colors.MYSTIC_2)};
  }
`;

//endregion

//region [[ Props ]]

// these props are defined by the the props that React-Select works with
export interface Props<T> {
  isFocused: boolean;
  isDisabled: boolean;
  data: T;
  setValue: (value: ValueType<T, false>) => void;

  children: ReactChild[] | ReactChild;

  className?: string;
}

//endregion

//region [[ Functions ]]
//endregion

export const SelectOption = <T extends {}>({ ...props }: OptionProps<T, false>) => {
  return (
    <SelectOptionView
      className={props.className}
      disabled={props.isDisabled}
      highlighted={props.isSelected}
      onClick={() => props.setValue(props.data, "select-option")}>
      {props.children}
    </SelectOptionView>
  );
};
