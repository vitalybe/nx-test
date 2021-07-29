import * as yup from "yup";

export const CacheEntitySchema = yup
  .object()
  .shape({
    group: yup.object().label("Group"),
    operationalMode: yup
      .string()
      .oneOf(["online", "offline", "force-online", "out-of-service"])
      .label("Operational Mode"),
    monitoringSegmentId: yup.string().label("Monitor Segment"),
    healthProfile: yup
      .object()
      .shape({
        healthMinAvailableBwKbpsEnabled: yup.boolean().required(),
        healthMinAvailableBwKbps: yup.number().required(),
        healthMaxLoadAverage: yup.number().required(),
        healthMaxQueryTimeMs: yup.number().required(),
        healthConnectionTimeoutMs: yup.number().required(),
        healthHistoryCount: yup.number().required(),
        healthPollUrlTemplate: yup.string().nullable(),
        healthSampleTimeMs: yup.number().required(),
        healthReportTimeMs: yup.number().required(),
        healthRequestTimeoutMs: yup.number().required(),
        healthRequestTimeWarnMs: yup.number().required(),
      })
      .label("Health Profile"),
    disabledFields: yup
      .object()
      .shape({
        group: yup.boolean().required(),
        operationalMode: yup.boolean().required(),
        monitoringSegmentId: yup.boolean().required(),
        healthProfile: yup.boolean().required(),
      })
      .required(),
  })
  .required();

export type CacheEntityFormType = yup.InferType<typeof CacheEntitySchema>;
