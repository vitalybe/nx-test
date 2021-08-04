import * as React from "react";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { loggerCreator } from "common/utils/logger";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquare } from "@fortawesome/free-solid-svg-icons";
import { CommonStyles } from "common/styling/commonStyles";
import { DateTime } from "luxon";
import { openQwiltModal } from "common/components/qwiltModal/QwiltModal";
import { RecordFinishedDialog } from "common/components/supportRecording/recordFinishedDialog/RecordFinishedDialog";
import { RecordingStyles } from "common/components/supportRecording/_styles/recordingStyles";

const moduleLogger = loggerCreator(__filename);

const SIZE_SMALL = "16px";
const SIZE_BIG = "40px";

//region [[ Styles ]]

const RecordingBarView = styled.div`
  height: ${SIZE_SMALL};
  font-weight: bold;
`;

const Bar = styled.div`
  height: 100%;
  background-color: ${RecordingStyles.COLOR_RECORDING};
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  padding-left: 0.5rem;

  color: white;
  font-size: 10px;
  align-items: center;

  transition: 0.2s ease;
  &:hover {
    height: ${SIZE_BIG};
    font-size: 12px;
  }
`;

const SessionIdPart = styled.div`
  display: flex;
`;

const Text = styled.div``;
const StopButton = styled.div`
  padding: 0 0.5rem;
  display: grid;
  grid-auto-flow: column;
  align-items: center;
  column-gap: 0.3em;
  height: 100%;

  ${CommonStyles.clickableStyle("background-color", RecordingStyles.COLOR_RECORDING, { colorFunction: "darken" })}
`;

//endregion [[ Styles ]]

//region [[ Props ]]

export interface Props {
  className?: string;
}

//endregion [[ Props ]]

export const RecordingBar = (props: Props) => {
  const displayedTime = usePassedSeconds();

  return (
    <RecordingBarView className={props.className}>
      <Bar>
        <SessionIdPart>
          <Text>Recording</Text>
        </SessionIdPart>
        <Text>({displayedTime.toFormat("mm:ss")})</Text>
        <StopButton onClick={() => onStop()}>
          <FontAwesomeIcon icon={faSquare} />
          <span>Stop</span>
        </StopButton>
      </Bar>
    </RecordingBarView>
  );
};

function onStop() {
  openQwiltModal((closeModalWithResult) => <RecordFinishedDialog onClose={closeModalWithResult} />);
}

function usePassedSeconds() {
  const [passedSeconds, setPassedSeconds] = useState(0);
  useEffect(() => {
    const intervalId = setInterval(() => setPassedSeconds((prev) => prev + 1), 1000);
    return () => {
      clearInterval(intervalId);
      setPassedSeconds(0);
    };
  }, []);

  return DateTime.fromSeconds(passedSeconds);
}
