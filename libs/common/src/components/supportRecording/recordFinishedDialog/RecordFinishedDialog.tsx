import * as React from "react";
import { useRef, useState } from "react";
import { loggerCreator } from "common/utils/logger";
import { Notifier } from "common/utils/notifications/notifier";
import { RecordFinishedDialogRaw } from "common/components/supportRecording/recordFinishedDialog/recordFinishedDialogRaw/RecordFinishedDialogRaw";
import { LogRocketUtils } from "common/utils/telemetryRecording/logRocketUtils";
import { observer } from "mobx-react-lite";
import { DateTime } from "luxon";
import { CommonUrlParams } from "common/urlParams/commonUrlParams";
import { useProgressPercent } from "common/utils/hooks/useProgressPercent";

const moduleLogger = loggerCreator(__filename);

//region [[ Props ]]

export interface Props {
  onClose: () => void;

  className?: string;
}

//endregion [[ Props ]]

export type SubmissionStateType = "not-started" | "in-progress" | "finish-success" | "finish-error";

export const RecordFinishedDialog = observer((props: Props) => {
  const lastIngestDate = LogRocketUtils.instance.lastIngestDate;
  const sessionId = LogRocketUtils.instance.sessionId;
  const displayedSessionId = sessionId ? btoa(sessionId) : undefined;

  const { startSubmitRecording, submissionState, submittingProgressPercent } = useSubmittingProcess(lastIngestDate);

  return (
    <RecordFinishedDialogRaw
      displayedSessionId={displayedSessionId}
      submissionState={submissionState}
      submissionPercent={submittingProgressPercent}
      onCopySessionId={() => copySessionId(displayedSessionId)}
      onStart={() => displayedSessionId && startSubmitRecording(displayedSessionId)}
      onRecapture={recapture}
      onStop={stopRecording}
      onClose={props.onClose}
      className={props.className}
    />
  );
});

async function copySessionId(displayedSessionId: string | undefined) {
  if (displayedSessionId) {
    try {
      await navigator.clipboard.writeText(displayedSessionId);
    } catch (e) {
      Notifier.warn("Failed to copy to clipboard");
    }
  }
}

function useSubmittingProcess(lastIngestDate: DateTime | undefined) {
  const [submissionState, setSubmissionState] = useState<SubmissionStateType>("not-started");
  const submittingProgressPercent = useProgressPercent(submissionState === "in-progress");
  const dialogOpenDate = useRef(DateTime.local()).current;

  // If progressbar finishes before logrocket has finished recording, show error,
  if (submissionState === "in-progress") {
    if (lastIngestDate && +dialogOpenDate < +lastIngestDate) {
      setSubmissionState("finish-success");
    } else if (submittingProgressPercent === 100) {
      setSubmissionState("finish-error");
    }
  }

  function startSubmitRecording(sessionId: string) {
    copySessionId(sessionId);
    setSubmissionState("in-progress");
  }

  return { startSubmitRecording, submissionState, submittingProgressPercent };
}

function recapture() {
  const url = new URL(window.location.href);
  url.searchParams.set(CommonUrlParams.recordSession, "true");
  window.location.href = url.href;
}

function stopRecording() {
  const url = new URL(window.location.href);
  url.searchParams.delete(CommonUrlParams.recordSession);
  window.location.href = url.href;
}
