import * as yup from "yup";
import { HealthProviderFormSchema } from "src/selectedCdn/tabs/tabMonitorsAndRouters/_domain/healthProvider/healthProviderFormType";
import { enumValues } from "common/utils/typescriptUtils";
import { ServerEntityStatus } from "src/selectedCdn/tabs/tabMonitorsAndRouters/_domain/server/oldServerEntity";
import { ServerStatus } from "common/backend/trafficRoutersMonitors/_types/trafficRoutersMonitorsTypes";

export const HttpRouterFormSchema = yup
  .object()
  .shape({
    httpRouterGroupName: yup.string().default("").label("HTTP Router Group Name"),
    healthProviders: yup.array().required().label("Health Providers").of(HealthProviderFormSchema),
    status: yup.mixed<ServerEntityStatus>().required().oneOf(enumValues(ServerStatus)),
  })
  .required();

export type HttpRouterFormType = yup.InferType<typeof HttpRouterFormSchema>;
