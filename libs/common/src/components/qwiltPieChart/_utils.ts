import { Options } from "highcharts";
import { renderToString } from "react-dom/server";
import { PieChartTooltip } from "common/components/qwiltPieChart/_parts/PieChartTooltip";
import { QwiltPieChartOptions, ThisTooltip } from "common/components/qwiltPieChart/_types";
import _ from "lodash";

export function formatPercentage(percentage: number) {
  return percentage >= 1 ? _.round(percentage, 2) : "<1";
}

export function getChartOptions({ innerSize, tooltip, ...options }: QwiltPieChartOptions): Options {
  return {
    chart: {
      type: "pie",
    },
    series: [
      {
        data: [],
      },
    ],
    tooltip: {
      backgroundColor: "white",
      outside: true,
      enabled: true,
      useHTML: true,
      padding: 0,
      borderWidth: 0,
      followPointer: true,
      formatter(this: ThisTooltip): boolean | string {
        if (tooltip?.disabled || this.point.disabled) {
          return false;
        }
        const rendererTooltip = tooltip?.renderer ?? PieChartTooltip;
        return renderToString(
          rendererTooltip({
            name: this.point.name,
            value: this.y,
            percentage: this.percentage,
            unit: this.point.unit,
          })
        );
      },
    },
    legend: { enabled: false },
    credits: { enabled: false },
    title: undefined,
    plotOptions: {
      series: {
        states: {
          inactive: {
            opacity: 1,
          },
        },
      },
      pie: {
        size: "100%",
        innerSize: innerSize ?? "45%",
        showInLegend: true,
        dataLabels: {
          distance: options.dataLabelsDistance ?? -25,
          crop: false,
          style: {
            fontFamily: "Avenir",
            fontSize: "0.75rem",
            color: "white",
            fontWeight: "300",
            textOutline: "none",
          },
          formatter(this: { percentage: number; point: { disabled: boolean } }): string {
            if (!options.disableLabels && this.percentage && this.percentage >= 5 && !this.point.disabled) {
              return Math.floor(this.percentage) + "%";
            }
            return "";
          },
        },
        shadow: false,
        center: ["50%", "50%"],
        states: {
          hover: {
            enabled: false,
          },
        },
      },
    },
  };
}
