import * as React from "react";
import { useRef } from "react";
import styled from "styled-components";
import InfiniteCalendar, { Calendar, RangedSelection, withKeyboardSupport, withRange } from "react-infinite-calendar";
import "react-infinite-calendar/styles.css";
import { DateTime, Interval } from "luxon";
import { ConfigurationStyles } from "common/components/configuration/_styles/configurationStyles";
import { Clickable } from "common/components/configuration/clickable/Clickable";
import { loggerCreator } from "common/utils/logger";
import { CommonColors } from "common/styling/commonColors";
import { Button } from "common/components/configuration/button/Button";

const moduleLogger = loggerCreator(__filename);

//region [[ Styles ]]

const QwiltCalendarView = styled.div<{}>`
  display: flex;
  flex-direction: column;
  box-shadow: ${ConfigurationStyles.SHADOW};
`;

const InfiniteCalendarStyled = styled(InfiniteCalendar)<{}>`
  flex: 1;
  .Cal__Header__dateWrapper.Cal__Header__day {
    font-size: 16px;
    font-weight: bold;
  }
`;

const Footer = styled.div<{}>`
  display: flex;
  justify-content: space-between;
  padding: 1.5em 1em;
  font-size: 0.75rem;
  font-weight: bold;
  align-items: center;
`;

const Clear = styled(Clickable).attrs({
  textColor: CommonColors.NOBEL,
  colorFunction: "darken",
})``;

const Submit = styled(Button).attrs({
  textColor: CommonColors.WHITE,
  backgroundColor: CommonColors.ROYAL_BLUE,
  colorFunction: "darken",
})``;

//endregion [[ Styles ]]

//region [[ Props ]]

export interface Props {
  selectedInterval?: Interval;
  onSubmit: (selectedInterval: Interval) => void;
  onCancel: () => void;

  className?: string;
}

//endregion [[ Props ]]

export const QwiltCalendar = (props: Props) => {
  const maxDate = DateTime.local();

  const selectedIntervalRef = useRef(
    props.selectedInterval ?? Interval.fromDateTimes(DateTime.local(), DateTime.local())
  );

  function onInfiniteCalendarSelect(rangedDate: RangedSelection) {
    const endTime = DateTime.min(maxDate, DateTime.fromJSDate(rangedDate.end));
    selectedIntervalRef.current = Interval.fromDateTimes(rangedDate.start, endTime);
  }

  return (
    <QwiltCalendarView className={props.className}>
      <InfiniteCalendarStyled
        selected={{
          start: props.selectedInterval?.start.toJSDate() ?? new Date(),
          end: props.selectedInterval?.end.toJSDate() ?? new Date(),
        }}
        maxDate={maxDate.toJSDate()}
        width={300}
        height={300}
        rowHeight={40}
        Component={withRange(withKeyboardSupport(Calendar))}
        onSelect={onInfiniteCalendarSelect}
      />
      <Footer>
        <Clear onClick={() => props.onCancel()}>Cancel</Clear>
        <Submit onClick={() => props.onSubmit(selectedIntervalRef.current)}>SUBMIT</Submit>
      </Footer>
    </QwiltCalendarView>
  );
};
