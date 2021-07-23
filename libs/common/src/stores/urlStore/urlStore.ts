import { action, observable, ObservableMap } from "mobx";
import { loggerCreator } from "common/utils/logger";
import { BrowserHrefReal } from "common/stores/urlStore/browserUrl/browserHrefReal";
import { BrowserHref } from "common/stores/urlStore/browserUrl/browserHref";
import { BrowserHrefMock } from "common/stores/urlStore/browserUrl/browserHrefMock";
import { BrowserHrefBuilder } from "common/stores/urlStore/browserUrl/browserHrefBuilder";
import { API_OVERRIDE_PREFIX, CommonUrlParams } from "common/urlParams/commonUrlParams";

//noinspection JSUnusedLocalSymbols
const moduleLogger = loggerCreator(__filename);

// NOTE: Don't use directly - Use ProjectUrlStore instead
export class UrlStore<T extends string = string> {
  protected constructor(private browserHref: BrowserHref) {
    this.updateFromUrl();
    window.addEventListener("popstate", () => {
      this.updateFromUrl();
    });
  }

  @observable
  private parametersMap = new ObservableMap<CommonUrlParams | T, string>();

  public getApiOverrideParams() {
    return new Map(Array.from(this.parametersMap).filter(([key]) => key.startsWith(API_OVERRIDE_PREFIX)));
  }

  public getParam(paramType: CommonUrlParams | T) {
    return this.parametersMap.get(paramType);
  }

  public setParamsBatch(params: Array<[CommonUrlParams | T, string | undefined]>) {
    const url = new URL(this.browserHref.getDocumentHref());
    const searchParams = new URLSearchParams(url.search);

    for (const [parameter, value] of params) {
      if (value && value !== "false") {
        searchParams.set(parameter, value);
      } else {
        searchParams.delete(parameter);
      }
    }

    url.search = searchParams.toString();
    this.browserHref.historyPushState(url.toString());
    this.updateFromUrl();
  }

  public setParam(parameter: CommonUrlParams | T, value: string | undefined) {
    const url = new URL(this.browserHref.getDocumentHref());
    const params = new URLSearchParams(url.search);
    if (value !== null && value !== undefined && value !== "false") {
      params.set(parameter, value);
    } else {
      params.delete(parameter);
    }

    url.search = params.toString();

    this.browserHref.historyPushState(url.toString());
    this.updateFromUrl();
  }

  public removeParam(parameter: CommonUrlParams | T) {
    if (this.getParam(parameter)) {
      this.setParam(parameter, undefined);
    }
  }

  public getNumberParam(parameter: CommonUrlParams | T): number | undefined {
    const paramStrValue = this.getParam(parameter);
    const numberValue = paramStrValue !== undefined ? parseInt(paramStrValue) : undefined;

    return numberValue === undefined || isNaN(numberValue) ? undefined : numberValue;
  }

  public setNumberParam(parameter: CommonUrlParams | T, value: number | undefined) {
    this.setParam(parameter, value !== undefined ? value.toString() : undefined);
  }

  public getBooleanParam(paramType: CommonUrlParams | T): boolean | undefined {
    const value = this.parametersMap.get(paramType);
    if (value === undefined) {
      return undefined;
    } else {
      return value === "" || value.toLowerCase() === "true";
    }
  }

  public getParamExists(paramType: CommonUrlParams | T): boolean {
    const value = this.parametersMap.get(paramType);
    return value !== undefined;
  }

  public setBooleanParam(parameter: CommonUrlParams | T, value: boolean) {
    this.setParam(parameter, value !== undefined ? value.toString() : undefined);
  }

  public getArrayParam(paramType: CommonUrlParams | T): Set<string> {
    const logger = loggerCreator("getArrayParam", moduleLogger);
    let result = new Set<string>();

    const valuesJoined = this.getParam(paramType);
    try {
      if (valuesJoined) {
        const idsArray = valuesJoined.split(",");
        result = new Set<string>(idsArray);
      }
    } catch (e) {
      logger.warn("failed to parse values: " + valuesJoined, e);
    }

    return result;
  }

  public setArrayParam(paramType: CommonUrlParams | T, values: Set<string>) {
    const array = Array.from(values).join(",");
    this.setParam(paramType, array.length > 0 ? array : undefined);
  }

  public toggleArrayParam(paramType: CommonUrlParams | T, value: string) {
    const values = this.getArrayParam(paramType);
    if (values.has(value)) {
      values.delete(value);
    } else {
      values.add(value);
    }

    this.setArrayParam(paramType, values);
  }

  @action
  private updateFromUrl() {
    const url = new URL(this.browserHref.getDocumentHref());
    const params = new URLSearchParams(url.search);

    this.parametersMap.clear();

    [...params.keys()].forEach(paramKey => {
      this.parametersMap.set(paramKey as CommonUrlParams | T, params.get(paramKey)!);
    });
  }

  // Builder - Use it when you need to update multiple params, but don't want to create multiple history entries
  public getUrlStoreBuilder(): UrlStore<T> {
    return new UrlStore(new BrowserHrefBuilder());
  }

  public updateFromUrlStoreBuilder(builder: UrlStore<T>) {
    this.browserHref.historyPushState(builder.browserHref.getDocumentHref());
    this.updateFromUrl();
  }

  /////////////////////////////////////////

  static createMock<T extends string = string>() {
    return new UrlStore<T>(new BrowserHrefMock());
  }

  private static _instance: UrlStore<string> | undefined;
  static getInstance<T extends string = string>(): UrlStore<string> {
    if (!this._instance) {
      this._instance = new UrlStore<T>(new BrowserHrefReal());
    }

    return this._instance as UrlStore<T>;
  }
}
