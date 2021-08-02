import * as React from "react";
import { useState } from "react";
import styled from "styled-components";
import { loggerCreator } from "../../../../utils/logger";
import { ConfigurationStyles } from "../../_styles/configurationStyles";
import { SmallTitle } from "../../_styles/configurationCommon";
import { LoadingSpinner } from "../../../loadingSpinner/loadingSpinner/LoadingSpinner";
import { Button } from "../../button/Button";

const moduleLogger = loggerCreator("__filename");

//region [[ Styles ]]

const QwiltConfirmView = styled.div`
  background: ${ConfigurationStyles.COLOR_BACKGROUND};
  box-shadow: ${ConfigurationStyles.SHADOW};
  position: relative;
  display: flex;
  min-width: 500px;
  min-height: 150px;
  z-index: 99;
  flex: 1;
  flex-direction: column;
  overflow: hidden;
  padding: 1em;
`;

const Title = styled(SmallTitle)`
  position: absolute;
  top: -5px;
  left: 5px;

  padding-top: 10px;
  z-index: 3;
  background: ${ConfigurationStyles.COLOR_BACKGROUND};
`;

const Message = styled.div`
  flex: 1;
  font-size: 1.1rem;
  height: 2rem;
  padding-top: 1rem;
  z-index: 2;
  background: ${ConfigurationStyles.COLOR_BACKGROUND};
`;

const BottomButton = styled.div`
  display: flex;
  margin-top: 1em;
  justify-content: flex-end;
`;

const ButtonStyled = styled(Button)`
  width: 100px;
  padding: 0.5em 0;
  margin-left: 1em;
`;

const Overlay = styled.div`
  z-index: 10;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(255, 255, 255, 0.9);
`;

const LoadingSpinnerStyled = styled(LoadingSpinner)`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translateX(-50%) translateY(-50%);
`;

//endregion

export interface Props {
  title: string;
  message: string;
  onOk: () => void;
  onCancel: () => void;
  // While this function is processing, a spinner is shown in the confirm box
  onOkWork?: () => Promise<unknown>;
  className?: string;
}

export const QwiltConfirm = ({ ...props }: Props) => {
  const [isProcessing, setIsProcessing] = useState(false);

  function onCancel() {
    props.onCancel();
  }

  async function onOk() {
    if (props.onOkWork) {
      setIsProcessing(true);
      await props.onOkWork();
      setIsProcessing(false);
    }

    props.onOk();
  }

  return (
    <QwiltConfirmView className={props.className}>
      <Title>{props.title}</Title>
      <Message>{breakTextToLines(props.message)}</Message>
      <BottomButton>
        <ButtonStyled buttonAttributes={{ type: "button" }} onClick={onCancel}>
          {"No"}
        </ButtonStyled>
        <ButtonStyled buttonAttributes={{ type: "submit" }} onClick={onOk}>
          {"Yes"}
        </ButtonStyled>
      </BottomButton>
      {isProcessing && (
        <Overlay>
          <LoadingSpinnerStyled />
        </Overlay>
      )}
    </QwiltConfirmView>
  );
};

//region [[ Functions ]]
function breakTextToLines(content: string) {
  return content.split("\n").map(function (item, key) {
    return (
      <span key={key}>
        {item}
        <br />
      </span>
    );
  });
}
//endregion [[ Functions ]]
