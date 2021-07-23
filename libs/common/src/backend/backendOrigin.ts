import { devToolsStore } from "../components/devTools/_stores/devToolsStore";
import { UrlStore } from "../stores/urlStore/urlStore";
import { API_OVERRIDE_PREFIX } from "../urlParams/commonUrlParams";

export function getEnv(apiName?: string) {
  let env = "";
  if (apiName) {
    // allow user to override specific backend
    const searchParams = new URLSearchParams(location.search);
    env = searchParams.get(`api_${apiName}`) ?? "";
  }

  if (!env) {
    if (devToolsStore.environment.includes(":")) {
      env = devToolsStore.environment.replace(/\:.+$/, "");
    } else {
      env = devToolsStore.environment;
    }
  }

  return env;
}

function getPort() {
  if (devToolsStore.environment.includes(":")) {
    return devToolsStore.environment.replace(/^.+:/, ":");
  } else {
    return "";
  }
}

function getDomainPrefix(env: string) {
  return env ? env + "-" : "";
}

function getDomainSuffix(env: string) {
  if (env === "") {
    return "";
  } else if (env === "stage") {
    return ".stage";
  } else {
    return ".rnd";
  }
}

function getProtocol() {
  if (devToolsStore.isForceHttp) {
    return "http";
  } else {
    return "https";
  }
}

export function getOriginForApi(apiName: string, env = getEnv(apiName), customPrefix: string = "") {
  const envPort = getPort();
  const domainPrefix = getDomainPrefix(env);
  const domainSuffix = getDomainSuffix(env);
  const protocol = getProtocol();

  const apiOverride = UrlStore.getInstance().getParam(API_OVERRIDE_PREFIX + apiName);
  if (apiOverride) {
    return protocol + "://" + apiOverride;
  } else {
    return protocol + "://" + customPrefix + domainPrefix + apiName + domainSuffix + ".cqloud.com" + envPort;
  }
}

export const LOGIN_ORIGIN = getOriginForApi("login");
