import { BrowserHrefReal } from "common/stores/urlStore/browserUrl/browserHrefReal";

export class BrowserHrefBuilder implements BrowserHrefReal {
  href = document.location.href;

  getDocumentHref(): string {
    return this.href;
  }

  historyPushState(href: string): void {
    this.href = href;
  }
}
