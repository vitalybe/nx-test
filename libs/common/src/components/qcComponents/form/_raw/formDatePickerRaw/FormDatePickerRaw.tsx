import * as React from "react";
import { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import { loggerCreator } from "../../../../../utils/logger";
import InfiniteCalendar, {
  Calendar,
  ReactInfiniteCalendarProps,
  withDateSelection,
  withKeyboardSupport,
} from "react-infinite-calendar";
import "react-infinite-calendar/styles.css";
import { CommonColors } from "../../../../../styling/commonColors";
import { Tooltip, useTooltip } from "../../../../Tooltip";
import {
  ButtonPart,
  CalendarButtonRaw,
} from "../../../../calendar/calendarButton/calendarButtonRaw/CalendarButtonRaw";
import { DateTime } from "luxon";
import {
  FormInputContainer,
  FormInputLabel,
  HelpTextIcon,
} from "../../_parts/formInputContainer/FormInputContainer";
import { ErrorIndicationIconAbsolute } from "../../_parts/inputErrorIndication/InputErrorIndication";

const moduleLogger = loggerCreator("__filename");

//region [[ Styles ]]
const ValueSpn = styled.span`
  font-weight: 600;
  font-size: 0.75rem;
`;
const CalendarButtonRawStyled = styled(CalendarButtonRaw)`
  margin-left: auto;
  ${ButtonPart} {
    min-width: auto;
    width: 2rem;
    height: 2rem;
    padding: 0;
  }
`;
const InfiniteCalendarStyled = styled(InfiniteCalendar)<ReactInfiniteCalendarProps>`
  flex: 1;
  .Cal__Header__dateWrapper.Cal__Header__day {
    font-size: 16px;
    font-weight: bold;
  }
  .Cal__Today__root .Cal__Today__chevron {
    margin-left: 70px;
  }
`;

const FormDatePickerRawView = styled(FormInputContainer)<{ isActive: boolean; hideBorder?: boolean }>`
  border: 1px solid
    ${({ errorMessage, isActive, hideBorder }) =>
      hideBorder
        ? "transparent"
        : errorMessage
        ? CommonColors.RADICAL_RED
        : isActive
        ? CommonColors.ROYAL_BLUE
        : CommonColors.SILVER};
  padding: 0.5rem;
  border-radius: 6px;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: 200ms ease;
  flex: 1 1 auto;

  &:hover {
    border-color: ${({ hideBorder, errorMessage, isActive }) =>
      hideBorder
        ? "transparent"
        : errorMessage
        ? CommonColors.RADICAL_RED
        : isActive
        ? CommonColors.ROYAL_BLUE
        : CommonColors.GREY_CHATEAU};
  }

  ${ErrorIndicationIconAbsolute} {
    right: 2.5rem;
  }
`;

//endregion [[ Styles ]]

//region [[ Props ]]

export interface Props {
  value?: Date;
  onChange?: (date: Date) => void;
  label?: string;
  helpText?: string;
  onBlur?: () => void;
  placeholder?: string;
  defaultValue?: Date;
  error?: string;
  isDisabled?: boolean;
  hideValueText?: boolean;
  className?: string;
}

//endregion [[ Props ]]

export const FormDatePickerRaw = ({ value, defaultValue, label, onChange, ...props }: Props) => {
  const { hide, isOpen, tooltipController } = useTooltip({ matchParentWidth: true, minWidth: 300 });
  const [, setRefreshCounter] = useState(0);

  useEffect(() => {
    if (isOpen) {
      // NOTE: timeout is required to show the tooltip before the virtualized-list in the calendar starts.
      // without the timeout, the tooltip appears blank
      setTimeout(() => setRefreshCounter((prevValue) => prevValue + 1));
    }
  }, [isOpen]);

  const onDateSelected = useCallback(
    (date: Date) => {
      onChange?.(date);
      hide();
    },
    [hide, onChange]
  );

  useEffect(() => {
    if (defaultValue && !value) {
      onChange?.(defaultValue);
    }
  }, [defaultValue, onChange, value]);

  const valueText = (value && DateTime.fromJSDate(value).toFormat("MMMM dd, yyyy")) ?? props.placeholder;

  return (
    <>
      {label && (
        <FormInputLabel>
          {label}
          {props.helpText && <HelpTextIcon helpText={props.helpText} />}
        </FormInputLabel>
      )}
      <Tooltip
        tooltipController={tooltipController}
        content={
          <InfiniteCalendarStyled
            selected={value}
            width={"100%"}
            height={300}
            rowHeight={40}
            Component={withDateSelection(withKeyboardSupport(Calendar))}
            onSelect={onDateSelected}
          />
        }
        placement={"bottom"}
        ignoreBoundaries
        arrow={false}
        hideOnClick={true}
        interactive={true}
        trigger={"click"}
        autoFocus={false}
        animation={"fade"}>
        <FormDatePickerRawView
          isActive={isOpen}
          hideBorder={props.hideValueText}
          onBlur={props.onBlur}
          isDisabled={props.isDisabled}
          errorMessage={props.error}
          className={props.className}>
          {!props.hideValueText && <ValueSpn>{valueText}</ValueSpn>}
          <CalendarButtonRawStyled isHighlighted={isOpen} />
        </FormDatePickerRawView>
      </Tooltip>
    </>
  );
};
