import * as React from "react";
import styled from "styled-components";
import { loggerCreator } from "common/utils/logger";
import { QcButton } from "../../../_styled/qcButton/QcButton";
import { AsyncQcButton } from "../../../asyncQcButton/AsyncQcButton";
import { QcButtonTheme } from "../../../_styled/qcButton/_themes";
import { useFormContext } from "react-hook-form";

const moduleLogger = loggerCreator(__filename);

//region [[ Styles ]]
const AsyncSubmitButton = styled(AsyncQcButton)`
  position: relative;
  min-width: 4.375rem;
  padding: 0.75rem 1rem;
`;

const QcFormControlsView = styled.div`
  margin-top: auto;
  display: grid;
  grid-template-columns: 1fr;
  grid-auto-flow: column;
  grid-gap: 1rem;
  justify-items: flex-end;
  width: 100%;
`;

//endregion [[ Styles ]]

//region [[ Props ]]
export interface QcFormControlsOptions {
  hide?: boolean;
  onCancel?: () => void;
  entityName?: string;
  actionText?: string;
  loadingText?: string;
  theme?: QcButtonTheme;
}
export interface Props extends QcFormControlsOptions {
  className?: string;
}

//endregion [[ Props ]]

export function QcFormControls({ theme, ...props }: Props) {
  const {
    formState: { isSubmitting, isValid, isSubmitted, isDirty },
    errors,
  } = useFormContext();
  const hasFailedSubmission = !isValid && (!errors || Object.keys(errors).length > 0) && isSubmitted;
  const submitText = isSubmitting ? props.loadingText ?? "Submitting" : props.actionText ?? "Submit";

  return (
    <QcFormControlsView className={props.className}>
      <QcButton theme={theme} disabled={isSubmitting} type={"button"} onClick={() => props.onCancel?.()}>
        {"Cancel"}
      </QcButton>
      <AsyncSubmitButton
        theme={theme}
        isHighlighted
        disabled={(isValid && isSubmitting) || !isDirty}
        isError={hasFailedSubmission}
        isLoading={isSubmitting}
        type={"submit"}>
        {`${submitText} ${props.entityName ?? ""}`}
      </AsyncSubmitButton>
    </QcFormControlsView>
  );
}
