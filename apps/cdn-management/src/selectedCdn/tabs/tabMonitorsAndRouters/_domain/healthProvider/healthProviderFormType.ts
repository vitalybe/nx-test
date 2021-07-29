import * as yup from "yup";

export const HealthProviderFormSchema = yup
  .object()
  .shape({
    hostname: yup
      .string()
      .label("Hostname")
      .required(),
    priority: yup
      .number()
      .label("Priority")
      .required(),
  })
  .required();

export type HealthProviderFormType = yup.InferType<typeof HealthProviderFormSchema>;
