import { loggerCreator } from "common/utils/logger";
import { RequestModel } from "common/backend/_utils/requestModel";
// @ts-ignore
import Postmate from "postmate";
import { CommonUrls } from "common/utils/commonUrls";
import { Utils } from "common/utils/utils";
import { devToolsStore } from "common/components/devTools/_stores/devToolsStore";

const moduleLogger = loggerCreator(__filename);

export interface AjaxMetadataUsedUrl {
  url: string;
  count: number;
  isCached: boolean;
}

interface AjaxMetadataOptions {
  onAjaxStart?: () => void;
  onAjaxEnd?: () => void;
}

export class AjaxMetadata {
  constructor(public shouldUseCache: boolean = false, public readonly options?: AjaxMetadataOptions) {}

  usedUrls: AjaxMetadataUsedUrl[] = [];
}

export class NetworkError extends Error {
  constructor(
    public readonly url: string,
    public readonly method: string,
    public readonly body: BodyInit | null | undefined,
    public readonly responseStatus: number,
    public readonly responseText: string
  ) {
    super(responseText);
    this.name = "NetworkError";
    this.message = responseText;
  }
}

export class Ajax {
  public static isRedirecting = false;

  private static _cache: RequestModel[] = [];
  private static _cacheLimit = 300;

  public static async checkLoginIframe(): Promise<boolean> {
    if (devToolsStore.isMockMode) {
      return true;
    }

    let isLoggedIn = false;
    try {
      const handshake = new Postmate({
        container: document.getElementsByTagName("body")[0], // Element to inject frame into
        url: CommonUrls.addPersistentQueryParams(CommonUrls.loginIframeUrl),
        classListArray: ["login-iframe"], //Classes to add to the iframe via classList, useful for styling.
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const child: any = await handshake;
      isLoggedIn = (await child.get("loginCheck")) as boolean;
      child.destroy();
    } catch (e) {
      moduleLogger.error("failed to login via iframe", e);
    }

    return isLoggedIn;
  }

  private static fetch = async (targetUrl: string, method: string, userOptions?: RequestInit): Promise<Response> => {
    const options: RequestInit = {
      method: method.toUpperCase(),
      credentials: "include",
      ...userOptions,
    };

    let response = undefined;
    try {
      response = await fetch(targetUrl, options);
    } catch (e) {
      moduleLogger.warn("failed to fetch", e);
    }

    // occurs when server is down completely/no connection
    if (!response) {
      moduleLogger.debug("failed to get any response");
      throw new NetworkError(targetUrl, method, options.body, 0, "failed to get a response");
    }
    // if user isn't logged or has no permissions
    // NOTE: 401 is unauthenticated status, 403 is lack of permissions status
    else if (response.status === 401) {
      moduleLogger.debug("trying to refresh login");
      const authenticated = await Ajax.checkLoginIframe();
      if (authenticated) {
        moduleLogger.debug("refresh succeeded - trying");
        try {
          response = await fetch(targetUrl, options);
        } catch (e) {
          moduleLogger.warn("failed to fetch", e);
        }
      } else {
        moduleLogger.debug("failed to refresh login");
      }

      if (!response || !authenticated || [401].includes(response.status)) {
        Ajax.redirectToLogin();
        throw new NetworkError(targetUrl, method, options.body, 302, "Redirect to login");
      }
    }

    if (response.status >= 300) {
      let responseText;
      try {
        responseText = await response.text();
      } catch (e) {
        responseText = "Failed to get error text";
      }

      throw new NetworkError(targetUrl, method, options.body, response.status, responseText);
    } else {
      return response;
    }
  };

  static redirectToLogin(newTab = false) {
    moduleLogger.warn("Authorization failed - redirecting to login");
    const returnTo = encodeURIComponent(CommonUrls.addPersistentQueryParams(window.top.location.href));
    const loginUrl = CommonUrls.addPersistentQueryParams(CommonUrls.logoutUrl);

    if (newTab) {
      window.open(`${loginUrl}&returnTo=close`);
    } else {
      window.top.location.href = `${loginUrl}&returnTo=${returnTo}`;
      Ajax.isRedirecting = true;
    }
  }

  static fetchJson = async (targetUrl: string, method: string, userOptions?: RequestInit): Promise<unknown> => {
    const response = await Ajax.fetch(targetUrl, method, userOptions);
    const text = await response.text();
    return text.length > 0 ? JSON.parse(text) : {};
  };

  static getJson = async (targetUrl: string, ajaxMetadata?: AjaxMetadata): Promise<unknown> => {
    const request = new RequestModel(new URL(targetUrl), {
      headers: new Headers({ Accept: "application/json" }),
    });

    const shouldUseCache = !!(ajaxMetadata && ajaxMetadata.shouldUseCache);
    const presetRequest = Ajax._cache.find((req) => req.match(request));

    let response;

    if (shouldUseCache && presetRequest !== undefined) {
      response = await presetRequest.getResponse();
    } else {
      if (shouldUseCache) {
        // cache limit
        if (Ajax._cache.length >= Ajax._cacheLimit) {
          Ajax._cache = Ajax._cache.slice().splice(Ajax._cache.length - Ajax._cacheLimit - 1);
        }

        Ajax._cache.push(request);
      }

      const ajaxMetadataOptions = ajaxMetadata && ajaxMetadata.options;
      if (ajaxMetadataOptions && ajaxMetadataOptions.onAjaxStart) ajaxMetadataOptions.onAjaxStart();
      try {
        response = await request.getResponse();
      } finally {
        if (ajaxMetadataOptions && ajaxMetadataOptions.onAjaxEnd) ajaxMetadataOptions.onAjaxEnd();
      }
    }

    if (ajaxMetadata) {
      const presentListedUrl = ajaxMetadata.usedUrls.find(({ url }) => url === targetUrl);
      if (presentListedUrl) {
        presentListedUrl.count++;
        presentListedUrl.isCached = true;
      } else {
        ajaxMetadata.usedUrls.push({
          url: targetUrl,
          count: 1,
          isCached: presetRequest !== undefined,
        });
      }
    }

    return response;
  };

  static postJson = async (targetUrl: string, body: object, headers?: HeadersInit): Promise<unknown> => {
    return await Ajax.fetchJson(targetUrl, "post", {
      headers: new Headers({ Accept: "application/json", "Content-Type": "application/json", ...(headers ?? {}) }),
      body: JSON.stringify(Utils.trimObjectValues(body)),
    });
  };

  static patchJson = async (targetUrl: string, body: object, headers?: HeadersInit): Promise<unknown> => {
    return await Ajax.fetchJson(targetUrl, "patch", {
      headers: new Headers({ Accept: "application/json", "Content-Type": "application/json", ...(headers ?? {}) }),
      body: JSON.stringify(Utils.trimObjectValues(body)),
    });
  };

  static putJson = async (targetUrl: string, body: object, headers?: HeadersInit): Promise<unknown> => {
    return await Ajax.fetchJson(targetUrl, "put", {
      headers: new Headers({ Accept: "application/json", "Content-Type": "application/json", ...(headers ?? {}) }),
      body: JSON.stringify(Utils.trimObjectValues(body)),
    });
  };

  static deleteJson = async (targetUrl: string, headers?: HeadersInit): Promise<unknown> => {
    return await Ajax.fetch(targetUrl, "delete", {
      headers: new Headers({ Accept: "application/json", "Content-Type": "application/json", ...(headers ?? {}) }),
    });
  };
}
