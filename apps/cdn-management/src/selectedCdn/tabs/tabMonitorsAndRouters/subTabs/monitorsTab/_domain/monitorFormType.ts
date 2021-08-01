import { ServerStatus } from "common/backend/trafficRoutersMonitors/_types/trafficRoutersMonitorsTypes";
import { enumValues } from "common/utils/typescriptUtils";
import { ServerEntityStatus } from "src/selectedCdn/tabs/tabMonitorsAndRouters/_domain/server/oldServerEntity";
import * as yup from "yup";

export const MonitorFormSchema = yup
  .object()
  .shape({
    segmentId: yup
      .string()
      .required()
      .label("Segment ID"),
    status: yup
      .mixed<ServerEntityStatus>()
      .required()
      .oneOf(enumValues(ServerStatus)),
  })
  .required();

export type MonitorFormType = yup.InferType<typeof MonitorFormSchema>;
