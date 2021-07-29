import { loggerCreator } from "common/utils/logger";
import { HistogramPointType } from "common/utils/histograms/utils/histogramUtils";

const moduleLogger = loggerCreator(__filename);

export interface ChartPoint extends HistogramPointType {
  index: number;
  x: number;
  y: number | null;
  plotX: number;
  plotY: number;
}
