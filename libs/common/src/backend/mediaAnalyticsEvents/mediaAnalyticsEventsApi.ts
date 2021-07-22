import { Ajax, AjaxMetadata } from "../../utils/ajax";
import { UrlParams } from "../_utils/urlParams";
import { getOriginForApi } from "../backendOrigin";

export interface MediaAnalyticsSubEvent {
  "sub-header": string;
  "start-epoch": number; //seconds timestamp
  "end-epoch": number; //seconds timestamp
  id: number;
}

export interface ErrorStatusApiType {
  error?: boolean;
  status?: string;
  message?: string;
}

export interface MediaAnalyticsEvent extends ErrorStatusApiType {
  id: number;
  name: string;
  "start-epoch": number; //seconds timestamp
  "end-epoch": number; //seconds timestamp
  "sub-events": MediaAnalyticsSubEvent[];
}

export interface MediaAnalyticsEventsResponse {
  events: MediaAnalyticsEvent[];
}

class MediaAnalyticsEventsApi {
  readonly originUrl = getOriginForApi("media-analytics-events");

  getEventsData = async (metadata: AjaxMetadata = new AjaxMetadata(true)) => {
    const params = new UrlParams({ api: true });

    const url = new URL(`${this.originUrl}/api/1.0/events/${params.stringified}`);
    const json = (await Ajax.getJson(url.href, metadata)) as ErrorStatusApiType;
    if (json.error) {
      throw new Error(`${json.status}: ${json.message}`);
    }
    return json as Promise<MediaAnalyticsEventsResponse>;
  };
}

export const mediaAnalyticsEventsApi = new MediaAnalyticsEventsApi();
