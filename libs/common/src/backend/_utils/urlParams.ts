import * as _ from "lodash";

export type ParamValue = string | boolean | number | Array<string | number> | undefined;
type ParamsObject = { [key: string]: ParamValue };

export class UrlParams<T extends ParamsObject = ParamsObject> {
  constructor(params: T | string) {
    this._search = params;
  }

  private _search: { [key: string]: ParamValue } | string = "";

  get json(): { [key: string]: ParamValue } {
    if (typeof this._search === "string") {
      return this.searchStringToJson(this._search);
    }
    return this._search;
  }

  get stringified(): string {
    return this.stringifyJson(this.json);
  }

  static getStringValue(paramValue: ParamValue) {
    if (paramValue !== undefined) {
      return Array.isArray(paramValue) ? (paramValue as Array<string | number>).join(",") : paramValue!.toString();
    } else {
      return undefined;
    }
  }

  removeKeys = (paramKeys: Array<string>) => {
    this._search = { ..._.omit(this.json, paramKeys) };
    return this;
  };

  set = (params: { [key: string]: ParamValue }) => {
    this._search = { ...this.json, ...params };
    return this;
  };

  getAsString = (key: string): string | undefined => {
    return UrlParams.getStringValue(this.json[key]);
  };

  has = (keys: string[]) => {
    for (const key of keys) {
      if (!(key in this.json)) {
        return false;
      }
    }
    return true;
  };

  private searchStringToJson(search: string) {
    const json: { [key: string]: ParamValue } = {};
    const paramsArr = _.replace(search, "?", "").split("&");
    for (const param of paramsArr) {
      const splitParam = param.split("=");
      const key = splitParam[0];
      const value = splitParam[1];
      if (value !== undefined && value !== "") {
        if (value.indexOf(",") > -1) {
          json[key] = value.split(",");
        } else {
          json[key] = value;
        }
      }
    }
    return json;
  }

  private stringifyJson(json: { [key: string]: ParamValue }) {
    const keys = Object.keys(json);
    return keys.length > 0
      ? `?${keys
          .map((key) => {
            const value = UrlParams.getStringValue(json[key]);
            return value !== undefined ? `${key}=${encodeURIComponent(value)}` : undefined;
          })
          .filter((params) => params !== undefined)
          .join("&")}`
      : "";
  }
}
