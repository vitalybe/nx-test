import { BrowserHref } from "common/stores/urlStore/browserUrl/browserHref";

export class BrowserHrefReal implements BrowserHref {
  getDocumentHref(): string {
    return window.location.href;
  }

  historyPushState(href: string): void {
    history.pushState({}, "", href.toString());
  }
}
