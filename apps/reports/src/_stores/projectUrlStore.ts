import { UrlStore } from "common/index";
import { ProjectUrlParamsType } from "src/_stores/projectUrlParams";

export class ProjectUrlStore extends UrlStore {
  static getInstance() {
    return UrlStore.getInstance() as UrlStore<ProjectUrlParamsType>;
  }
}
