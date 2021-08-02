import { UrlStore } from "@qwilt/common/stores/urlStore/urlStore";
import { ProjectUrlParamsType } from "./projectUrlParams";

export class ProjectUrlStore extends UrlStore {
  static getInstance() {
    return UrlStore.getInstance() as UrlStore<ProjectUrlParamsType>;
  }
}
