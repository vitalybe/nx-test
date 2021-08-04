import { DrillDownEntity } from "./drillDownEntity";
import { DataPoint, IndividualSeriesOptions } from "highcharts";

export class SeriesDataPoint implements DataPoint {
  constructor(public readonly x: number, public readonly y: number) {}
}

export class DrillDownChartSeries implements IndividualSeriesOptions {
  constructor(
    public readonly data: SeriesDataPoint[],
    private readonly entityModel: DrillDownEntity,
    public readonly isIsolated: boolean
  ) {}

  readonly id: string = this.entityModel.marketplaceEntity.id;
  readonly name: string = this.entityModel.marketplaceEntity.name;
  readonly type: string = "area";
  readonly color: string = this.entityModel.color;
  // NOTE: fields below are used by highcharts
  // noinspection JSUnusedGlobalSymbols
  readonly visible: boolean = this.entityModel.isEnabled;
  // noinspection JSUnusedGlobalSymbols
  readonly fillOpacity: number = this.isIsolated ? 0.1 : 0;
}
