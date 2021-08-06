import { HistogramPointType } from "../utils/histogramUtils";
import { BarStates, LineStates } from "highcharts";
import { DateTime } from "luxon";

export class HistogramPoint implements HistogramPointType {
  pointWidth?: number = undefined;
  color?: string;
  isDisabled?: boolean;
  states?: {
    // Options for the hovered point
    hover?: BarStates | LineStates;
  };
  date?: DateTime;
  value?: number;
  constructor(public index: number, public x: number, public y: number | null) {}
}
