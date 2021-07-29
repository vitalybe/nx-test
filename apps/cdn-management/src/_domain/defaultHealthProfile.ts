import { DeliveryUnitHealthProfileApiType } from "common/backend/cdns/_types/deliveryUnitApiType";

export const defaultHealthProfile: DeliveryUnitHealthProfileApiType = {
  healthMinAvailableBwKbpsEnabled: false,
  healthMinAvailableBwKbps: 0,
  healthMaxLoadAverage: 25,
  healthMaxQueryTimeMs: 2000,
  healthConnectionTimeoutMs: 2000,
  healthHistoryCount: 30,
  healthPollUrlTemplate: null,
  healthSampleTimeMs: 1000,
  healthReportTimeMs: 200,
  healthRequestTimeoutMs: 400,
  healthRequestTimeWarnMs: 100,
};
