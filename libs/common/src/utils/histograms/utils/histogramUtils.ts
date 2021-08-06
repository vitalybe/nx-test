import { loggerCreator } from "../../logger";

const moduleLogger = loggerCreator("__filename");

export interface HistogramPointType {
  index: number;
  x: number;
  y: number | null;
  pointWidth?: number;
}

export interface HistogramPointsSeries {
  points: HistogramPointType[];
}

export class HistogramUtils {
  static assertSeriesSameX(series: HistogramPointsSeries[]) {
    if (series.length > 1) {
      const pointsCount = series[0].points.length;
      if (!series.every(serie => serie.points.length === pointsCount)) {
        throw new Error(`all series must have same amount of points`);
      }

      for (let i = 0; i < pointsCount; i++) {
        const compareX = series[0].points[i].x;
        for (const serie of series) {
          if (serie.points[i].x !== compareX) {
            throw new Error(`all X values of all the series must be the same`);
          }
        }
      }
    }
  }

  // groups points that are next to each other
  static groupAdjacentPoints(points: HistogramPointType[]): HistogramPointType[][] {
    const groups: HistogramPointType[][] = [];

    if (points.length > 0) {
      let currentGroup: HistogramPointType[] = [];
      groups.push(currentGroup);

      for (let i = 0; i < points.length; i++) {
        if (currentGroup.length === 0 || currentGroup[currentGroup.length - 1].index === points[i].index - 1) {
          currentGroup.push(points[i]);
        } else {
          currentGroup = [];
          groups.push(currentGroup);
          currentGroup.push(points[i]);
        }
      }
    }

    return groups;
  }

  private constructor() {}
}
