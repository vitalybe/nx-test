import { ComponentTypeEnum } from "../../../../backend/systemEvents/_types/systemEventsTypes";
import { enumValues } from "../../../../utils/typescriptUtils";
import { DateTime } from "luxon";
import * as yup from "yup";

export enum SystemUpdateKind {
  TIMELY = "TIMELY",
  SCHEDULED = "SCHEDULED",
}

export const SystemUpdateSchema = yup
  .object()
  .shape({
    isCustomerFacing: yup.boolean().required(),
    affectedQnDeploymentIds: yup
      .array()
      .of(yup.number().required())
      .label("Affected QNs"),
    kind: yup
      .mixed<SystemUpdateKind>()
      .oneOf(enumValues(SystemUpdateKind))
      .label("Kind")
      .required(),
    affectedDsIds: yup
      .array()
      .of(yup.string().required())
      .label("Affected Delivery Service"),
    startTime: yup
      .mixed<DateTime>()
      .label("Start Time")
      .required(),
    endTime: yup
      .mixed<DateTime>()
      .label("End Time")
      .required(),
    lateArrivals: yup.mixed<DateTime | undefined>().label("Late Arrivals"),
    expectedEffect: yup.string().label("Expected Effect"),
    externalDescription: yup.string().label("External Description"),
    internalDescription: yup.string().label("Internal Description"),
    component: yup
      .mixed<ComponentTypeEnum>()
      .test("component", "not a valid component", value => enumValues(ComponentTypeEnum).includes(value))
      .required(),
  })
  .defined();

export type SystemUpdateSchemaType = yup.InferType<typeof SystemUpdateSchema>;
