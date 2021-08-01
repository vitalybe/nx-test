import * as _ from "lodash";
import { MediaAnalyticsSeries } from "common/backend/mediaAnalytics/mediaAnalyticsSeries";
import { HistogramPoint } from "common/utils/histograms/domain/histogramPoint";
import { TimeConfig } from "common/utils/timeConfig";
import { mockUtils } from "common/utils/mockUtils";
import { HistogramUtils, HistogramPointsSeries } from "common/utils/histograms/utils/histogramUtils";

const murmur = require("murmurhash-js");

export class HistogramSeries implements HistogramPointsSeries {
  constructor(public _name: string, private histogramPoints: HistogramPoint[]) {}

  get name(): string {
    return this._name;
  }

  get points(): HistogramPoint[] {
    return this.histogramPoints;
  }

  calculateSum() {
    return _.sumBy(this.histogramPoints, point => point.y ?? 0);
  }

  get average(): number {
    return _.meanBy(this.histogramPoints, point => point.y);
  }

  get peakPoint(): HistogramPoint {
    return _.maxBy(this.points, point => point.y) || { index: 0, y: 0, x: 0 };
  }

  get peakValue(): number {
    return this.peakPoint.y ?? 0;
  }

  get lastPoint(): HistogramPoint {
    return this.points.length > 0 ? this.points[this.points.length - 1] : { index: 0, y: 0, x: 0 };
  }

  get pointInterval() {
    if (this.histogramPoints.length > 1) {
      return this.histogramPoints[1].x - this.histogramPoints[0].x;
    } else {
      return 0;
    }
  }

  get timestamps() {
    return this.points.map(p => p.x);
  }

  static fromRawValues(values: { x: number; y: number }[], name: string = mockUtils.sequentialId().toString()) {
    const points = values.map((value, i) => new HistogramPoint(i, value.x, value.y));
    return new HistogramSeries(name, points);
  }

  static fromMultipleSeriesSum(series: HistogramSeries[], _name = "Sum Series " + mockUtils.sequentialId().toString()) {
    return this.fromMultipleSeries(series, points => _.sumBy(points, point => point.y ?? 0), _name);
  }

  static fromMultipleSeries(
    series: HistogramSeries[],
    combineFunc: (points: HistogramPoint[]) => number,
    _name = "Combined Series " + mockUtils.sequentialId().toString()
  ) {
    HistogramUtils.assertSeriesSameX(series);

    const combinedPoints: HistogramPoint[] = [];
    for (let i = 0; i < series[0].points.length; i++) {
      const points = series.map(serie => serie.points[i]);
      const combinedValue = combineFunc(points);

      combinedPoints.push(new HistogramPoint(i, points[0].x, combinedValue));
    }

    return new HistogramSeries(_name, combinedPoints);
  }

  static createMock(
    name: string = mockUtils.sequentialId().toString(),
    timeConfig: TimeConfig = TimeConfig.getMockDayConfiguration()
  ) {
    const valueSize = Math.pow(10, 5);
    const wavesAmount = 4;

    const fromDate = timeConfig.fromDate;
    const toDate = timeConfig.toDate;

    const values: HistogramPoint[] = [];
    const randomSeed = name;
    const moveHash = murmur(randomSeed + "move") % 1000;
    const heightHash = (murmur(randomSeed + "height") % 3) + 1;

    let i = 0;
    const fromDateMillis = fromDate.toMillis();
    const toDateMillis = toDate.toMillis();
    const binIntervalMillis = timeConfig.binInterval.as("milliseconds");
    for (let timestamp = fromDateMillis; timestamp <= toDateMillis; timestamp += binIntervalMillis) {
      const delta = toDateMillis - fromDateMillis;
      const position = timestamp - fromDateMillis;
      // goes from 0 to -1 gradually with the timestamp
      const gradientValue = Math.cos(Math.PI * ((position * wavesAmount) / delta) + moveHash);
      const value = gradientValue * valueSize * heightHash + valueSize * 2;
      values.push(new HistogramPoint(i, timestamp, Math.abs(value)));
      i++;
    }

    return new HistogramSeries(name, values);
  }

  static createArrayMock(analyticsSeries: MediaAnalyticsSeries[], timeConfig: TimeConfig) {
    return analyticsSeries.map(series => {
      return HistogramSeries.createMock(series.name, timeConfig);
    });
  }
}
