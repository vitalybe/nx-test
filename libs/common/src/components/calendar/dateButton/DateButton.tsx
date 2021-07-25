import * as React from "react";
import styled from "styled-components";
import { loggerCreator } from "common/utils/logger";
import { Duration } from "luxon";
import { CommonStyles } from "common/styling/commonStyles";
import { transparentize } from "polished";
import { CommonColors } from "common/styling/commonColors";
import { CalendarStyles } from "common/components/calendar/_calendarStyles";

const moduleLogger = loggerCreator(__filename);

//region [[ Styles ]]

const DateButtonView = styled.div<{ isHighlighted: boolean }>`
  padding: 0.7em;
  width: ${CalendarStyles.DURATION_BUTTON_WIDTH};
  text-align: center;
  border-radius: 16px;
  color: ${(props) => (props.isHighlighted ? CommonColors.WHITE : CommonColors.ROYAL_BLUE)};
  display: flex;
  align-items: center;
  justify-content: center;
  ${(props) => {
    return CommonStyles.clickableSelectableStyle(
      "background-color",
      CommonColors.ROYAL_BLUE,
      CommonColors.WHITE,
      props.isHighlighted,
      {
        hoverColor: transparentize(0.8, CommonColors.ROYAL_BLUE),
        activeColor: transparentize(0.7, CommonColors.ROYAL_BLUE),
      }
    );
  }}
`;

//endregion [[ Styles ]]

//region [[ Props ]]

export interface Props {
  text: string;
  duration: Duration;
  currentDuration: Duration | undefined;
  onClick: (duration: Duration) => void;

  className?: string;
}

//endregion [[ Props ]]

export const DateButton = ({ ...props }: Props) => {
  const buttonDurationValue = props.duration.valueOf();
  const chartsDurationValue = props.currentDuration && props.currentDuration.valueOf();
  const isHighlighted = buttonDurationValue === chartsDurationValue;

  return (
    <DateButtonView
      className={props.className}
      isHighlighted={isHighlighted}
      onClick={() => props.onClick(props.duration)}>
      {props.text}
    </DateButtonView>
  );
};
