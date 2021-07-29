import * as yup from "yup";

export const DsAssignmentFormSchema = yup
  .object()
  .shape({
    assignment: yup
      .string()
      .required()
      .label("Assignment"),
    // NOTE: This is requires since dropdown doesn't accept "false" (boolean) as a valid dropdown item value
    routing: yup
      .string()
      .label("Is Enabled")
      .oneOf(["true", "false"])
      .required(),
  })
  .defined();

export type DsAssignmentFormData = yup.InferType<typeof DsAssignmentFormSchema>;
