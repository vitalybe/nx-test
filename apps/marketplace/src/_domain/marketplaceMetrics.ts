import { UnitKindEnum, unitsFormatter, UnitsFormatterResult } from "common/utils/unitsFormatter";
import { mockUtils } from "common/utils/mockUtils";

export class MarketplaceMetrics {
  constructor(public bandwidth: number, public tps: number, public avgBitrate: number, public coverage: number) {}

  get bandwidthFormatted(): UnitsFormatterResult {
    return unitsFormatter.format(this.bandwidth, UnitKindEnum.TRAFFIC);
  }

  get tpsFormatted(): UnitsFormatterResult {
    return unitsFormatter.format(this.tps, UnitKindEnum.COUNT);
  }

  get avgBitrateFormatted(): UnitsFormatterResult {
    return unitsFormatter.format(this.avgBitrate, UnitKindEnum.TRAFFIC);
  }

  get coverageFormatted(): string {
    return this.coverage.toString() + "%";
  }

  static createMock<T extends MarketplaceMetrics>(id = ""): T {
    const bandwidth = mockUtils.randomMetricValue(id + "BW");
    const tps = mockUtils.randomMetricValue(id + "TPS");
    const avgBitrate = mockUtils.randomMetricValue(id + "bitrate");
    const coverage = mockUtils.randomConsistent(id + "coverage", 100);

    return new MarketplaceMetrics(bandwidth, tps, avgBitrate, coverage) as T;
  }
}
