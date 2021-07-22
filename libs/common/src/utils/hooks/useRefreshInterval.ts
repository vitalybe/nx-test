import { useCallback, useEffect, useRef, useState } from "react";
import { DateTime, Duration } from "luxon";
import { useEventCallback } from "common/utils/hooks/useEventCallback";

// if no refresh interval duration is passed, auto refresh interval is disabled
export function useRefreshInterval(refreshInterval?: Duration) {
  const [lastRefreshDate, setLastRefreshDate] = useState<DateTime>(DateTime.local());
  const dataRefreshInterval = useRef<number>(-1);
  const refreshIntervalMs = refreshInterval?.as("milliseconds");

  // method to trigger date refresh manually
  const refresh = useCallback(() => {
    setLastRefreshDate(DateTime.local());
  }, []);

  // interval callback
  const updateRefreshDate = useEventCallback(() => {
    const isTimeToRefresh =
      !!refreshIntervalMs && DateTime.local().valueOf() >= lastRefreshDate.valueOf() + refreshIntervalMs;
    if (document.visibilityState === "visible" && isTimeToRefresh) {
      refresh();
    }
  });

  useEffect(() => {
    if (refreshIntervalMs) {
      dataRefreshInterval.current = window.setInterval(updateRefreshDate, refreshIntervalMs);
      document.addEventListener("visibilitychange", updateRefreshDate);
    }
    return () => {
      if (dataRefreshInterval.current) {
        clearInterval(dataRefreshInterval.current);
      }
      if (refreshIntervalMs) {
        document.removeEventListener("visibilitychange", updateRefreshDate);
      }
    };
  }, [updateRefreshDate, refreshIntervalMs]);

  return { lastRefreshDate, refresh };
}
