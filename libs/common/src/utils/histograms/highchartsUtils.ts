import { ChartObject, SeriesObject } from "highcharts";
import { UnitKindEnum, UnitNameEnum, unitsFormatter } from "common/utils/unitsFormatter";

export class HighchartsUtils {
  static getChartUnit(chart: ChartObject, type: UnitKindEnum): UnitNameEnum {
    let maxY = 0;
    chart.series.forEach(function(series: SeriesObject) {
      const max = Math.max(...series.yData);
      if (max > maxY) {
        maxY = max;
      }
    });

    return unitsFormatter.format(maxY, type).unit;
  }
}
