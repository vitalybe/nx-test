import * as _ from "lodash";
import { Duration } from "luxon";

export enum UnitKindEnum {
  COUNT = "count",
  TRAFFIC = "traffic",
  PERCENT = "percent",
  VOLUME = "volume",
  DURATION = "duration",
  TPS = "tps",
}

export enum UnitNameEnum {
  TRAFFIC_PBPS = "Pbps",
  TRAFFIC_TBPS = "Tbps",
  TRAFFIC_GBPS = "Gbps",
  TRAFFIC_MBPS = "Mbps",
  TRAFFIC_KBPS = "Kbps",
  TRAFFIC_BPS = "bps",

  TPS_PETA = "P TPS",
  TPS_TRILLION = "T TPS",
  TPS_BILLION = "B TPS",
  TPS_MILLION = "M TPS",
  TPS_K = "K TPS",
  TPS_NO_UNIT = "TPS",
  COUNT_PETA = "P",
  COUNT_TRILLION = "T",
  COUNT_BILLION = "B",
  COUNT_MILLION = "M",
  COUNT_K = "K",

  COUNT_NO_UNIT = "",

  VOLUME_EB = "EB",
  VOLUME_PB = "PB",
  VOLUME_TB = "TB",
  VOLUME_GB = "GB",
  VOLUME_MB = "MB",
  VOLUME_KB = "KB",
  VOLUME_BYTE = "byte",

  MILLISECONDS = "ms",
  SECONDS = "sec",
  MINUTES = "min",
  HOURS = "hrs",
  DAYS = "d",
  WEEKS = "w",
  MONTHS = "m",
  YEARS = "y",

  PERCENT = "%",
}

class UnitValue {
  constructor(public letter: UnitNameEnum, public minValue: number) {}
}

class UnitValues {
  constructor(public kind: UnitKindEnum, public values: UnitValue[]) {}
}

export class UnitsFormatterResult {
  constructor(
    public unitValue: number,
    public unit: UnitNameEnum,
    public originalValue: number,
    private maxValuesAfterDecimal?: number
  ) {}

  private howManyValuesAfterDecimal(value: number): number {
    const absoluteValue = Math.abs(value);
    // checking lodash.round result, since it may give inaccurate results
    // e.g. _.round(value: 99.9893843..., percision: 1) => 100 instead of 99.9,
    // causing 100 to appear with a value after decimal and we want up to 3 digits when showing numbers.
    let precision;
    if (_.round(absoluteValue, 2) < 10) {
      precision = 2;
    } else if (_.round(absoluteValue, 1) < 100) {
      precision = 1;
    } else {
      precision = 0;
    }
    if (this.maxValuesAfterDecimal !== undefined) {
      return Math.min(this.maxValuesAfterDecimal, precision);
    }
    return precision;
  }

  private formatNumber(value: number, valuesAfterDecimal: number) {
    let formattedNumber = _.round(value, valuesAfterDecimal);
    let clampedSign = "";
    // if the resulting unit is the largest, clamp the resulting number;
    if (formattedNumber > 1000) {
      formattedNumber = 1000;
      clampedSign = "+";
    }

    return formattedNumber.toFixed(valuesAfterDecimal) + clampedSign;
  }

  // Returns up to 2 values after decimals, based on number length, e.g: 1.00, 10.0, 100
  getPretty(): string {
    const valuesAfterDecimal = this.howManyValuesAfterDecimal(this.unitValue);
    return this.formatNumber(this.unitValue, valuesAfterDecimal);
  }

  // Returns fixed value, e.g for 2 valuesAfterDecimal: 1.00, 1.20, 1.25
  getFixed(valuesAfterDecimal: number): string {
    return this.formatNumber(this.unitValue, valuesAfterDecimal);
  }

  // Returns rounded to the given value, e.g for 2 valuesAfterDecimal: 1, 1.2, 1.25
  getRounded(valuesAfterDecimal: number): number {
    return _.round(this.unitValue, valuesAfterDecimal);
  }

  getPrettyWithUnit(withSpace = false) {
    const unitText = (withSpace ? " " : "") + this.unit;
    // hide unit if value is 0. to avoid long redundant string like "0.00 bps"
    return this.getPretty() + (this.unitValue > 0 ? unitText : "");
  }
}

class UnitsFormatter {
  private units = [
    new UnitValues(UnitKindEnum.TRAFFIC, [
      new UnitValue(UnitNameEnum.TRAFFIC_PBPS, Math.pow(10, 15)),
      new UnitValue(UnitNameEnum.TRAFFIC_TBPS, Math.pow(10, 12)),
      new UnitValue(UnitNameEnum.TRAFFIC_GBPS, Math.pow(10, 9)),
      new UnitValue(UnitNameEnum.TRAFFIC_MBPS, Math.pow(10, 6)),
      new UnitValue(UnitNameEnum.TRAFFIC_KBPS, Math.pow(10, 3)),
      new UnitValue(UnitNameEnum.TRAFFIC_BPS, 0),
    ]),

    new UnitValues(UnitKindEnum.COUNT, [
      new UnitValue(UnitNameEnum.COUNT_PETA, Math.pow(10, 15)),
      new UnitValue(UnitNameEnum.COUNT_TRILLION, Math.pow(10, 12)),
      new UnitValue(UnitNameEnum.COUNT_BILLION, Math.pow(10, 9)),
      new UnitValue(UnitNameEnum.COUNT_MILLION, Math.pow(10, 6)),
      new UnitValue(UnitNameEnum.COUNT_K, Math.pow(10, 3)),
      new UnitValue(UnitNameEnum.COUNT_NO_UNIT, 0),
    ]),
    new UnitValues(UnitKindEnum.TPS, [
      new UnitValue(UnitNameEnum.TPS_PETA, Math.pow(10, 15)),
      new UnitValue(UnitNameEnum.TPS_TRILLION, Math.pow(10, 12)),
      new UnitValue(UnitNameEnum.TPS_BILLION, Math.pow(10, 9)),
      new UnitValue(UnitNameEnum.TPS_MILLION, Math.pow(10, 6)),
      new UnitValue(UnitNameEnum.TPS_K, Math.pow(10, 3)),
      new UnitValue(UnitNameEnum.TPS_NO_UNIT, 0),
    ]),

    new UnitValues(UnitKindEnum.VOLUME, [
      new UnitValue(UnitNameEnum.VOLUME_EB, Math.pow(1000, 6)),
      new UnitValue(UnitNameEnum.VOLUME_PB, Math.pow(1000, 5)),
      new UnitValue(UnitNameEnum.VOLUME_TB, Math.pow(1000, 4)),
      new UnitValue(UnitNameEnum.VOLUME_GB, Math.pow(1000, 3)),
      new UnitValue(UnitNameEnum.VOLUME_MB, Math.pow(1000, 2)),
      new UnitValue(UnitNameEnum.VOLUME_KB, 1000),
      new UnitValue(UnitNameEnum.VOLUME_BYTE, 0),
    ]),

    new UnitValues(UnitKindEnum.DURATION, [
      new UnitValue(UnitNameEnum.YEARS, Duration.fromObject({ years: 1 }).as("milliseconds")),
      new UnitValue(UnitNameEnum.MONTHS, Duration.fromObject({ months: 1 }).as("milliseconds")),
      new UnitValue(UnitNameEnum.WEEKS, Duration.fromObject({ weeks: 1 }).as("milliseconds")),
      new UnitValue(UnitNameEnum.DAYS, Duration.fromObject({ days: 1 }).as("milliseconds")),
      new UnitValue(UnitNameEnum.HOURS, Duration.fromObject({ hours: 1 }).as("milliseconds")),
      new UnitValue(UnitNameEnum.MINUTES, Duration.fromObject({ minutes: 1 }).as("milliseconds")),
      new UnitValue(UnitNameEnum.SECONDS, Duration.fromObject({ seconds: 1 }).as("milliseconds")),
      new UnitValue(UnitNameEnum.MILLISECONDS, 0),
    ]),

    new UnitValues(UnitKindEnum.PERCENT, [new UnitValue(UnitNameEnum.PERCENT, 0)]),
  ];

  public format(
    originalValue: number,
    unitsKind: UnitKindEnum = UnitKindEnum.COUNT,
    maxValuesAfterDecimal?: number
  ): UnitsFormatterResult {
    let unit = UnitNameEnum.COUNT_NO_UNIT;
    let newValue = 0;

    const matchingUnits = this.units.find(unitValues => unitValues.kind === unitsKind);
    if (!matchingUnits) {
      throw new Error(`no values exist for units kind: ${unitsKind}`);
    }

    const absoluteValue = Math.abs(originalValue);
    for (const value of matchingUnits.values) {
      if (absoluteValue >= value.minValue) {
        if (originalValue === 0) {
          newValue = 0;
        }
        if (value.minValue === 0) {
          newValue = originalValue;
        } else {
          newValue = originalValue / value.minValue;
        }

        unit = value.letter;

        break;
      }
    }

    return new UnitsFormatterResult(newValue, unit, originalValue, maxValuesAfterDecimal);
  }

  public convert(originalValue: number, unitName: UnitNameEnum): UnitsFormatterResult {
    for (const unitKind of this.units) {
      for (const unitValue of unitKind.values) {
        if (unitValue.letter.toLowerCase() === unitName.toLowerCase()) {
          const roundedValue = originalValue / (unitValue.minValue || 1);
          return new UnitsFormatterResult(roundedValue, unitName, originalValue);
        }
      }
    }

    throw new Error("unit name not found: " + unitName);
  }
}

export const unitsFormatter = new UnitsFormatter();
