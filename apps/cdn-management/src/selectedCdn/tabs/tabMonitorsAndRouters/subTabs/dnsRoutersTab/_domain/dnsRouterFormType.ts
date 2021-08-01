import * as yup from "yup";
import { HealthProviderFormSchema } from "../../../_domain/healthProvider/healthProviderFormType";
import { enumValues } from "@qwilt/common/utils/typescriptUtils";
import { ServerEntityStatus } from "../../../_domain/server/oldServerEntity";
import { ServerStatus } from "@qwilt/common/backend/trafficRoutersMonitors/_types/trafficRoutersMonitorsTypes";

export const DnsRouterFormSchema = yup
  .object()
  .shape({
    dnsRoutingSegmentId: yup
      .string()
      .required()
      .label("DNS Routing Segment ID"),
    healthProviders: yup
      .array()
      .required()
      .label("Health Providers")
      .of(HealthProviderFormSchema),
    status: yup
      .mixed<ServerEntityStatus>()
      .required()
      .oneOf(enumValues(ServerStatus)),
  })
  .required();

export type DnsRouterFormType = yup.InferType<typeof DnsRouterFormSchema>;
