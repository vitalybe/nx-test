import * as yup from "yup";
import { string } from "yup";

export const MonitorSegmentFormSchema = yup
  .object()
  .shape({
    id: yup
      .string()
      .required()
      .label("Id"),
  healthCollectors: yup
      .array()
      .of(string().defined())
      .defined()
    .label("Health Collectors"),
  })
  .defined();

export type MonitorSegmentFormData = yup.InferType<typeof MonitorSegmentFormSchema>;
