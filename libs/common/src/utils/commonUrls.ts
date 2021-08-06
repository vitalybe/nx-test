import { combineUrl } from "./combineUrl";
import { API_OVERRIDE_PREFIX, CommonUrlParams } from "../urlParams/commonUrlParams";

export class CommonUrls {
  private static QC_SERVICES_DEV = "https://qc-services-dev.cqloud.com";
  private static QC_SERVICES_PROD = "https://qc-services.cqloud.com";
  public static LOCALHOST_INDICATOR = "dev-localhost.cqloud.com";
  private static DEV_INDICATOR = "-dev.cqloud.com";

  static get qcServicesUrl() {
    let url: string;
    if (
      document.location.hostname.includes(CommonUrls.DEV_INDICATOR) ||
      document.location.hostname.includes(CommonUrls.LOCALHOST_INDICATOR)
    ) {
      url = this.QC_SERVICES_DEV;
    } else {
      url = this.QC_SERVICES_PROD;
    }

    return url;
  }

  static isQcServicesLocalhost(href: string = location.href): boolean {
    const url = new URL(href);
    return url.origin.includes(this.LOCALHOST_INDICATOR);
  }

  static isQcServicesDev(href: string = location.href): boolean {
    const url = new URL(href);
    return url.origin === this.QC_SERVICES_DEV;
  }

  static isQcServicesProd(href: string = location.href): boolean {
    const url = new URL(href);
    return url.origin === this.QC_SERVICES_PROD;
  }

  static get nmaUrl() {
    let url: string;
    if (
      document.location.hostname.includes(CommonUrls.DEV_INDICATOR) ||
      document.location.hostname.includes(CommonUrls.LOCALHOST_INDICATOR)
    ) {
      url = "https://nma-dev.cqloud.com/template/system.html";
    } else {
      url = "https://nma.cqloud.com/template/system.html";
    }

    return url;
  }

  static get loginUrl() {
    return this.qcServicesUrl + "/login";
  }

  static get opsDashboardUrl() {
    return this.qcServicesUrl + "/dashboard";
  }

  static get reports() {
    return this.qcServicesUrl + "/reports";
  }

  static get logoutUrl() {
    return this.loginUrl + "/logout";
  }

  static get loginIframeUrl() {
    return this.loginUrl + "/iframe";
  }

  static get eventsDashboardUrl() {
    return this.qcServicesUrl + "/events-dashboard";
  }

  static getKibanaAuditLogUrl(env: string | undefined) {
    if (env) {
      return "https://897b388464d847a8aaf79d24d89ba310.us-west-2.aws.found.io:9243/app/kibana#/discover?notFound=search&_g=(filters:!(),refreshInterval:(pause:!t,value:0),time:(from:now-15w,to:now))&_a=(columns:!(_source),filters:!(),index:a1e06ce0-959b-11e9-8a36-5bf226aa7ab4,interval:auto,query:(language:kuery,query:''),sort:!('@timestamp',desc))";
    } else {
      return "https://dd7fdebcfed847a096d8b25b643558cc.us-west-2.aws.found.io:9243/app/kibana#/discover/ddd0ea30-b135-11e9-96b8-eb1bb74e93f2?_g=(refreshInterval%3A(pause%3A!t%2Cvalue%3A0)%2Ctime%3A(from%3Anow-15d%2Cto%3Anow))";
    }
  }

  private static addNonExistingParam(
    sourceQueryParams: URLSearchParams,
    targetQueryParams: URLSearchParams,
    paramName: string
  ) {
    const paramValue = sourceQueryParams.get(paramName);
    if (!targetQueryParams.has(paramName) && paramValue !== null) {
      targetQueryParams.set(paramName, paramValue);
    }
  }

  static addPersistentQueryParams(url: string, additionalParams: QueryParam[] | undefined = undefined): string {
    const currentUrlParams = new URLSearchParams(location.search);

    const newUrl = new URL(url);
    const targetQueryParams = new URLSearchParams(newUrl.search);

    this.addNonExistingParam(currentUrlParams, targetQueryParams, CommonUrlParams.env);
    this.addNonExistingParam(currentUrlParams, targetQueryParams, CommonUrlParams.mock);
    this.addNonExistingParam(currentUrlParams, targetQueryParams, CommonUrlParams.recordSession);
    this.addNonExistingParam(currentUrlParams, targetQueryParams, CommonUrlParams.timezone);
    this.addNonExistingParam(currentUrlParams, targetQueryParams, CommonUrlParams.obfuscate);

    for (const [paramName, paramValue] of currentUrlParams.entries()) {
      if (paramName.startsWith(API_OVERRIDE_PREFIX)) {
        targetQueryParams.set(paramName, paramValue);
      }
    }

    if (additionalParams) {
      additionalParams.forEach((param) => {
        targetQueryParams.set(param.name, param.value);
      });
    }

    return newUrl.origin + newUrl.pathname + "?" + targetQueryParams.toString();
  }

  // NOTE: This function should be used when redirected with reach-router, since it DOES take "basePath" (basename) into account.
  static addPersistentQueryParamsToPartialPath(path: string): string {
    const url = new URL(this.addPersistentQueryParams(combineUrl(location.origin, path)));
    return url.pathname + url.search;
  }

  // returns the most likely root name for this project for the given href, some examples:
  // http://dev-localhost.cqloud.com/login/reset-init => login/
  // http://dev-localhost.cqloud.com/reset-init => /
  // http://dev-localhost.cqloud.com/old-versions/login/v19-6-27b2/reset-init => old-versions/login/v19-6-27b2
  static getProjectRoot(href: string) {
    // in development mode
    let basename = "/";

    const url = new URL(href);
    const path = url.host + url.pathname;
    const pathParts = path.split("/").filter((part) => !!part);
    // old-versions, e.g: http://qc-services.cqloud.com/old-versions/login/v19-7-28b2/reset-init
    if (pathParts.length >= 2 && pathParts[1] === "old-versions") {
      const oldVersionMatch = path.match(/^\S+?\.cqloud.com(\/old-versions\/\S+?\/v\d+-\d+-[0-9b]+)/);
      if (oldVersionMatch) {
        basename = oldVersionMatch[1];
      }
      // in development mode, e.g: , e.g: http://dev-localhost.cqloud.com/reset-init
    } else if (pathParts.length >= 1 && pathParts[0].includes("localhost")) {
      basename = "/";
    }
    // standard deployment, e.g: http://qc-services.cqloud.com/login/reset-init
    else if (pathParts.length >= 2) {
      basename = pathParts[1] + "/";
    }

    return basename;
  }

  // NOTE: This function should be used when redirected with reach-router, since it doesn't take "basePath" into account.
  // pathname - relative path, e.g for internal links: /reset-init
  //            alternatively, if a link to specific external project: /login/reset-init
  static buildUrl(
    pathname: string,
    inProject: boolean = true,
    persistQuery: false | "persistent" | "all" = "persistent"
  ) {
    if (pathname.startsWith("http://")) {
      throw new Error(`expected relative path`);
    }

    let newPathname = pathname;
    if (inProject) {
      newPathname = combineUrl("/" + CommonUrls.getProjectRoot(location.href), pathname);
    }

    const currentUrl = new URL(location.href);

    if (persistQuery === "all") {
      newPathname += currentUrl.search;
    } else if (persistQuery === "persistent") {
      newPathname = this.addPersistentQueryParamsToPartialPath(newPathname);
    }

    return newPathname;
  }

  private constructor() {}
}

export interface QueryParam {
  name: string;
  value: string;
}
