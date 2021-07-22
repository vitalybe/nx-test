export interface BrowserHref {
  getDocumentHref(): string;
  historyPushState(href: string): void;
}
