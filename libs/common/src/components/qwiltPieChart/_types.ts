import { UnitKindEnum } from "../../utils/unitsFormatter";
import { DataPoint, PointObject, SeriesObject } from "highcharts";
import { ReactElement } from "react";

export type ThisTooltip = {
  point: { disabled?: boolean; unit: UnitKindEnum } & PointObject;
  series: SeriesObject;
  y: number;
  percentage: number;
};

export interface QwiltPieChartPart extends DataPoint {
  y: number;
  unit?: UnitKindEnum;
  color: string;
  disabled?: boolean;
  borderColor?: string;
  // child cannot have "children" & only required to have "y" and "name"
  children?: Pick<Partial<Omit<QwiltPieChartPart, "children">>, "y" | "name">[];
}

export interface QwiltPieChartOptions {
  innerSize?: string;
  dataLabelsDistance?: number;
  disableLabels?: boolean;
  tooltip?: {
    renderer?(props: TooltipProps): ReactElement;
    disabled?: boolean;
  };
}

export interface TooltipProps {
  name: string;
  value: number;
  percentage: number;
  unit?: UnitKindEnum;
  className?: string;
}
