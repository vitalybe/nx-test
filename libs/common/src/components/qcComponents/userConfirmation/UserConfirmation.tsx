import * as React from "react";
import { ReactNode, useEffect, useState } from "react";
import styled from "styled-components";
import { loggerCreator } from "common/utils/logger";
import { AsyncQcButton } from "common/components/qcComponents/asyncQcButton/AsyncQcButton";
import { QcButton } from "common/components/qcComponents/_styled/qcButton/QcButton";
import { Notifier } from "common/utils/notifications/notifier";
import { AlertIcon } from "common/components/qcComponents/_styled/styledIcons";
import { QcButtonTheme } from "common/components/qcComponents/_styled/qcButton/_themes";

const moduleLogger = loggerCreator(__filename);

//region [[ Styles ]]

const CancelButton = styled(QcButton)`
  padding: 0.75rem 1rem;
  height: fit-content;
`;

const MessageContainer = styled.div``;
const IconContainer = styled.div`
  margin-right: 1.5rem;
`;

const Content = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
`;

const Controls = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-auto-flow: column;
  grid-gap: 0.5rem;
  justify-items: flex-end;
  margin-top: auto;
`;

const UserConfirmationView = styled.div`
  width: 30rem;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
`;

//endregion [[ Styles ]]

//region [[ Props ]]

export interface Props {
  icon?: ReactNode;
  message: ReactNode;
  confirmText?: ReactNode;
  closeText?: ReactNode;
  controlsTheme?: QcButtonTheme;
  closeFn: () => void;
  asyncConfirmWork?: () => Promise<unknown>;
  onAsyncFailure?: (e: Error) => void;
  confirmFn?: () => void;
  className?: string;
}

//endregion [[ Props ]]

export const UserConfirmation = ({ confirmFn, closeFn, ...props }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [isError, setIsError] = useState(false);

  const onAsyncConfirm = async () => {
    if (isLoading) {
      return;
    }

    try {
      if (props.asyncConfirmWork) {
        setIsLoading(true);
        await props.asyncConfirmWork();
        setIsLoading(false);
      }
    } catch (e) {
      setIsError(true);
      if (props.onAsyncFailure) {
        props.onAsyncFailure(e);
      } else {
        Notifier.error("Failed to submit confirmation", e);
      }
    }
  };

  const closeText = props.closeText || (confirmFn ? "Cancel" : "Close");
  const confirmText = props.confirmText ?? "Yes";

  useEffect(() => {
    if (isFinished && !isError) {
      (confirmFn ?? closeFn)();
    }
  }, [isFinished, isError, confirmFn, closeFn]);

  return (
    <UserConfirmationView className={props.className}>
      <Content>
        <IconContainer>{props.icon ?? <AlertIcon />}</IconContainer>
        <MessageContainer>{props.message}</MessageContainer>
      </Content>
      <Controls>
        <CancelButton
          isHighlighted={!confirmFn && !props.asyncConfirmWork}
          theme={props.controlsTheme}
          onClick={closeFn}
          disabled={isLoading}>
          {closeText}
        </CancelButton>
        {props.asyncConfirmWork ? (
          <AsyncQcButton
            autoFocus={true}
            theme={props.controlsTheme}
            isHighlighted
            isLoading={!isError && isLoading}
            finishFn={() => setIsFinished(true)}
            onClick={onAsyncConfirm}>
            {confirmText}
          </AsyncQcButton>
        ) : confirmFn ? (
          <QcButton autoFocus={true} isHighlighted theme={props.controlsTheme} onClick={confirmFn}>
            {confirmText}
          </QcButton>
        ) : null}
      </Controls>
    </UserConfirmationView>
  );
};
