import { CSSObject, PlotLines } from "highcharts";
import { Fonts } from "../../../../../styling/fonts";
import { transparentize } from "polished";
import { DateTime, Duration } from "luxon";
import { MarkersOnHoverBehavior } from "../../../../qwiltChart/_behaviors/markersOnHoverBehavior/markersOnHoverBehavior";
import { AddSeriesBehavior } from "../../../../qwiltChart/_behaviors/addSeriesBehavior/addSeriesBehavior";
import { XAxisBehavior } from "../../../../qwiltChart/_behaviors/xAxisBehavior/xAxisBehavior";
import { YAxisBehavior } from "../../../../qwiltChart/_behaviors/yAxisBehavior/yAxisBehavior";
import {
  FinancingPhaseData,
  MonetizationProjectEntity,
} from "../../_domain/monetizationProjectEntity";
import { CurrencyUnitEnum } from "../../_utils/currencyUtils";
import { ChartBehavior } from "../../../../qwiltChart/_domain/chartBehavior";
import { OnlyData } from "../../../../../utils/typescriptUtils";
import { getCommonYAxisOptions } from "../_chartBehaviors/_constants";
import { ProjectPhasesBehavior } from "../_chartBehaviors/projectPhasesBehavior";
import { NoTooltipBehavior } from "../_chartBehaviors/noTooltipBehavior";
import { CommonColors } from "../../../../../styling/commonColors";
import { MultiProjectPhaseMarkersBehavior } from "../_chartBehaviors/bubbleMarkers/multiProjectPhaseMarkersBehavior";

export function getOverallRevenueChartBehaviors(
  markersBehavior: MarkersOnHoverBehavior,
  startDate: DateTime,
  endDate: DateTime,
  projects: MonetizationProjectEntity[],
  isPrintMode?: boolean
) {
  const xAxisOptions: Partial<OnlyData<XAxisBehavior>> = {
    fixedRange: { startDate, endDate },
    fixedTickEvery: Duration.fromObject({ years: 1 }),
    gridLineColor: transparentize(0.95, "black"),
    gridLineWidth: 2,
    regularStyle: `font-weight: bold`,
    labelsXPosition: 16,
    labelsColor: transparentize(0.5, CommonColors.SHERPA_BLUE),
    startLabelsPercent: 0,
    minorGridLine: {
      color: transparentize(0.95, "black"),
      width: 1,
      tickInterval: Duration.fromObject({ years: 1 }).as("milliseconds") / 6,
    },
  };

  const singleProject = projects.length === 1 ? projects[0] : undefined;
  const yAxisOptions: Partial<OnlyData<YAxisBehavior>> = {
    ...getCommonYAxisOptions(CurrencyUnitEnum.US_DOLLAR),
    singleAxis: false,
    gridLineColor: undefined,
    axisMax: singleProject?.financingPhaseData?.threshold ? singleProject.financingPhaseData.threshold * 2 : undefined,
    labelsColor: transparentize(0.3, CommonColors.SHERPA_BLUE),
  };

  if (singleProject?.financingPhaseData) {
    const { xAxisPlotLines, yAxisPlotLines } = createPlotLinesForFinancingPhase(
      startDate,
      singleProject.financingPhaseData,
      isPrintMode
    );
    xAxisOptions.plotLines = xAxisPlotLines;
    yAxisOptions.plotLines = yAxisPlotLines;
  }

  const behaviors: ChartBehavior[] = [
    new AddSeriesBehavior(),
    new XAxisBehavior(xAxisOptions),
    new YAxisBehavior(yAxisOptions),
    markersBehavior,
    new NoTooltipBehavior(),
  ];

  if (singleProject?.financingPhaseData) {
    const finEndDate = singleProject.financingPhaseData.endDate;
    const financingPhaseData = {
      ...singleProject.financingPhaseData,
      endDate:
        finEndDate && finEndDate.startOf("month").toMillis() <= endDate.startOf("month").toMillis()
          ? finEndDate
          : undefined,
    };

    behaviors.push(new ProjectPhasesBehavior({ financingPhaseData, projectStartDate: startDate }));
  } else {
    behaviors.push(new MultiProjectPhaseMarkersBehavior({ projects }));
  }

  return behaviors;
}

export function createPlotLinesForFinancingPhase(
  projectStartDate: DateTime,
  { endDate, expectedEndDate, threshold }: FinancingPhaseData,
  isPrintMode?: boolean
) {
  const xAxisPlotLines: PlotLines[] = [];
  const yAxisPlotLines: PlotLines[] = [];

  const commonLabelCss = {
    color: CommonColors.SHERPA_BLUE,
    fontSize: "0.625rem",
    cursor: "default",
    fontFamily: Fonts.FONT_FAMILY,
  };
  if (expectedEndDate && projectStartDate.toMillis() < expectedEndDate.toMillis()) {
    const expectedEndDateMillis = expectedEndDate.toMillis();
    const isRightAligned = expectedEndDateMillis < (endDate?.toMillis() ?? 0);
    xAxisPlotLines.push({
      value: expectedEndDateMillis,
      color: transparentize(0.4, CommonColors.ARAPAWA),
      width: 2,
      zIndex: 999,
      dashStyle: "ShortDot",
      label: {
        x: isRightAligned ? 20 : 0,
        y: 40,
        textAlign: isRightAligned ? "right" : "left",
        rotation: 0,
        text: isPrintMode ? "" : "Expected completion of Financing Phase",
        useHTML: true,
        style: {
          ...commonLabelCss,
          width: 160,
          padding: "0.5rem",
          fontWeight: "300",
          opacity: 0.7,
        } as CSSObject,
      },
    });
  }
  if (endDate) {
    const actualEndDateMillis = endDate.toMillis();
    const isRightAligned = actualEndDateMillis < (expectedEndDate?.toMillis() ?? 0);
    xAxisPlotLines.push({
      value: actualEndDateMillis,
      color: CommonColors.SHERPA_BLUE,
      width: 1,
      zIndex: 999,
      label: {
        x: isRightAligned ? 30 : 0,
        y: 40,
        textAlign: isRightAligned ? "right" : "left",
        rotation: 0,
        text: isPrintMode ? "" : "Actual completion of Financing Phase",
        useHTML: true,
        style: {
          ...commonLabelCss,
          width: 160,
          padding: "0.5rem",
          fontWeight: "600",
        } as CSSObject,
      },
    });
  }
  if (threshold) {
    yAxisPlotLines.push({
      value: threshold,
      color: CommonColors.ARAPAWA,
      width: 2,
      dashStyle: "ShortDot",
      zIndex: 999,
      label: {
        text: isPrintMode ? "" : "Revenue threshold for completion of Financing Phase",
        useHTML: true,
        style: {
          ...commonLabelCss,
          width: 200,
          opacity: 0.6,
        } as CSSObject,
        x: 40,
        y: -20,
      },
    });
  }
  return {
    xAxisPlotLines,
    yAxisPlotLines,
  };
}
