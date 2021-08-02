import { mockUtils } from "common/utils/mockUtils";
import { UnitKindEnum, unitsFormatter, UnitsFormatterResult } from "common/utils/unitsFormatter";
import { action, computed } from "mobx";
import { DrillDownEntity } from "src/drillDown/_domain/drillDownEntity";
import { MetricTypesEnum } from "src/_domain/metricTypes";
import { MarketplaceEntityHeaderModel } from "src/_parts/marketplaceEntityHeader/marketplaceEntityHeaderModel";
import { HistogramValuesByDate } from "src/drillDown/_domain/drillDownHistogram";
import { DrillDownStore } from "src/drillDown/_stores/drillDownStore";
import { TableMetricType } from "src/drillDown/table/drillDownTableModel";
import { oc } from "ts-optchain";

class TableMetricsModel {
  constructor(
    public bandwidth: UnitsFormatterResult,
    public tps: UnitsFormatterResult,
    public bitrate: UnitsFormatterResult
  ) {}

  static createMock() {
    const mockTransferValue = unitsFormatter.format(5_123_123, UnitKindEnum.TRAFFIC);
    const mockNumberValue = unitsFormatter.format(5_123_123, UnitKindEnum.COUNT);

    return new TableMetricsModel(mockTransferValue, mockNumberValue, mockTransferValue);
  }
}

export class DrillDownTableRowModel {
  constructor(private drillDownEntity: DrillDownEntity, private marketplaceDrillDown: DrillDownStore) {}

  private marketplace = this.marketplaceDrillDown.marketplace;

  getSortByValue = (type: TableMetricType): number => {
    const sortingDict = {
      [MetricTypesEnum.AVAILABLE_BW]: this.averageMetrics.bandwidth.originalValue,
      [MetricTypesEnum.AVAILABLE_TPS]: this.averageMetrics.tps.originalValue,
      [MetricTypesEnum.BITRATE]: this.averageMetrics.bitrate.originalValue,
      ["coverage"]: this.coverage,
      ["ispCount"]: this.ispCount,
    };
    return sortingDict[type];
  };

  @computed
  get id() {
    return this.drillDownEntity.marketplaceEntity.id;
  }

  @computed
  get color() {
    return this.drillDownEntity.color;
  }

  @computed
  get title() {
    return this.drillDownEntity.marketplaceEntity.name;
  }

  private getHistogramData(forType: MetricTypesEnum): HistogramValuesByDate | undefined {
    let result: HistogramValuesByDate | undefined = undefined;

    const drillDownHistogram = this.marketplaceDrillDown.drillDownHistogram;
    if (drillDownHistogram) {
      const histogramsByType = drillDownHistogram.getHistogramsByType(forType);

      result = histogramsByType.getByEntityId(this.id);
    }

    return result;
  }

  @computed
  get isLoading(): boolean {
    return this.getHistogramData(MetricTypesEnum.AVAILABLE_BW) === undefined;
  }

  @computed
  get averageMetrics() {
    const bandwidthAverage = unitsFormatter.format(
      this.getHistogramData(MetricTypesEnum.AVAILABLE_BW)!.average,
      UnitKindEnum.TRAFFIC
    );
    const tpsAverage = unitsFormatter.format(
      this.getHistogramData(MetricTypesEnum.AVAILABLE_TPS)!.average,
      UnitKindEnum.COUNT
    );
    const bitrateAverage = unitsFormatter.format(
      this.getHistogramData(MetricTypesEnum.BITRATE)!.average,
      UnitKindEnum.TRAFFIC
    );

    return new TableMetricsModel(bandwidthAverage, tpsAverage, bitrateAverage);
  }

  @computed
  get peakMetrics() {
    const bandwidthPeak = unitsFormatter.format(
      this.getHistogramData(MetricTypesEnum.AVAILABLE_BW)!.peakValue!.value,
      UnitKindEnum.TRAFFIC
    );
    const tpsPeak = unitsFormatter.format(
      this.getHistogramData(MetricTypesEnum.AVAILABLE_TPS)!.peakValue!.value,
      UnitKindEnum.COUNT
    );
    const bitratePeak = unitsFormatter.format(
      this.getHistogramData(MetricTypesEnum.BITRATE)!.peakValue!.value,
      UnitKindEnum.TRAFFIC
    );

    return new TableMetricsModel(bandwidthPeak, tpsPeak, bitratePeak);
  }

  @computed
  get coverage(): number {
    return oc(this.drillDownEntity).marketplaceEntity.lastHourMetrics.coverage(0);
  }

  @computed
  get ispCount() {
    return this.drillDownEntity.marketplaceEntity.ispCount;
  }

  @computed
  get isEnabled() {
    return this.drillDownEntity.isEnabled;
  }

  @computed
  get marketplaceEntityHeader() {
    return new MarketplaceEntityHeaderModel(this.drillDownEntity.marketplaceEntity);
  }

  @action
  toggleRow = () => {
    this.marketplace.selectedEntitySetEnabled(this.id, !this.isEnabled);
  };

  @action
  removeRow = () => {
    this.marketplace.removeSelectedEntitiesIds(this.id);
  };

  @action
  showCard = () => {
    this.marketplaceDrillDown.marketplace.moreDetailsCardId = this.drillDownEntity.marketplaceEntity.id;
  };

  static createMock(id: string, overrides?: Partial<DrillDownTableRowModel>) {
    return mockUtils.createMockObject<DrillDownTableRowModel>({
      id: id,
      color: "green",
      title: "Test",
      averageMetrics: TableMetricsModel.createMock(),
      peakMetrics: TableMetricsModel.createMock(),
      coverage: 95,
      ispCount: 21,
      isEnabled: true,
      isLoading: false,
      marketplaceEntityHeader: MarketplaceEntityHeaderModel.createMock(),
      toggleRow: mockUtils.mockAction("toggleRow"),
      removeRow: mockUtils.mockAction("removeRow"),
      showCard: mockUtils.mockAction("showCard"),
      getSortByValue: () => 5,
      ...overrides,
    });
  }
}
