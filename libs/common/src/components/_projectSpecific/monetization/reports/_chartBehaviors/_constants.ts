import { transparentize } from "polished";
import { YAxisBehavior } from "../../../../qwiltChart/_behaviors/yAxisBehavior/yAxisBehavior";
import { OnlyData } from "../../../../../utils/typescriptUtils";
import { CurrencyUnitEnum, CurrencyUtils } from "../../_utils/currencyUtils";
import { Fonts } from "../../../../../styling/fonts";
import { Duration } from "luxon";
import { XAxisBehavior } from "../../../../qwiltChart/_behaviors/xAxisBehavior/xAxisBehavior";
import { CommonColors } from "../../../../../styling/commonColors";

export const getCommonYAxisOptions = (currencyUnit?: CurrencyUnitEnum) => {
  const currencySign = currencyUnit && CurrencyUtils.getCurrencySign(currencyUnit);
  return {
    gridLineColor: CommonColors.PATTENS_BLUE,
    showFirstLabel: true,
    lastLabelFormatter: (value, unit, largestUnitName) => {
      return `<span style="color: ${
        CommonColors.BLUE_LAGOON
      }; font-weight: 600; font-size: 0.75rem; line-height: 2.5rem; font-family: Avenir, sans-serif !important;">
        ${currencySign ? `${currencySign} ${largestUnitName ? `(${largestUnitName})` : ""}` : largestUnitName}
      </span>`;
    },
    singleAxis: true,
    tickAmount: 7,
    labelsColor: transparentize(0.4, CommonColors.SHERPA_BLUE),
    hideUnits: true,
    labelOptions: {
      useHTML: true,
      style: {
        fontSize: "0.625rem",
      },
    },
  } as Partial<OnlyData<YAxisBehavior>>;
};
export const commonXAxisOptions: Partial<XAxisBehavior> = {
  startLabelsPercent: 0,
  maxPadding: 0.05,
  minPadding: 0.05,
  fixedTickEvery: Duration.fromObject({ months: 1 }),
  regularStyle: `font-weight: bold`,
  labelsColor: transparentize(0.5, CommonColors.SHERPA_BLUE),
  showBothRegularHighlightedLabels: true,
};
export const commonDataLabelsOption = {
  inside: false,
  useHTML: true,
  style: {
    textOutline: "",
    color: CommonColors.SHERPA_BLUE,
    fontFamily: Fonts.FONT_FAMILY,
    fontSize: "12px",
    fontWeight: "500",
    whiteSpace: "normal",
  },
};
