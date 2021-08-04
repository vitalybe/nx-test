import { loggerCreator } from "common/utils/logger";
import { CommonUrlParams } from "common/urlParams/commonUrlParams";
import { TimezoneUtil } from "common/components/timezonePicker/_utils/timezoneUtil";
import { computed, observable } from "mobx";
import { DateTime, Zone } from "luxon";
import { UrlStore } from "common/stores/urlStore/urlStore";

const moduleLogger = loggerCreator(__filename);

export class TimezoneStore {
  private constructor() {}

  @observable private _zone: Zone | undefined;

  @computed
  get zone() {
    let currentZone = this._zone;
    if (!currentZone) {
      const timezoneParam = UrlStore.getInstance().getParam(CommonUrlParams.timezone);

      if (timezoneParam) {
        currentZone = TimezoneUtil.getZoneMetadata(timezoneParam).zone;
      } else {
        currentZone = DateTime.local().zone;
      }
    }

    return currentZone;
  }

  set zone(value: Zone) {
    UrlStore.getInstance().setParam(CommonUrlParams.timezone, value.name);
    this._zone = value;
  }

  //region [[ Singleton ]]
  private static _instance: TimezoneStore | undefined;
  static get instance(): TimezoneStore {
    if (!this._instance) {
      this._instance = new TimezoneStore();
    }

    return this._instance;
  }
  //endregion
}
