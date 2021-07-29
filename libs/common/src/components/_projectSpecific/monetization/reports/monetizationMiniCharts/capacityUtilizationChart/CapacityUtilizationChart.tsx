import * as React from "react";
//endregion [[ Props ]]
import { useMemo } from "react";
import { loggerCreator } from "common/utils/logger";
import { QwiltChart } from "common/components/qwiltChart/QwiltChart";
import { ChartSeriesData } from "common/components/qwiltChart/_domain/chartSeriesData";
import { AddSeriesBehavior } from "common/components/qwiltChart/_behaviors/addSeriesBehavior/addSeriesBehavior";
import { YAxisBehavior } from "common/components/qwiltChart/_behaviors/yAxisBehavior/yAxisBehavior";
import { GlobalFontStore } from "common/components/GlobalFontProvider";
import { DateTime } from "luxon";
import { UnitKindEnum, unitsFormatter } from "common/utils/unitsFormatter";
import { Utils } from "common/utils/utils";
import {
  MiniChartPanelHeader,
  MiniChartView,
} from "common/components/_projectSpecific/monetization/_styled/miniChartPanelHeader";
import {
  TooltipContentView,
  TooltipSubValue,
  TooltipTitle,
  TooltipValue,
} from "common/components/_projectSpecific/monetization/_styled/tooltipParts";
import { XAxisBehavior } from "common/components/qwiltChart/_behaviors/xAxisBehavior/xAxisBehavior";
import { SeriesObject } from "highcharts";
import { ColumnSeriesBehavior } from "common/components/_projectSpecific/monetization/reports/_chartBehaviors/columnSeriesBehavior";
import {
  commonDataLabelsOption,
  commonXAxisOptions,
  getCommonYAxisOptions,
} from "common/components/_projectSpecific/monetization/reports/_chartBehaviors/_constants";

import {
  BasicChartsTooltipBehavior,
  ThisTooltipShared,
} from "common/components/_projectSpecific/monetization/reports/_chartBehaviors/basicChartsTooltipBehavior";

import { NoXAxisBehavior } from "common/components/_projectSpecific/monetization/reports/_chartBehaviors/noXAxisBehavior";

const moduleLogger = loggerCreator(__filename);

export const CAPACITY_UTIL_REST_SERIES_ID = "capacity-utilization-rest";
export const CAPACITY_UTIL_PEAK_SERIES_ID = "capacity-utilization-peak";

//region [[ Props ]]

export interface Props {
  barsWidth?: number;
  isXAxisEnabled?: boolean;
  isDataLabelsEnabled?: boolean;
  seriesData: ChartSeriesData[];
  className?: string;
}

export const CapacityUtilizationChart = ({
  seriesData,
  barsWidth,
  isXAxisEnabled,
  isDataLabelsEnabled,
  ...props
}: Props) => {
  const behaviors = useMemo(() => getBehaviors({ barsWidth, isXAxisEnabled, isDataLabelsEnabled }), [
    barsWidth,
    isXAxisEnabled,
    isDataLabelsEnabled,
  ]);

  return (
    <MiniChartView className={props.className}>
      <MiniChartPanelHeader title={"Capacity Utilization"} subTitle={"Last 12 months"} />
      <QwiltChart behaviors={behaviors} seriesData={seriesData} />
    </MiniChartView>
  );
};
interface BehaviorOptions {
  barsWidth?: number;
  isXAxisEnabled?: boolean;
  isDataLabelsEnabled?: boolean;
}

function getBehaviors({ barsWidth, isXAxisEnabled, isDataLabelsEnabled }: BehaviorOptions) {
  const behaviors = [
    new AddSeriesBehavior(),
    new ColumnSeriesBehavior({
      pointWidth: barsWidth ?? GlobalFontStore.instance.remToPixels(1.2),
      borderWidth: 0,
      dataLabels: {
        ...commonDataLabelsOption,
        enabled: isDataLabelsEnabled,
        formatter(this: { percentage: number; series: SeriesObject; y: number }) {
          if (this.y > 0 && this.series.options.id === CAPACITY_UTIL_REST_SERIES_ID) {
            const formattedUtilizationPercent = unitsFormatter.format(100 - this.percentage, UnitKindEnum.PERCENT);
            return `${formattedUtilizationPercent.getRounded(0)}`;
          } else {
            return "";
          }
        },
      },
    }),
    new YAxisBehavior({ ...getCommonYAxisOptions() }),
    new BasicChartsTooltipBehavior<ThisTooltipShared>(
      ({ tooltip, chartSeriesDataItems }) => (
        <TooltipContent index={tooltip.index} chartSeriesDataItems={chartSeriesDataItems} />
      ),
      {
        shared: true,
        outside: true,
      }
    ),
  ];
  if (isXAxisEnabled) {
    behaviors.push(new XAxisBehavior(commonXAxisOptions));
  } else {
    behaviors.push(new NoXAxisBehavior());
  }

  return behaviors;
}
function TooltipContent({ index, chartSeriesDataItems }: { index: number; chartSeriesDataItems: ChartSeriesData[] }) {
  const peaksSeries = chartSeriesDataItems.find(({ id }) => id === CAPACITY_UTIL_PEAK_SERIES_ID);
  const configuredSeries = chartSeriesDataItems.find(({ id }) => id === CAPACITY_UTIL_REST_SERIES_ID);
  const peakPoint = peaksSeries?.histogram.points[index];
  const restPoint = configuredSeries?.histogram.points[index];
  const date = peakPoint && DateTime.fromMillis(peakPoint.x);
  const formattedValue = peakPoint && unitsFormatter.format(peakPoint.y ?? 0, UnitKindEnum.TRAFFIC);
  const formattedConfiguredReserved =
    restPoint && peakPoint && unitsFormatter.format((restPoint.y ?? 0) + (peakPoint.y ?? 0), UnitKindEnum.TRAFFIC);

  return (
    <TooltipContentView>
      {date && formattedValue && formattedConfiguredReserved ? (
        <>
          <TooltipTitle>{`${date.monthShort} ${date.year}`}</TooltipTitle>
          <TooltipValue>
            {Utils.calcPercent(formattedValue.originalValue, formattedConfiguredReserved.originalValue)}%
          </TooltipValue>
          <TooltipSubValue>
            {formattedValue.unit !== formattedConfiguredReserved.unit
              ? formattedValue.getPrettyWithUnit(true)
              : formattedValue.getPretty()}
            /{formattedConfiguredReserved.getPrettyWithUnit(true)}
          </TooltipSubValue>
        </>
      ) : (
        <span>No Data</span>
      )}
    </TooltipContentView>
  );
}
