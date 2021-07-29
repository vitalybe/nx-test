import { loggerCreator } from "../utils/logger";
import { AjaxMetadata } from "../utils/ajax";
import { SystemEventsExternalApi } from "../backend/systemEvents";
import {
  SystemEventApiType,
  SystemEventsExternalSearchParams,
  SystemUpdateExternalApiType,
} from "../backend/systemEvents/_types/systemEventsTypes";
import { DateTime } from "luxon";
import { SystemUpdateExternalEntity } from "../domain/systemEventsExternal/systemUpdateExternalEntity";
import { SystemEventExternalEntity } from "../domain/systemEventsExternal/systemEventExternalEntity";
import _, { Dictionary } from "lodash";
import { Utils } from "../utils/utils";

const moduleLogger = loggerCreator("__filename");

export class SystemEventsExternalProvider {
  private constructor() {}

  provideAllUpdates = async (
    metadata: AjaxMetadata,
    options?: SystemEventsExternalSearchParams
  ): Promise<SystemUpdateExternalEntity[]> => {
    const itemsPerPage = 1000;
    // fetching all updates
    const updates: SystemUpdateExternalApiType[] = await Utils.fetchAllPages<SystemUpdateExternalApiType>(
      async (itemsPerPage, pageNumber) => {
        const data = await SystemEventsExternalApi.instance.listSystemUpdates(metadata, {
          ...options,
          itemsPerPage,
          pageNumber,
        });
        return data.updates;
      },
      itemsPerPage
    );
    // fetching all events
    let eventsByUpdateId: Dictionary<SystemEventApiType[]> = {};
    if (updates.length > 0) {
      const events: SystemEventApiType[] = await SystemEventsExternalProvider.instance.provideAllEvents(
        metadata,
        options
      );
      eventsByUpdateId = _.groupBy(events, ({ updateId }) => updateId);
    }
    return updates.map(update => this.updateFromApiType(update, eventsByUpdateId[update.updateId]));
  };

  provideAllEvents = async (
    metadata: AjaxMetadata,
    options?: SystemEventsExternalSearchParams
  ): Promise<SystemEventApiType[]> => {
    const itemsPerPage = 20000;
    return await Utils.fetchAllPages<SystemEventApiType>(async (itemsPerPage, pageNumber) => {
      const data = await SystemEventsExternalApi.instance.listSystemEvents(metadata, {
        ...options,
        itemsPerPage,
        pageNumber,
      });
      return data.events;
    }, itemsPerPage);
  };
  provideUpdates = async (
    metadata: AjaxMetadata,
    options?: SystemEventsExternalSearchParams
  ): Promise<SystemUpdateExternalEntity[]> => {
    const { updates } = await SystemEventsExternalApi.instance.listSystemUpdates(metadata, options);
    let eventsByUpdateId: Dictionary<SystemEventApiType[]> = {};
    if (updates.length > 0) {
      const { events } = await SystemEventsExternalApi.instance.listSystemEvents(metadata, options);
      eventsByUpdateId = _.groupBy(events, ({ updateId }) => updateId);
    }
    return updates.map(update => this.updateFromApiType(update, eventsByUpdateId[update.updateId]));
  };

  updateFromApiType(updateApi: SystemUpdateExternalApiType, events: SystemEventApiType[] = []) {
    return new SystemUpdateExternalEntity({
      id: updateApi.updateId,
      component: updateApi.component,
      kind: updateApi.method,
      startTime: DateTime.fromSeconds(updateApi.startTimeEpoch),
      endTime: DateTime.fromSeconds(updateApi.endTimeEpoch),
      expectedEffect: updateApi.expectedEffect,
      description: updateApi.description,
      systemEvents: events.map(this.eventFromApiType),
    });
  }

  eventFromApiType(eventApi: SystemEventApiType) {
    return new SystemEventExternalEntity({
      id: eventApi.eventId,
      update: eventApi.updateId ?? "N/A",
      dateTime: DateTime.fromSeconds(eventApi.timestampEpoch),
      qnId: eventApi.systemId,
      qnName: eventApi.qnName,
      component: eventApi.component,
      type: eventApi.updateMethod,
      description: eventApi.description ?? undefined,
      impact: eventApi.expectedEffect ?? undefined,
    });
  }
  //region [[ Singleton ]]
  private static _instance: SystemEventsExternalProvider | undefined;
  static get instance(): SystemEventsExternalProvider {
    if (!this._instance) {
      this._instance = new SystemEventsExternalProvider();
    }

    return this._instance;
  }
  //endregion
}
