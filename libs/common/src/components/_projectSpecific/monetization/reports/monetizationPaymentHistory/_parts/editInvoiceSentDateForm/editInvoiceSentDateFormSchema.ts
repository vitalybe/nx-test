import * as yup from "yup";

export const editInvoiceSentDateFormSchema = yup
  .object()
  .shape({
    month: yup.string().label("Month").required(),
    invoiceSentDate: yup.date().label("New End Date").required(),
  })
  .defined();

export type EditInvoiceSentDateFormType = yup.InferType<typeof editInvoiceSentDateFormSchema>;
