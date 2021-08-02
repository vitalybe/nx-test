import * as React from "react";
import { computed } from "mobx";
import { UrlStore } from "../../../stores/urlStore/urlStore";
import { CommonUrlParams } from "../../../urlParams/commonUrlParams";

export class MainStore {
  @computed
  get restrictQn() {
    return UrlStore.getInstance().getArrayParam(CommonUrlParams.restrictQn);
  }

  @computed
  get restrictNetwork() {
    return UrlStore.getInstance().getArrayParam(CommonUrlParams.restrictNetwork);
  }

  //region versionParams
  @computed
  get selectedVersion(): string | undefined {
    return UrlStore.getInstance().getParam(CommonUrlParams.qnVersion) ?? undefined;
  }

  set selectedVersion(value: string | undefined) {
    if (!value) {
      UrlStore.getInstance().removeParam(CommonUrlParams.qnVersion);
    } else {
      UrlStore.getInstance().setParam(CommonUrlParams.qnVersion, value);
    }
  }
  //endregion

  constructor() {}

  // Mock
  static createMock(): MainStore {
    return new MainStore();
  }
}

export const MainStoreContext = React.createContext<MainStore | undefined>(undefined);
