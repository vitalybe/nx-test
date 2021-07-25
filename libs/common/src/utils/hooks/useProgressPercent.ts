import { useEffect, useRef, useState } from "react";
import { Duration } from "luxon";

const STARTING_PERCENT = 10;

export function useProgressPercent(
  isInProgress: boolean,
  loadingTimeLimit: Duration = Duration.fromObject({ seconds: 300 }),
  onFinish?: () => void,
  initialProgress: number = 0
) {
  const [progressPercent, setProgressPercent] = useState(initialProgress);
  const timeLimitSeconds = loadingTimeLimit.as("seconds");
  const isMountedRef = useRef(false);
  const isFinishedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    let intervalId = 0;
    if (isInProgress) {
      if (isFinishedRef.current) {
        isFinishedRef.current = false;
      }
      intervalId = window?.setInterval(() => {
        if (isMountedRef.current) {
          setProgressPercent(prev => {
            let newPercent = prev + (100 - STARTING_PERCENT) / timeLimitSeconds;
            if (newPercent > 100) {
              newPercent = 100;
              clearInterval(intervalId);
              intervalId = 0;
            }

            return newPercent;
          });
        }
      }, 1000);
    } else if (!isFinishedRef.current) {
      setProgressPercent(100);
      setTimeout(() => {
        if (isMountedRef.current) {
          setProgressPercent(initialProgress);
          isFinishedRef.current = true;
          onFinish?.();
        }
      }, 1000);
    }
    return () => clearInterval(intervalId);
  }, [onFinish, isInProgress, timeLimitSeconds, initialProgress]);

  return isInProgress || progressPercent === 100 ? progressPercent : 0;
}
