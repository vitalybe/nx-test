/* eslint-disable no-console */
import { CommonUrls } from "common/utils/commonUrls";
import * as Sentry from "@sentry/browser";
import { LogRocketUtils } from "common/utils/telemetryRecording/logRocketUtils";
import { CommonUrlParams } from "common/urlParams/commonUrlParams";

const LogRocket = require("logrocket");

// @ts-ignore - Comes from webpack
const appVersion = __VERSION__;
// @ts-ignore - Comes from webpack
const sentryDsn = __SENTRY_DSN__;

export class RecordSession {
  private static didInit = false;

  private static initSentry(
    isQcServicesDev: boolean,
    isQcServicesProd: boolean,
    env: string | null,
    name: string,
    email: string
  ) {
    if (!sentryDsn) {
      // NOTE: We can't use moduleLogger here since it creates circular dependencies
      console.error("Sentry DSN should be set");
    }

    // NOTE: We can't use moduleLogger here since it creates circular dependencies
    console.info("Sentry - error reporting is active");
    let qcEnv;
    if (isQcServicesProd) {
      qcEnv = "prod";
    } else if (isQcServicesDev) {
      qcEnv = "dev";
    } else {
      qcEnv = "N/A";
    }

    Sentry.init({ dsn: sentryDsn, release: appVersion, environment: qcEnv });
    Sentry.configureScope(function(scope) {
      scope.setTag("backend-env", env || "prod");
    });
    Sentry.setUser({ username: name, email: email });

    LogRocket.getSessionURL((sessionURL: string) => {
      Sentry.configureScope(scope => {
        scope.setExtra("sessionURL", sessionURL);
      });
    });
  }

  static init(name: string, email: string, isQwiltUser: boolean) {
    if (this.didInit) {
      return;
    }

    this.didInit = true;
    // NOTE: We can't use commonUrls here because recordSession is used in logger itself which causes dependency loops
    const searchParams = new URLSearchParams(location.search);
    const forceRecordSession = searchParams.has(CommonUrlParams.recordSession);
    const env = searchParams.get(CommonUrlParams.env);
    // devTest uses mock backend, we don't want to record that to LogRocket
    const isMockBackend = env && env.includes("dev-localhost");
    // dev && prod are deployed versions (not localhost)
    const isQcServicesDev = CommonUrls.isQcServicesDev();
    const isQcServicesProd = CommonUrls.isQcServicesProd();
    if (forceRecordSession || (!isMockBackend && isQwiltUser && (isQcServicesDev || isQcServicesProd))) {
      LogRocketUtils.instance.initLogRocket(name, email);
    }

    if (isQcServicesDev || isQcServicesProd || forceRecordSession) {
      this.initSentry(isQcServicesDev, isQcServicesProd, env, name, email);
    }
  }

  static captureError(message: string, error?: Error) {
    if (this.didInit) {
      if (error) {
        LogRocket.captureException(error, { extra: { message } });
        Sentry.captureException(error);
      } else {
        LogRocket.captureMessage(message);
        Sentry.captureMessage(message);
      }
    }
  }

  private constructor() {}
}
