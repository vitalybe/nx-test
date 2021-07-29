import * as React from "react";
import styled, { css } from "styled-components";
import { CommonColors as Colors } from "common/styling/commonColors";
import { TextTooltip } from "common/components/textTooltip/TextTooltip";

//region [[ Styles ]]

export const Option = styled.span<{ isSelected: boolean }>`
  color: ${(props) => (props.isSelected ? "white" : Colors.NERO)};
  &:focus {
    outline: none;
  }
  &:hover {
    color: ${(props) => (props.isSelected ? "white" : Colors.BLACK_PEARL)};
    background-color: ${(props) => (props.isSelected ? Colors.ROYAL_BLUE : Colors.PATTENS_BLUE)};
    opacity: 1;
  }
  // in case of svg icon as content of a toggle option
  svg path {
    fill: ${(props) => (props.isSelected ? "white" : Colors.NERO)};
  }
  padding: 0.5rem 1.125rem;
  opacity: ${(props) => (props.isSelected ? 1 : 0.5)};
  background-color: ${(props) => (props.isSelected ? Colors.ROYAL_BLUE : "transparent")};
  ${(props) =>
    props.isSelected
      ? css`
          box-shadow: 0 0.125rem 0.75rem 0 rgba(0, 0, 0, 0.12);
        `
      : ""};
  border-radius: 1rem;
  transition: 100ms ease-in;
`;

const GroupByToggleView = styled.div<{}>`
  position: relative;
  display: flex;
  align-items: center;
  span {
    font-size: 0.75rem;
    font-weight: 600;
    margin: 0 0.25rem;
    cursor: pointer;
  }
`;

//endregion [[ Styles ]]

//region [[ Props ]]
interface ToggleOptionSettings<T = string> {
  label?: T;
  icon?: JSX.Element;
  tooltip?: string;
}
export interface BooleanToggleOptions<T = string> {
  id?: string;
  label?: string;
  onChange?: (value: boolean) => void;
  className?: string;
  falseOption: ToggleOptionSettings<T>;
  trueOption: ToggleOptionSettings<T>;
}
export interface Props {
  current: boolean | undefined;
  className?: string;
  options: BooleanToggleOptions;
}

//endregion [[ Props ]]

export function BooleanToggle({ options, current, ...props }: Props) {
  const { label, onChange } = options;
  const oppositeValue = !current;
  const clickHandler = (value: boolean) => () => onChange?.(value);
  return (
    <GroupByToggleView className={`${options.className || ""} ${props.className}`}>
      {label && <span onClick={clickHandler(oppositeValue)}>{label}:</span>}
      <TextTooltip content={options.falseOption.tooltip ?? ""} disabled={!options.falseOption.tooltip} delay={400}>
        <Option isSelected={current === false} onClick={clickHandler(false)}>
          {options.falseOption.icon} {options.falseOption.label}
        </Option>
      </TextTooltip>
      <TextTooltip content={options.trueOption.tooltip ?? ""} disabled={!options.trueOption.tooltip} delay={400}>
        <Option isSelected={current === true} onClick={clickHandler(true)}>
          {options.trueOption.icon} {options.trueOption.label}
        </Option>
      </TextTooltip>
    </GroupByToggleView>
  );
}
