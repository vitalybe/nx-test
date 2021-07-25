import { UnitNameEnum, unitsFormatter } from "common/utils/unitsFormatter";

interface PricingRateParams {
  revenue: number | undefined;
  volume: number | undefined;
  perUnit: UnitNameEnum;
}

export enum CurrencyUnitEnum {
  US_DOLLAR = "USD",
}

export class CurrencyUtils {
  static format(value: number, unit: CurrencyUnitEnum = CurrencyUnitEnum.US_DOLLAR, precision = 2) {
    const formatted = unitsFormatter.format(value);
    return this.getCurrencySign(unit) + formatted.getRounded(precision) + formatted.unit;
  }
  static formatFullNumber(value: number, unit: CurrencyUnitEnum = CurrencyUnitEnum.US_DOLLAR) {
    return this.getCurrencySign(unit) + value.toLocaleString("en-US", { maximumFractionDigits: 2 });
  }
  static getCurrencySign(currency: CurrencyUnitEnum = CurrencyUnitEnum.US_DOLLAR) {
    const dict = {
      [CurrencyUnitEnum.US_DOLLAR]: "$",
    };
    return dict[currency] ?? "N/A";
  }
  static getUsdRatePerVolume({ revenue, volume, perUnit }: PricingRateParams) {
    if (revenue && volume) {
      const volumeInUnit = unitsFormatter.convert(volume, perUnit).unitValue;
      return revenue / volumeInUnit;
    } else {
      return 0;
    }
  }
}
