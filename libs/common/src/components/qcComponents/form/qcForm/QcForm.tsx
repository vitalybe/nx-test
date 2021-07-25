import * as React from "react";
import { FormHTMLAttributes, PropsWithChildren, ReactNode } from "react";
import styled from "styled-components";
import { loggerCreator } from "common/utils/logger";
import { useFormContext, UseFormMethods } from "react-hook-form";
import {
  QcFormControls,
  QcFormControlsOptions,
} from "common/components/qcComponents/form/_parts/qcFormControls/QcFormControls";
import { QcFormProvider } from "common/components/qcComponents/form/_parts/QcFormProvider";

const moduleLogger = loggerCreator(__filename);

//region [[ Styles ]]
const QcFormView = styled.form`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 1.25rem 2rem;
  flex: 1 1 auto;
`;
//endregion [[ Styles ]]

//region [[ Props ]]
export interface Props<T extends object> {
  onSubmit: (data: T) => void;
  form: UseFormMethods<T>;
  controlsOptions?: QcFormControlsOptions;
  className?: string;
  children: ReactNode;
}

interface FormContainerProps<T extends object> extends PropsWithChildren<Omit<FormHTMLAttributes<{}>, "onSubmit">> {
  onSubmit: (data: T) => void;
}
//endregion [[ Props ]]

// this component provides a default form structure:
// provider > form element container > form controls with submit
export function QcForm<T extends object>({ controlsOptions, onSubmit, form, ...props }: Props<T>) {
  return (
    <QcFormProvider<T> form={form}>
      <QcFormContainer className={props.className} onSubmit={onSubmit}>
        {props.children}
        {!controlsOptions?.hide && <QcFormControls {...controlsOptions} />}
      </QcFormContainer>
    </QcFormProvider>
  );
}

function QcFormContainer<T extends object>({ onSubmit, children, ...props }: FormContainerProps<T>) {
  const { handleSubmit } = useFormContext<T>();
  const onSubmitHandler = handleSubmit(async (data) => {
    await onSubmit?.(data as T);
  });
  return (
    <QcFormView {...props} onSubmit={onSubmitHandler}>
      {children}
    </QcFormView>
  );
}
