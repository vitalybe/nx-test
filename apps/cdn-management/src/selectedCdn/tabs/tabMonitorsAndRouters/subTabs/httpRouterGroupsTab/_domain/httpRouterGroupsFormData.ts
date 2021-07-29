import * as yup from "yup";
import { string } from "yup";

export const HttpRouterGroupsFormSchema = yup
  .object()
  .shape({
    name: yup
      .string()
      .required()
      .label("Name"),
    ttl: yup
      .number()
      .required()
      .label("TTL"),
    dnsName: yup
      .string()
      .required()
      .label("DNS Name"),
    fallbackGroupsIds: yup
      .array()
      .of(string().defined())
      .label("Fallbacks")
      .defined(),
  })
  .defined();

export type HttpRouterGroupsFormData = yup.InferType<typeof HttpRouterGroupsFormSchema>;
