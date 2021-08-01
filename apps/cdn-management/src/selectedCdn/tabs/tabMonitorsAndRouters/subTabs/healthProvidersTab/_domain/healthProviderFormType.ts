import { ServerStatus } from "@qwilt/common/backend/trafficRoutersMonitors/_types/trafficRoutersMonitorsTypes";
import { enumValues } from "@qwilt/common/utils/typescriptUtils";
import { ServerEntityStatus } from "../../../_domain/server/oldServerEntity";
import * as yup from "yup";

export const HealthProviderFormSchema = yup
  .object()
  .shape({
    status: yup.mixed<ServerEntityStatus>().required().oneOf(enumValues(ServerStatus)),
  })
  .required();

export type HealthProviderFormType = yup.InferType<typeof HealthProviderFormSchema>;
