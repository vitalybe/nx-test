import { ServerStatus } from "common/backend/trafficRoutersMonitors/_types/trafficRoutersMonitorsTypes";
import { enumValues } from "common/utils/typescriptUtils";
import { ServerEntityStatus } from "src/selectedCdn/tabs/tabMonitorsAndRouters/_domain/server/oldServerEntity";
import * as yup from "yup";

export const HealthProviderFormSchema = yup
  .object()
  .shape({
    status: yup.mixed<ServerEntityStatus>().required().oneOf(enumValues(ServerStatus)),
  })
  .required();

export type HealthProviderFormType = yup.InferType<typeof HealthProviderFormSchema>;
