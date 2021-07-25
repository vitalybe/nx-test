const OKTA_ORG_URL = "https://qwilt.okta.com";

const CQ_PROD_CLIENT_ID = "0oa19qbocVyTAHps02p6";
const CQ_PROD_AUTH_SERVER_ID = "aus19xfet1QSfjPmc2p6";

const CQ_DEV_CLIENT_ID = "0oa18x778FQm2zFWD2p6";
const CQ_DEV_AUTH_SERVER_ID = "aus19phz6fpTEYh5w2p6";

const OKTA_DEV_ORG_URL = "https://dev-942116.okta.com";
const OKTA_DEV_CLIENT_ID = "0oakxjsyrmnNLMbmx356";
const OKTA_DEV_AUTH_SERVER_ID = "auskxopy16XP83uXV356";

const isOktaDev = new URLSearchParams(location.search).has("oktaDev");

export function getOktaUrl() {
  return isOktaDev ? OKTA_DEV_ORG_URL : OKTA_ORG_URL;
}

export function getOktaClientId(isDevEnv: boolean) {
  if (isOktaDev) {
    return OKTA_DEV_CLIENT_ID;
  } else {
    return isDevEnv ? CQ_DEV_CLIENT_ID : CQ_PROD_CLIENT_ID;
  }
}

export function getOktaServerId(isDevEnv: boolean) {
  if (isOktaDev) {
    return OKTA_DEV_AUTH_SERVER_ID;
  } else {
    return isDevEnv ? CQ_DEV_AUTH_SERVER_ID : CQ_PROD_AUTH_SERVER_ID;
  }
}
