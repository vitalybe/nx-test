import * as React from "react";
import { useRef, useState } from "react";
import styled, { FlattenSimpleInterpolation as StyledCSS } from "styled-components";
import { Instance } from "tippy.js";
import { DateTime, Duration, Interval } from "luxon";
import { CalendarButtonRaw } from "common/components/calendar/calendarButton/calendarButtonRaw/CalendarButtonRaw";
import { QwiltCalendar } from "common/components/calendar/calendarButton/qwiltCalendar/QwiltCalendar";
import { loggerCreator } from "common/utils/logger";
import { Tooltip } from "common/components/Tooltip";

const moduleLogger = loggerCreator(__filename);

//region [[ Styles ]]

const CalendarButtonView = styled.div<{}>``;

const CalendarContainer = styled.div`
  width: 18.75rem;
  max-height: 32.5rem;
`;

//endregion [[ Styles ]]

//region [[ Props ]]

export interface Props {
  selectedInterval: Interval | undefined;
  storedInterval?: Interval | undefined;
  onIntervalSelected: (interval: Interval) => void;
  onIntervalCleared: () => void;
  customButtonStyles?: StyledCSS;
  className?: string;
}

//endregion [[ Props ]]

export const CalendarButton = (props: Props) => {
  const tippyRef = useRef<Instance>();
  const [, setRefreshCounter] = useState(0);

  function onTippyShow(tippyInstance: Instance) {
    tippyRef.current = tippyInstance;
    // NOTE: timeout is required to show the tooltip before the virtualized-list in the calendar starts.
    // without the timeout, the tooltip appears blank
    setTimeout(() => setRefreshCounter((prevValue) => prevValue + 1), 50);
    // NOTE 2: This is a hack, but in some cases too small amount (50) is not enough, but if it is too large (200)
    // then user waits too long before he sees the calendar
    setTimeout(() => setRefreshCounter((prevValue) => prevValue + 1), 100);
  }

  function onTippyHide() {
    tippyRef.current = undefined;
  }

  function onDateChosen(interval: Interval) {
    tippyRef.current?.hide();
    // converting end of the day to the start of next day to be set as (00:00) for more accurate data querying
    let endDateTime = interval.end.plus(Duration.fromObject({ days: 1 })).startOf("day");
    if (endDateTime.toMillis() > DateTime.local().toMillis()) {
      endDateTime = DateTime.local();
    }
    props.onIntervalSelected(Interval.fromDateTimes(interval.start.startOf("day"), endDateTime));
  }

  function onCancelForm() {
    tippyRef.current?.hide();
  }
  function onDateCleared() {
    props.onIntervalCleared();
  }

  let isHighlighted = false;
  let intervalText = "";
  const intervalData = props.selectedInterval || props.storedInterval;
  const uiInterval = intervalData && adjustIntervalToUi(intervalData);
  // NOTE: Currently we show calendar button highlighted even if not a whole day is selected
  if (props.selectedInterval) {
    isHighlighted = true;
  }
  if (uiInterval) {
    intervalText = intervalToString(uiInterval);
  }
  return (
    <CalendarButtonView className={props.className}>
      <Tooltip
        content={
          <CalendarContainer>
            <QwiltCalendar selectedInterval={uiInterval} onSubmit={onDateChosen} onCancel={onCancelForm} />
          </CalendarContainer>
        }
        placement={"bottom-end"}
        hideOnClick={true}
        interactive={true}
        trigger={"click"}
        autoFocus={false}
        animation={"fade"}
        onShow={onTippyShow}
        onHide={onTippyHide}>
        <CalendarButtonRaw
          isHighlighted={isHighlighted}
          label={intervalText}
          onClear={onDateCleared}
          customStyles={props.customButtonStyles}
        />
      </Tooltip>
    </CalendarButtonView>
  );
};

export function intervalToString(interval: Interval) {
  let intervalText = "";

  const format = "d MMM yyyy";
  const startText = interval.start.toFormat(format);
  const endText = interval.end.toFormat(format);
  intervalText = startText;
  if (startText !== endText) {
    intervalText += ` - ${endText}`;
  }

  return intervalText;
}

function adjustIntervalToUi(interval: Interval): Interval {
  // we need to treat 00:00 as the end of the last day instead of the start of the next one
  const endDate = interval.end.equals(interval.end.startOf("day"))
    ? interval.end.minus(Duration.fromObject({ days: 1 })).endOf("day")
    : interval.end;
  return Interval.fromDateTimes(interval.start, endDate);
}
