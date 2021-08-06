import * as React from "react";
import { ReactChild, ReactNode } from "react";
import { loggerCreator } from "../../utils/logger";
import { confirmAlert, ReactConfirmAlertProps } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { QwiltConfirm } from "../configuration/qwiltForm/qwiltConfirm/QwiltConfirm";
import { Notifier } from "../../utils/notifications/notifier";
import { ErrorBoundary } from "../ErrorBoundary";
import { QueryClientProvider } from "react-query";
import { GlobalStore } from "../../stores/globalStore";

const moduleLogger = loggerCreator("__filename");

export function openQwiltModal<T>(
  getModalElement: (closeModalWithResult: (result?: T) => void) => ReactChild,
  options: ReactConfirmAlertProps = {}
): Promise<T> {
  return new Promise((resolve) => {
    confirmAlert({
      customUI: ({ onClose }) => (
        <QueryClientProvider client={GlobalStore.instance.queryClient}>
          <ErrorBoundary
            errorStateChildren={
              <div>
                <p>Dialog failed to open</p>
                <button
                  onClick={() => {
                    onClose();
                    resolve();
                  }}>
                  Close
                </button>
              </div>
            }>
            {getModalElement((result?: T) => {
              onClose();
              resolve(result);
            })}
          </ErrorBoundary>
        </QueryClientProvider>
      ),
      closeOnClickOutside: false,
      closeOnEscape: false,
      ...options,
    });
  });
}

export function openConfirmModal(
  message: string = "Are you sure?",
  title: string = "Please confirm",
  // While this function is processing, a spinner is shown in the confirm box
  onOkWork?: () => Promise<unknown>
): Promise<boolean> {
  async function onOkWorkInner() {
    try {
      if (onOkWork) {
        await onOkWork();
      }
    } catch (e) {
      Notifier.warn("Operation failed", e);
    }
  }

  return openCustomConfirmModal(({ onCancel, onConfirm }) => {
    return (
      <QwiltConfirm title={title} message={message} onOk={onConfirm} onCancel={onCancel} onOkWork={onOkWorkInner} />
    );
  });
}

export function openCustomConfirmModal(
  component: (props: { onConfirm: () => void; onCancel: () => void }) => ReactNode
): Promise<boolean> {
  async function onConfirm(resolve: (result: boolean) => void, onClose: () => void) {
    await resolve(true);
    onClose();
  }

  function onCancel(resolve: (result: boolean) => void, onClose: () => void) {
    resolve(false);
    onClose();
  }

  return new Promise((resolve) => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return component({
          onConfirm: () => onConfirm(resolve, onClose),
          onCancel: () => onCancel(resolve, onClose),
        });
      },
      closeOnClickOutside: true,
      closeOnEscape: true,
    });
  });
}
