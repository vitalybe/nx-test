import { UrlStore } from "common/stores/urlStore/urlStore";
import { ProjectUrlParamsType } from "src/_stores/projectUrlParams";

export class ProjectUrlStore extends UrlStore {
  static getInstance() {
    return UrlStore.getInstance() as UrlStore<ProjectUrlParamsType>;
  }
}
