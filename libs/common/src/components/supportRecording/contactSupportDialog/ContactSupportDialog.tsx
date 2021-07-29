import * as React from "react";
import styled from "styled-components";
import { loggerCreator } from "common/utils/logger";
import { Content, RecordingDialog } from "common/components/supportRecording/_parts/recordingDialog/RecordingDialog";
import { Button } from "common/components/configuration/button/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons/faEnvelope";
import { TextTooltip } from "common/components/textTooltip/TextTooltip";
import { CommonStyles } from "common/styling/commonStyles";
import { RecordingUtils } from "common/components/supportRecording/_utils/recordingUtils";
import { RecordingStyles } from "common/components/supportRecording/_styles/recordingStyles";
import { CommonUrlParams } from "common/urlParams/commonUrlParams";

const moduleLogger = loggerCreator(__filename);

//region [[ Styles ]]

const RecordingDialogStyled = styled(RecordingDialog)`
  ${Content} {
    display: flex;
    flex-direction: column;
    padding-bottom: 2rem;
  }
`;

const Main = styled.div`
  flex: 1;
  padding: 4rem 4rem;

  display: grid;
  row-gap: 2rem;
`;
const Section = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  column-gap: 2rem;
`;

const SupportLogo = styled.img.attrs({ src: require("../_images/support.svg") })``;

const EmailButton = styled.a`
  ${CommonStyles.clickableStyle("background-color", "#547494", { colorFunction: "darken" })};

  color: white;
  border-radius: 50%;
  padding: 5px;
  justify-self: start;
  width: 24px;
  height: 24px;
  grid-column: 2;
`;

const RecordingLogo = styled.img.attrs({ src: require("../_images/remote-recording.svg") })``;

const Footer = styled.div`
  display: grid;
  grid-template-columns: auto auto;
  justify-items: center;
  justify-content: center;
  column-gap: 1rem;
`;

const CancelButton = styled(Button).attrs({
  backgroundColor: RecordingStyles.COLOR_CANCEL,
  textColor: "#ffffff",
  colorFunction: "darken",
})``;

const StartButton = styled(Button).attrs({
  backgroundColor: RecordingStyles.COLOR_RECORDING,
  textColor: "#ffffff",
  colorFunction: "darken",
})``;

//endregion [[ Styles ]]

//region [[ Props ]]

export interface Props {
  onClose: () => void;
  className?: string;
}

//endregion [[ Props ]]

export const ContactSupportDialog = (props: Props) => {
  function startRecording() {
    const url = new URL(window.location.href);
    url.searchParams.set(CommonUrlParams.recordSession, "true");
    window.location.href = url.href;
  }

  return (
    <RecordingDialogStyled className={props.className} title={"Contact Support"} onClose={props.onClose}>
      <Main>
        <Section>
          <SupportLogo />
          <p>
            <b>Contact our support team!</b>
            <br />
            We are here to help you with any obstacle you encounter and you can always contact us.
          </p>
          <EmailButton href={"mailto:noc-service-case@qwilt.com"}>
            <FontAwesomeIcon icon={faEnvelope} />
          </EmailButton>
        </Section>
        <Section>
          <RecordingLogo />
          <p>
            <b>Record your session for easier communication</b>
            <br />
            Each recording is uploaded to our support team and helps us to solve your challenge as quickly as possible.
          </p>
        </Section>
      </Main>
      <Footer>
        <CancelButton onClick={props.onClose}>Cancel</CancelButton>
        <TextTooltip content={RecordingUtils.RELOAD_WARNING_SNIPPET} placement={"right"}>
          <StartButton onClick={startRecording}>Start Recording</StartButton>
        </TextTooltip>
      </Footer>
    </RecordingDialogStyled>
  );
};
