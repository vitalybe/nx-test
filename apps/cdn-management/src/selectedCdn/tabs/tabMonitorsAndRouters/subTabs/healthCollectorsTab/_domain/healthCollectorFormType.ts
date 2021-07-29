import { ServerStatus } from "common/backend/trafficRoutersMonitors/_types/trafficRoutersMonitorsTypes";
import { enumValues } from "common/utils/typescriptUtils";
import { ServerEntityStatus } from "src/selectedCdn/tabs/tabMonitorsAndRouters/_domain/server/oldServerEntity";
import * as yup from "yup";

export const HealthCollectorFormSchema = yup
  .object()
  .shape({
    healthCollectorRegion: yup
      .string()
      .required()
      .label("Health Collector Region"),
    status: yup
      .mixed<ServerEntityStatus>()
      .required()
      .oneOf(enumValues(ServerStatus)),
  })
  .required();

export type HealthCollectorFormType = yup.InferType<typeof HealthCollectorFormSchema>;
