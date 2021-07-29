import { UrlStore } from "common/stores/urlStore/urlStore";
import { ProjectUrlParamsType } from "src/_stores/projectUrlParams";

export class ProjectUrlStore extends UrlStore<ProjectUrlParamsType> {
  static getInstance(): UrlStore<ProjectUrlParamsType> {
    return UrlStore.getInstance() as UrlStore<ProjectUrlParamsType>;
  }
}
