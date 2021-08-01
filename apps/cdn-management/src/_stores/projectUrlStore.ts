import { UrlStore } from "@qwilt/common/stores/urlStore/urlStore";
import { ProjectUrlParamsType } from "./projectUrlParams";

export class ProjectUrlStore extends UrlStore<ProjectUrlParamsType> {
  static getInstance(): UrlStore<ProjectUrlParamsType> {
    return UrlStore.getInstance() as UrlStore<ProjectUrlParamsType>;
  }
}
