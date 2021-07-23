/* eslint-disable no-console */
import { computed, observable } from "mobx";
import { DateTime } from "luxon";

const appID = "zno8je/qc-services";
const LogRocket = require("logrocket");

interface Request {
  url: string;
  headers: object | null;
  body: object | null;
}
interface Response {
  url: string;
  headers: object | null;
  body: object | null;
}

export class LogRocketUtils {
  private didInitLogRocket = false;
  private origOpen: undefined | ((...args: any[]) => void);

  // region @observable sessionId
  @observable private _sessionId: string | undefined;

  @computed get sessionId() {
    return this._sessionId;
  }

  // endregion @observable sessionId

  // region @observable lastIngestSDate
  @observable private _lastIngestDate: DateTime | undefined;

  @computed get lastIngestDate() {
    return this._lastIngestDate;
  }

  // endregion @observable lastIngestSDate

  private listenLogRocketIngests() {
    if (this.origOpen) return;
    const that = this;
    this.origOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method: string, url: string) {
      try {
        const urlObj = new URL(url);
        const hostname = urlObj.hostname;

        if (hostname === "r.lr-ingest.io") {
          // NOTE: We can't use moduleLogger here since it creates circular dependencies
          const urlParams = new URLSearchParams(urlObj.search);
          const rValue = urlParams.get("r");
          if (rValue) {
            that._sessionId = `https://app.logrocket.com/zno8je/qc-services/s/${rValue}/0/`;
          }
          const ingestStartDate = DateTime.local();

          this.addEventListener("load", function(this: { status: number }) {
            // NOTE: We can't use moduleLogger here since it creates circular dependencies
            if ([200, 201].includes(this.status)) {
              // NOTE: We save the start time to know when a COMPLETE ingest finished
              that._lastIngestDate = ingestStartDate;
            }
          });
        }
      } catch (e) {
        // NOTE: We can't use moduleLogger here since it creates circular dependencies
        console.warn(`LogRocket - Ingest callback failure: ${e}`);
      } finally {
        // @ts-ignore
        // eslint-disable-next-line prefer-rest-params
        that.origOpen.apply(this, arguments);
      }
    };
  }

  initLogRocket(name: string, email: string) {
    // NOTE: We can't use moduleLogger here since it creates circular dependencies
    console.info(`LogRocket - session recording is active for Qwilt user: ${email}`);
    this.didInitLogRocket = true;

    this.listenLogRocketIngests();
    LogRocket.init(appID, {
      network: {
        requestSanitizer: (request: Request) => {
          if (request && request.url) {
            const url = request.url.toLowerCase();
            if (url.includes("login") || url.includes("okta")) {
              request.headers = null;
              request.body = null;
            }
          }

          return request;
        },
        responseSanitizer: (response: Response) => {
          if (response && response.url) {
            const url = response.url.toLowerCase();
            if (url.includes("login") || url.includes("okta")) {
              response.headers = null;
            }
          }

          return response;
        },
      },
    });

    LogRocket.identify(appID, {
      name: name,
      email: email,
    });
  }

  public get isRecordingLogRocket() {
    return this.didInitLogRocket;
  }

  //region [[ Singleton ]]
  protected static _instance: LogRocketUtils | undefined;
  static get instance(): LogRocketUtils {
    if (!this._instance) {
      this._instance = new LogRocketUtils();
    }

    return this._instance;
  }
  //endregion
}
