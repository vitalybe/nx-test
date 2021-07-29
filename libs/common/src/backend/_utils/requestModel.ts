import * as _ from "lodash";
import { Ajax } from "common/utils/ajax";
import { UrlParams } from "common/backend/_utils/urlParams";

export class RequestModel {
  constructor(public url: URL, private options?: RequestInit) {}

  private _cachedPromise: Promise<unknown> | undefined;

  private isRejected: boolean = false;

  get params(): UrlParams {
    return new UrlParams(this.url.search);
  }

  async getResponse(): Promise<unknown> {
    if (this._cachedPromise === undefined || this.isRejected) {
      this.storePromise();
    }
    return this._cachedPromise;
  }

  private storePromise = () => {
    this.isRejected = false;
    this._cachedPromise = Ajax.fetchJson(this.url.href, "get", this.options).then(
      (res) => res,
      (error) => {
        this.isRejected = true;
        throw error;
      }
    );
  };

  match = (requestModel: RequestModel) => {
    const requestTarget = requestModel.url.origin + requestModel.url.pathname;
    const thisTarget = this.url.origin + this.url.pathname;
    return _.isEqual(requestModel.params.json, this.params.json) && requestTarget === thisTarget;
  };
}
