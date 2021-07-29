import { BrowserHrefReal } from "./browserHrefReal";

export class BrowserHrefMock implements BrowserHrefReal {
  href = "http://qc-services-mock.cqloud.com/";

  getDocumentHref(): string {
    return this.href;
  }

  historyPushState(href: string): void {
    this.href = href;
  }
}
