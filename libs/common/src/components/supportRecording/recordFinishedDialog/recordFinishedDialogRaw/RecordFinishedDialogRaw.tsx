import * as React from "react";
import styled from "styled-components";
import { loggerCreator } from "../../../../utils/logger";
import { Content, RecordingDialog } from "../../_parts/recordingDialog/RecordingDialog";
import { Button } from "../../../configuration/button/Button";
import { CommonColors } from "../../../../styling/commonColors";
import { TextTooltip } from "../../../textTooltip/TextTooltip";
import { RecordingUtils } from "../../_utils/recordingUtils";
import { LoadingSpinner } from "../../../loadingSpinner/loadingSpinner/LoadingSpinner";
import { lighten, transparentize } from "polished";
import { RecordingStyles } from "../../_styles/recordingStyles";
import { SubmissionStateType } from "../RecordFinishedDialog";

const moduleLogger = loggerCreator("__filename");

//region [[ Styles ]]

const RecordingDialogStyled = styled(RecordingDialog)`
  ${Content} {
    display: flex;
    flex-direction: column;
    padding-bottom: 2rem;
  }
`;

const SessionDetails = styled.div`
  flex: 1;

  padding: 4rem;
  text-align: center;
  display: grid;
  grid-row-gap: 2rem;
  justify-items: center;
`;

const RecordingLogo = styled.img.attrs({ src: require("../../_images/remote-recording.svg") })``;

const SessionIdContainer = styled(Button).attrs({
  backgroundColor: "#ffffff",
  colorFunction: "darken",
  textColor: "#2a536e",
})`
  border: solid 1px #e2e5e7;
  border-radius: 10px;
  padding: 2rem 4rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const SessionIdTitle = styled.div`
  font-weight: bold;
`;

const SessionId = styled.div`
  font-size: 9px;
  max-width: 300px;
  word-break: break-all;
`;

const LoadingSessionText = styled.div`
  margin-bottom: 0.5rem;
`;

const Buttons = styled.div`
  display: grid;
  grid-auto-flow: column;
  justify-items: center;
  justify-content: center;
  align-items: center;
  column-gap: 1rem;
`;

const StatusText = styled.div<{ isError: boolean }>`
  margin-top: 1rem;
  text-align: center;
  font-weight: bold;
  color: ${(props) => (props.isError ? CommonColors.QWILT_RED_DIM : "inherit")};
`;

const CancelButton = styled(Button).attrs({
  backgroundColor: RecordingStyles.COLOR_CANCEL,
  textColor: "#ffffff",
  colorFunction: "darken",
})``;

const RecordButton = styled(Button).attrs({
  backgroundColor: RecordingStyles.COLOR_RECORDING,
  disabledColor: transparentize(0.7, RecordingStyles.COLOR_RECORDING),
  textColor: "#ffffff",
  colorFunction: "darken",
})``;

const ActionButton = styled(Button).attrs({
  backgroundColor: RecordingStyles.COLOR_ACTION,
  disabledColor: transparentize(0.7, RecordingStyles.COLOR_ACTION),
  textColor: "#ffffff",
  colorFunction: "darken",
})`
  position: relative;
`;

const ProgressBar = styled.div<{ progressPercent: number; color: string }>`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;

  width: ${(props) => props.progressPercent}%;
  height: 10px;
  border-radius: 2px;
  background: repeating-linear-gradient(
    -55deg,
    ${(props) => props.color} 1px,
    ${(props) => lighten(0.15, props.color)} 2px,
    ${(props) => lighten(0.15, props.color)} 11px,
    ${(props) => props.color} 12px,
    ${(props) => props.color} 20px
  );
  transition: 0.5s ease;
`;

//endregion [[ Styles ]]

//region [[ Props ]]

export interface Props {
  displayedSessionId: string | undefined;
  submissionState: SubmissionStateType;
  submissionPercent: number;

  onCopySessionId: () => void;
  onStart: () => void;
  onRecapture: () => void;
  onStop: () => void;
  onClose: () => void;

  className?: string;
}

//endregion [[ Props ]]

export const RecordFinishedDialogRaw = (props: Props) => {
  const submissionState = props.submissionState;
  const displayedSessionId = props.displayedSessionId;

  return (
    <RecordingDialogStyled className={props.className} title={"Record Session"} onClose={props.onClose}>
      <SessionDetails>
        <RecordingLogo />
        <div>Please submit you recording and contact our support team with the following session ID.</div>
        <TextTooltip content={"Copy to Clipboard"} interactive={false} placement={"top"} disabled={!displayedSessionId}>
          <SessionIdContainer onClick={() => props.onCopySessionId()}>
            {displayedSessionId ? (
              <>
                <SessionIdTitle>Session ID</SessionIdTitle>
                <SessionId>{displayedSessionId}</SessionId>
              </>
            ) : (
              <>
                <LoadingSessionText>Getting Session ID...</LoadingSessionText>
                <LoadingSpinner shakeAnimation={true} size={10} />
              </>
            )}
          </SessionIdContainer>
        </TextTooltip>
      </SessionDetails>
      {submissionState === "finish-success" ? (
        <>
          <Buttons>
            <ActionButton onClick={() => props.onStop()}>Stop and Reload Page</ActionButton>
          </Buttons>
          <StatusText isError={false}>Recoding Submission Succeeded</StatusText>
        </>
      ) : (
        <>
          <Buttons>
            <CancelButton onClick={() => props.onStop()}>Stop Recording</CancelButton>
            <TextTooltip content={RecordingUtils.RELOAD_WARNING_SNIPPET} placement={"top"}>
              <RecordButton onClick={() => props.onRecapture()} isDisabled={submissionState === "in-progress"}>
                Recapture
              </RecordButton>
            </TextTooltip>
            <TextTooltip
              content={RecordingUtils.RELOAD_WARNING_SNIPPET}
              placement={"top"}
              disabled={!displayedSessionId}>
              <ActionButton
                isDisabled={!displayedSessionId || submissionState === "in-progress"}
                onClick={() => props.onStart()}>
                <div>{submissionState === "in-progress" ? "Submitting...." : "Submit and Copy ID"}</div>
                {submissionState === "in-progress" ? (
                  <ProgressBar progressPercent={props.submissionPercent} color={CommonColors.DODGER_BLUE} />
                ) : null}
              </ActionButton>
            </TextTooltip>
          </Buttons>
          {submissionState === "finish-error" && <StatusText isError={true}>Recoding Submission Failed</StatusText>}
        </>
      )}
    </RecordingDialogStyled>
  );
};
