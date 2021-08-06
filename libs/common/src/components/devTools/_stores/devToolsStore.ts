import { computed } from "mobx";

import { loggerCreator } from "../../../utils/logger";
import { Settings } from "luxon";
import { UrlStore } from "../../../stores/urlStore/urlStore";
import { CommonUrlParams } from "../../../urlParams/commonUrlParams";
import { Utils } from "../../../utils/utils";
//noinspection JSUnusedLocalSymbols
const moduleLogger = loggerCreator("__filename");

class DevToolsStore {
  private urlStore = UrlStore.getInstance();

  constructor() {
    if (this.urlStore.getParamExists(CommonUrlParams.freezeTime)) {
      const urlFreezeValue = UrlStore.getInstance().getNumberParam(CommonUrlParams.freezeTime);
      const freezeDate = Utils.getDateTimeFromSecOrMs(urlFreezeValue ?? 1539018000000);
      Settings.now = () => freezeDate.toMillis();
      moduleLogger.info(`freezing time to: unixtime(${freezeDate})`);
    }
  }

  get isMockMode(): boolean {
    let isMockMode = this.urlStore.getParam(CommonUrlParams.mock) !== undefined;

    if (this.isStorybook) {
      // HACK: In storybook we want mock mode to be default... The best way I found is to reverse mock mode :O
      isMockMode = !isMockMode;
    }

    return isMockMode;
  }

  // noinspection JSUnusedGlobalSymbols
  set isMockMode(isMockMode: boolean) {
    if (this.isStorybook) {
      // HACK: In storybook we want mock mode to be default... The best way I found is to reverse mock mode :O
      isMockMode = !isMockMode;
    }

    if (isMockMode) {
      this.urlStore.setBooleanParam(CommonUrlParams.mock, true);
    } else {
      this.urlStore.setBooleanParam(CommonUrlParams.mock, false);
    }
  }

  @computed
  get environment(): string {
    return this.urlStore.getParam(CommonUrlParams.env) || "";
  }

  set environment(value: string) {
    this.urlStore.setParam(CommonUrlParams.env, value);
  }

  private _isStorybook: boolean = false;

  get isStorybook() {
    // we use port 5000/1 for react-cosmos
    return this._isStorybook || location.port === "5000" || location.port === "5001";
  }

  // noinspection JSUnusedGlobalSymbols
  set isStorybook(value: boolean) {
    this._isStorybook = value;
  }

  @computed
  get isForceHttp() {
    return this.urlStore.getParamExists(CommonUrlParams.forceHttp);
  }

  set isForceHttp(value: boolean) {
    this.urlStore.setBooleanParam(CommonUrlParams.forceHttp, value);
  }
}

// NOTE: It can't be static due to: https://github.com/mobxjs/mobx/issues/351
export const devToolsStore = new DevToolsStore();
