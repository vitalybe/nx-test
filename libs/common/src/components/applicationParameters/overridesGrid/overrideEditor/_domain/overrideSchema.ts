import * as yup from "yup";

export const ApiOverrideSchema = yup
  .object()
  .shape({
    param: yup
      .string()
      .required()
      .label("Parameter"),
    value: yup.string().label("Value"),
  })
  .required();

export type ApiOverrideSchemaType = yup.InferType<typeof ApiOverrideSchema>;
