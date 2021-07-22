import { DateTime, Duration, Interval } from "luxon";
import { useState } from "react";
import { UrlStore } from "../../../stores/urlStore/urlStore";
import { CommonUrlParams } from "../../../urlParams/commonUrlParams";

const urlStore = UrlStore.getInstance<CommonUrlParams>();

function getInitialTimeframe(defaultTimeframe: Interval | Duration) {
  const durationIso = urlStore.getParam(CommonUrlParams.duration);
  const fromDateMillis = urlStore.getNumberParam(CommonUrlParams.fromTimestamp);
  const toDateMillis = urlStore.getNumberParam(CommonUrlParams.toTimestamp);

  if (durationIso) {
    return Duration.fromISO(durationIso);
  } else if (fromDateMillis && toDateMillis) {
    return Interval.fromDateTimes(DateTime.fromMillis(fromDateMillis), DateTime.fromMillis(toDateMillis));
  } else {
    return defaultTimeframe;
  }
}

function getInitialDuration(defaultTimeframe: Interval | Duration) {
  const initialValue = getInitialTimeframe(defaultTimeframe);
  return initialValue instanceof Duration ? initialValue : undefined;
}

function getInitialInterval(defaultTimeframe: Interval | Duration) {
  const initialValue = getInitialTimeframe(defaultTimeframe);
  return initialValue instanceof Interval ? initialValue : undefined;
}

export function useSelectedTimeframe(defaultTimeframe: Interval | Duration) {
  const [selectedDuration, setSelectedDuration] = useState<Duration | undefined>(getInitialDuration(defaultTimeframe));
  const [selectedInterval, setSelectedInterval] = useState<Interval | undefined>(getInitialInterval(defaultTimeframe));
  // we want to allow saving a custom interval
  const [lastSelectedInterval, setLastSelectedInterval] = useState<Interval>();

  const setTimeframe = (time: Duration | Interval) => {
    if (time instanceof Duration) {
      clearIntervalParams();
      urlStore.setParam(CommonUrlParams.duration, time.toISO());
      setSelectedDuration(time);
      setLastSelectedInterval(selectedInterval);
      setSelectedInterval(undefined);
    } else {
      clearDurationParams();
      urlStore.setNumberParam(CommonUrlParams.fromTimestamp, time.start.toMillis());
      urlStore.setNumberParam(CommonUrlParams.toTimestamp, time.end.toMillis());
      setSelectedDuration(undefined);
      setSelectedInterval(time);
    }
  };

  const clearTimeframe = () => {
    clearDurationParams();
    clearIntervalParams();
    if (defaultTimeframe instanceof Duration) {
      setSelectedDuration(defaultTimeframe);
      setSelectedInterval(undefined);
    } else {
      setSelectedDuration(undefined);
      setSelectedInterval(defaultTimeframe);
    }
    setLastSelectedInterval(undefined);
  };

  return { selectedDuration, selectedInterval, lastSelectedInterval, setTimeframe, clearTimeframe };
}

function clearDurationParams() {
  if (urlStore.getParamExists(CommonUrlParams.duration)) {
    urlStore.removeParam(CommonUrlParams.duration);
  }
}
function clearIntervalParams() {
  if (urlStore.getParamExists(CommonUrlParams.fromTimestamp)) {
    urlStore.removeParam(CommonUrlParams.fromTimestamp);
  }
  if (urlStore.getParamExists(CommonUrlParams.toTimestamp)) {
    urlStore.removeParam(CommonUrlParams.toTimestamp);
  }
}
