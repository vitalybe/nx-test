import { loggerCreator } from "../../../../../utils/logger";
import * as React from "react";
import { ReactChild, useEffect, useRef } from "react";
import { OptionProps } from "react-select/src/components/Option";
import scrollIntoView from "scroll-into-view-if-needed";
import styled, { css } from "styled-components";
import { CommonColors } from "../../../../../styling/commonColors";
import { darken } from "polished";

const moduleLogger = loggerCreator("__filename");

//region [[ Styles ]]

const SelectOptionView = styled.div<{ disabled: boolean; isFocused: boolean }>`
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

  ${(props) =>
    props.isFocused &&
    css`
      background-color: ${darken(0.2, CommonColors.MYSTIC_2)};
    `}
`;

//endregion

//region [[ Props ]]

// these props are defined by the the props that React-Select works with
export interface Props<T> extends OptionProps<T, false> {
  isFocused: boolean;
  isDisabled: boolean;
  data: T;

  children: ReactChild[] | ReactChild;

  className?: string;
}

//endregion

//region [[ Functions ]]
//endregion

export const SelectOption = <T extends {}>(props: Props<T>) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (props.isFocused && ref.current) {
      scrollIntoView(ref.current, {
        scrollMode: "if-needed",
        block: "nearest",
        inline: "nearest",
      });
    }
  }, [props.isFocused]);

  return (
    <SelectOptionView
      {...props.innerProps}
      className={props.className}
      ref={ref}
      disabled={props.isDisabled}
      isFocused={props.isFocused}
      onClick={() => props.setValue(props.data, "select-option")}>
      {props.children}
    </SelectOptionView>
  );
};
