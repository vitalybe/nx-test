import * as React from "react";
import { useEffect } from "react";
import styled from "styled-components";
import { loggerCreator } from "../../../../../../../utils/logger";
import { DateTime } from "luxon";
import { useEventCallback } from "../../../../../../../utils/hooks/useEventCallback";
import { useQcForm } from "../../../../../../qcComponents/form/_parts/QcFormProvider";
import { useMountedRef } from "../../../../../../../utils/hooks/useMountedRef";
import { createTypedDatePicker } from "../../../../../../qcComponents/form/formDatePicker/FormDatePicker";
import { QcForm } from "../../../../../../qcComponents/form/qcForm/QcForm";
import { Notifier } from "../../../../../../../utils/notifications/notifier";
import { editInvoiceSentDateFormSchema, EditInvoiceSentDateFormType } from "./editInvoiceSentDateFormSchema";
import _ from "lodash";
import { SelectOption } from "../../../../../../qcComponents/form/_raw/formSelectRaw/FormSelectRaw";
import { createTypedSelect } from "../../../../../../qcComponents/form/formSelect/FormSelect";
import { MonetizationPaymentEntity } from "../../../../_domain/monetizationPaymentEntity";

// noinspection JSUnusedLocalSymbols
const moduleLogger = loggerCreator("__filename");

//region [[ Styles ]]

const FormGrid = styled.div`
  display: grid;
  grid-auto-flow: row;
  grid-auto-columns: 50%;
  align-items: flex-end;
  grid-gap: 2.5rem;
`;

const EditInvoiceSentDateFormView = styled.div`
  min-width: 32rem;
  max-width: 45vw;
  max-height: 60vh;
  min-height: 21.25rem;
  display: flex;
  flex-direction: column;
`;

//endregion [[ Styles ]]

//region [[ Props ]]

export interface Props<T extends MonetizationPaymentEntity> {
  payments: T[];
  onEdit: (payment: T, data: EditInvoiceSentDateFormType) => Promise<unknown>;
  closeFn: (didEdit?: boolean) => void;
  className?: string;
}

//endregion [[ Props ]]

const FormSelect = createTypedSelect<EditInvoiceSentDateFormType>();
const FormDatePicker = createTypedDatePicker<EditInvoiceSentDateFormType>();

export function EditInvoiceSentDateForm<T extends MonetizationPaymentEntity>({ ...props }: Props<T>) {
  const isMountedRef = useMountedRef();
  const paymentsByMonth = _.groupBy(props.payments, ({ date }) => date.month);
  const monthsOptions: SelectOption[] = createMonthOptions(paymentsByMonth);
  const defaultMonth = monthsOptions.find(({ disabled }) => !disabled)?.value.toString();
  const defaultPayment = defaultMonth ? paymentsByMonth[defaultMonth]?.[0] : undefined;

  const form = useQcForm<EditInvoiceSentDateFormType>(editInvoiceSentDateFormSchema, {
    defaultValues: {
      month: defaultMonth,
      invoiceSentDate: defaultPayment?.invoiceSentDate?.toJSDate(),
    },
  });

  const { month: selectedMonth } = form.watch();

  useEffect(() => {
    const initialValue = paymentsByMonth[selectedMonth]?.[0]?.invoiceSentDate;
    form.setValue("invoiceSentDate", initialValue?.toJSDate());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMonth]);

  const onSubmit = useEventCallback(async (data: EditInvoiceSentDateFormType) => {
    const paymentEntity = paymentsByMonth[data.month]?.[0];
    let didSucceed = false;
    if (paymentEntity) {
      try {
        await props.onEdit(paymentEntity, data);
        didSucceed = true;
        if (isMountedRef.current) {
          setTimeout(() => props.closeFn(didSucceed), 1000);
        }
      } catch (e) {
        Notifier.modal("Failed To Update Payment Invoice Sent Date ", e);
      }
    } else {
      Notifier.error("Failed To Update Payment Invoice Sent Date ", {
        message: "No Payment Selected",
        name: "missing payment",
      });
    }
  });
  return (
    <EditInvoiceSentDateFormView className={props.className}>
      <QcForm<EditInvoiceSentDateFormType>
        form={form}
        onSubmit={onSubmit}
        controlsOptions={{
          actionText: "Update",
          loadingText: "Updating",
          onCancel: props.closeFn,
        }}>
        <FormGrid>
          <FormSelect name={"month"} label={"Month"} options={monthsOptions} />
          <FormDatePicker name={"invoiceSentDate"} label={"New Invoice Sent Date: "} />
        </FormGrid>
      </QcForm>
    </EditInvoiceSentDateFormView>
  );
}

function getMonthLong(n: number | string) {
  const month = _.toNumber(n);
  return isNaN(month) ? "N/A" : DateTime.fromObject({ month }).monthLong;
}

function createMonthOption(monthGroups: Record<string, MonetizationPaymentEntity[]>, month: string): SelectOption {
  return {
    label: getMonthLong(month),
    value: month,
    disabled: !monthGroups[month].every(({ allCpPaymentsReceived }) => allCpPaymentsReceived),
  };
}
function createMonthOptions(monthGroups: Record<string, MonetizationPaymentEntity[]>): SelectOption[] {
  return _.orderBy(
    Object.keys(monthGroups).map((month) => createMonthOption(monthGroups, month)),
    ({ value }) => _.toNumber(value),
    "desc"
  );
}
