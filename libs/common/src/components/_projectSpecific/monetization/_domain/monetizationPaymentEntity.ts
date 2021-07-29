import { loggerCreator } from "../../../../utils/logger";
import { mockUtils } from "../../../../utils/mockUtils";
import { DateTime } from "luxon";
import { CurrencyUnitEnum } from "../_utils/currencyUtils";

// noinspection JSUnusedLocalSymbols
const moduleLogger = loggerCreator("__filename");

interface MonetizationPaymentEntityParams {
  paymentId: string;
  date: DateTime;
  amount: number;
  currency: CurrencyUnitEnum;
  invoiceSentDate?: DateTime | undefined;
  allCpPaymentsReceived?: boolean;
}

export class MonetizationPaymentEntity {
  constructor(data: MonetizationPaymentEntityParams) {
    Object.assign(this, data);
  }

  // Mock
  static createMock(overrides?: Partial<MonetizationPaymentEntityParams>, id = mockUtils.sequentialId()) {
    return new MonetizationPaymentEntity({
      paymentId: id.toString(),
      date: DateTime.fromObject({ month: 1, year: 2020 }),
      amount: 20_293.32,
      currency: CurrencyUnitEnum.US_DOLLAR,
      ...overrides,
    });
  }
}

// utility - merges parameters as class members
export interface MonetizationPaymentEntity extends MonetizationPaymentEntityParams {}
