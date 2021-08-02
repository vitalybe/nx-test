import * as _ from "lodash";
import * as React from "react";

import { loggerCreator } from "../logger";
import { toast, ToastContent, ToastOptions, Zoom } from "react-toastify";
import styled from "styled-components";
import { NotificationEntity, NotificationLevel } from "./_domain/notificationEntity";
import { action, observable } from "mobx";
import Dotdotdot from "react-dotdotdot";
import { NotifierShared } from "./notifierShared";
import { CommonUrls } from "../commonUrls";
import { RecordSession } from "../telemetryRecording/recordSession";
import { NetworkError } from "../ajax";
import { openCustomConfirmModal } from "../../components/qwiltModal/QwiltModal";
import { DialogModal } from "../../components/qcComponents/dialogModal/DialogModal";
import { UserConfirmation } from "../../components/qcComponents/userConfirmation/UserConfirmation";
import { transparentize } from "polished";
import { CommonColors } from "../../styling/commonColors";
import { QcButtonThemes } from "../../components/qcComponents/_styled/qcButton/_themes";

const moduleLogger = loggerCreator("__filename");

//region [[ Styles ]]

const NotifyView = styled.div`
  font-size: 14px;
`;

const Title = styled.div`
  font-weight: bold;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  margin-bottom: 0.3rem;
`;

const Text = styled.div`
  font-weight: lighter;
`;

//endregion [[ Styles ]]

type Environments = "dev" | "localhost" | "prod";

export interface NotifyOptions {
  text?: string;
  modalText?: string;
  // default: unrestricted
  restrictToEnvironment?: Environments[];
  // default: true
  reportToSentry?: boolean;
  // default: true
  writeToConsole?: boolean;
  // Additional data to write to console
  additionalConsoleLog?: string;
  errorObject?: Error;
}

// NOTE: The static functions are made for easier use. However, the class itself must have a (single) instance for the mobx to work.
export class Notifier {
  @observable
  notifications: NotificationEntity[] = [];

  @observable
  buttonOffset: string | undefined;

  private displayedToasts: number = 0;
  private overflowToastId: number | undefined = undefined;

  constructor() {
    toast.onChange((displayed) => {
      this.displayedToasts = displayed ?? 0;
    });

    this.notifyOnWindowError();
    this.notifyOnConsoleError();
    this.notifyOnUnhandledRejection();
  }

  private isMatchingEnvironment(restrictToEnvironment: Environments[] | undefined): boolean {
    let isMatching = false;

    if (restrictToEnvironment === undefined) {
      isMatching = true;
    } else if (restrictToEnvironment.includes("localhost") && CommonUrls.isQcServicesLocalhost()) {
      isMatching = true;
    } else if (restrictToEnvironment.includes("dev") && CommonUrls.isQcServicesDev()) {
      isMatching = true;
    } else if (restrictToEnvironment.includes("prod") && CommonUrls.isQcServicesProd()) {
      isMatching = true;
    }

    return isMatching;
  }

  private getTextForErrorObject(errorObject: Error | undefined) {
    let text = "";

    try {
      if (errorObject instanceof NetworkError) {
        const hostname = new URL(errorObject.url).hostname;
        if (errorObject.responseStatus === 0) {
          text = `"${hostname}" is unreachable`;
        }
        // auth errors are handled in ajax.ts
        else if (errorObject.responseStatus !== 401 && errorObject.responseStatus !== 403) {
          text = `"${hostname}" returned status ${errorObject.responseStatus}: ${errorObject.responseText}`;
        }
      }
    } catch (e) {
      moduleLogger.warn("failed to getTextForErrorObject", e);
    }

    return text;
  }

  private static getConsoleLogForErrorObject(errorObject: Error | undefined) {
    let text = "";

    try {
      if (errorObject instanceof NetworkError) {
        text = `** URL **\n`;
        text += `${errorObject.method} ${errorObject.url}\n\n`;
        text += `** Body **\n`;
        text += `${errorObject.body}\n\n`;
        text += `** Response: ${errorObject.responseStatus} **\n`;
        text += `${errorObject.responseText}\n\n`;
      }
    } catch (e) {
      moduleLogger.warn("failed to getConsoleLogForErrorObject", e);
    }

    return text;
  }
  @action
  setBtnOffset(value: string | undefined) {
    this.buttonOffset = value;
  }

  @action
  clearNotifications() {
    this.notifications = [];
  }
  @action
  private notify(level: NotificationLevel, title: string, options?: NotifyOptions) {
    if (!this.isMatchingEnvironment(options?.restrictToEnvironment)) {
      return;
    }

    const text = options?.text ?? "";
    const fullAdditionalConsoleLog =
      (options?.additionalConsoleLog ?? "") + Notifier.getConsoleLogForErrorObject(options?.errorObject);

    const { toastFunction, loggerFunction } = this.getToastLevelFunctions(level);

    const isNewNotification = _.last(this.notifications)?.title !== title;
    if (isNewNotification) {
      this.notifications.push({ level, title, text, errorText: this.getTextForErrorObject(options?.errorObject) });
    }

    if (level === NotificationLevel.MODAL) {
      this.displayModal(title, options?.modalText);
    } else if (isNewNotification) {
      this.displayToast(toastFunction, title, text);
    }

    if (options?.writeToConsole !== false) {
      this.sendToConsoleLog(title, text, loggerFunction, fullAdditionalConsoleLog, options?.errorObject);
    }

    if (level >= NotificationLevel.ERROR && options?.reportToSentry !== false) {
      RecordSession.captureError(title + " - " + text, options?.errorObject);
    }
  }

  private sendToConsoleLog(
    title: string,
    text: string,
    loggerFunction: (message: string, error?: Error) => void,
    additionalConsoleLog: string | undefined,
    errorObject: Error | undefined
  ) {
    let completeConsoleMessage = `Notifier message: ${title} - ${text}`;
    if (additionalConsoleLog) {
      completeConsoleMessage += ". dev log: \n" + additionalConsoleLog;
    }

    loggerFunction(completeConsoleMessage, errorObject);
  }

  private displayToast(
    toastFunction: (content: ToastContent, options?: ToastOptions) => number,
    title: string,
    text = ""
  ) {
    if (this.displayedToasts < NotifierShared.MAX_TOASTS) {
      // NOTE: if multiple toasts are launched, the async toast.onChange might not run in time.
      this.displayedToasts++;

      this.displayToastRaw(toastFunction, title, text);
    } else if (this.overflowToastId === undefined) {
      this.overflowToastId = this.displayToastRaw(
        toast.info,
        "Additional notifications aren't shown...",
        "Click the notifications button to see all the notifications.",
        () => {
          this.overflowToastId = undefined;
        }
      );
    }
  }

  private displayToastRaw(
    toastFunction: (content: ToastContent, options?: ToastOptions) => number,
    title: string | undefined,
    text: string,
    onToastClose?: () => void
  ) {
    return toastFunction(
      <NotifyView>
        <Title>{title}</Title>
        <Dotdotdot clamp={2}>
          <Text>{text}</Text>
        </Dotdotdot>
      </NotifyView>,
      {
        position: "bottom-left",
        autoClose: NotifierShared.AUTO_CLOSE_AFTER_MS,
        closeButton: false,
        transition: Zoom,
        onClose: onToastClose,
      }
    );
  }
  private displayModal(
    title: string | undefined,
    message = "Something went wrong, check the notifications log for more details."
  ) {
    openCustomConfirmModal(({ onCancel }) => (
      <DialogModal
        closeCallback={onCancel}
        title={title}
        overlayBackgroundColor={transparentize(0.6, CommonColors.BLUE_LAGOON)}
        component={() => (
          <UserConfirmation controlsTheme={QcButtonThemes.dialogDanger} message={message} closeFn={onCancel} />
        )}
      />
    ));
  }
  private getToastLevelFunctions(level: NotificationLevel) {
    let toastFunction;
    let loggerFunction;
    if (level >= NotificationLevel.ERROR) {
      toastFunction = toast.error.bind(toast);
      loggerFunction = moduleLogger.error.bind(moduleLogger);
    } else if (level === NotificationLevel.WARN) {
      toastFunction = toast.warn.bind(toast);
      loggerFunction = moduleLogger.warn.bind(moduleLogger);
    } else if (level === NotificationLevel.INFO) {
      toastFunction = toast.info.bind(toast);
      loggerFunction = moduleLogger.info.bind(moduleLogger);
    } else {
      moduleLogger.warn(`unexpected level: ${level}`);
      toastFunction = toast.warn.bind(toast);
      loggerFunction = moduleLogger.warn.bind(moduleLogger);
    }
    return { toastFunction, loggerFunction };
  }

  private notifyOnWindowError() {
    window.onerror = (onerrorMessage, url, lineNumber, column, errorObj) => {
      if (["ResizeObserver loop limit exceeded"].includes(onerrorMessage as string)) {
        return;
      }

      const message: string = onerrorMessage instanceof Event ? "N/A" : onerrorMessage;

      this.notify(NotificationLevel.ERROR, "Unexpected window.onerror", {
        text: message,
        errorObject: errorObj,
        restrictToEnvironment: ["localhost"],
        writeToConsole: false,
      });
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private shouldUseNotifierOnConsole(error: any): boolean {
    const errorString = typeof error === "string" ? error : "";

    // Was added due to OKTA using console.error
    if (error["name"]?.toString() === "AuthApiError") return false;
    // This console error is added by the notifier
    if (errorString.includes("Notifier message:")) return false;
    // Was added from JsonEditor using console.error
    if (errorString === "Custom validation function did throw an error") return false;
    // printed by react-flip-toolkit - not harmful
    if (errorString.includes("[react-flip-toolkit]")) return false;
    // ag-grid shows this error sometimes when when we reload it
    if (errorString.includes("BeanStub")) return false;
    // ag-grid shows this error sometimes when when we reload it
    if (errorString.includes("unable to find bean reference frameworkOverrides while initialising e")) return false;

    return true;
  }

  private notifyOnConsoleError() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    window.console.error = ((old_function) => (error: any, ...args: any[]) => {
      if (this.shouldUseNotifierOnConsole(error)) {
        let errorString: string = "";
        if (typeof error === "string") {
          errorString = error;
        } else if (error.message) {
          errorString = error.message;
        }

        this.notify(NotificationLevel.ERROR, "Unexpected console.error", {
          text: errorString,
          restrictToEnvironment: ["localhost"],
          writeToConsole: false,
        });
      }

      old_function(error, ...args);
      // eslint-disable-next-line no-console
    })(console.error.bind(console));
  }

  private notifyOnUnhandledRejection() {
    window.addEventListener("unhandledrejection", (event) => {
      this.notify(NotificationLevel.ERROR, "Unexpected unhandled rejection", {
        text: event.reason.toString(),
        restrictToEnvironment: ["localhost"],
        writeToConsole: false,
      });
    });
  }

  dismissToasts() {
    this.displayedToasts = 0;
    toast.dismiss();
  }

  static modal(title: string, error?: Error, options?: NotifyOptions) {
    Notifier.instance.notify(NotificationLevel.MODAL, title, { errorObject: error, text: error?.message, ...options });
  }

  static error(title: string, error?: Error, options?: NotifyOptions) {
    Notifier.instance.notify(NotificationLevel.ERROR, title, { errorObject: error, ...options });
  }

  static warn(title: string, error?: Error, options?: NotifyOptions) {
    Notifier.instance.notify(NotificationLevel.WARN, title, { errorObject: error, ...options });
  }

  static info(title: string, options?: NotifyOptions) {
    Notifier.instance.notify(NotificationLevel.INFO, title, options);
  }

  //region [[ Singleton ]]
  protected static _instance: Notifier | undefined;
  static get instance(): Notifier {
    if (!this._instance) {
      this._instance = new Notifier();
    }

    return this._instance;
  }
  //endregion
}
