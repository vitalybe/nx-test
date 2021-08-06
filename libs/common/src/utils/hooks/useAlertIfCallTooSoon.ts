import { loggerCreator } from "../logger";
import { DependencyList, useEffect, useRef } from "react";

const moduleLogger = loggerCreator("__filename");

export function useAlertIfCallTooSoon(
  alert: string,
  dependencies: DependencyList,
  allowedTimeBetweenAlertsMs: number = 500
) {
  const lastAlertTimeMsRef = useRef(0);

  useEffect(() => {
    if (lastAlertTimeMsRef.current > 0) {
      const currentTimeMs = new Date().valueOf();
      const msPassed = currentTimeMs - lastAlertTimeMsRef.current;
      if (msPassed < allowedTimeBetweenAlertsMs) {
        moduleLogger.warn(`Too little time (${msPassed}ms) passed between renders: ${alert}`);
      } else {
        moduleLogger.debug(`Time passed between renders: ${msPassed}ms`);
      }
    }

    lastAlertTimeMsRef.current = new Date().valueOf();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [alert, allowedTimeBetweenAlertsMs, ...dependencies]);
}
