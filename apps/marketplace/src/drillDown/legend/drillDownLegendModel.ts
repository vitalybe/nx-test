import { DrillDownLegendCardModel } from "./card/drillDownLegendCardModel";
import { action, computed } from "mobx";
import { mockUtils } from "@qwilt/common/utils/mockUtils";
import { MetricTypesEnum } from "../../_domain/metricTypes";
import { DrillDownChartAreaStore } from "../_stores/drillDownChartAreaStore";
import { DateTime } from "luxon";

export class DrillDownLegendModel {
  constructor(private drillDownChartArea: DrillDownChartAreaStore) {}

  @computed
  get metricType(): MetricTypesEnum {
    return this.drillDownChartArea.marketplaceDrillDown.metricType;
  }

  @computed
  get cards(): DrillDownLegendCardModel[] {
    return this.drillDownChartArea.marketplaceDrillDown.drillDownEntities.map(entity => {
      return new DrillDownLegendCardModel(entity, this.drillDownChartArea);
    });
  }
  @computed
  get isLastPoint(): boolean {
    if (this.drillDownChartArea.currentHistogram && this.drillDownChartArea.currentHistogram.latestValue) {
      return (
        this.drillDownChartArea.dateValue === this.drillDownChartArea.currentHistogram.latestValue.date ||
        !this.drillDownChartArea.hasDateValue
      );
    }
    return false;
  }
  @computed
  get date(): string | undefined {
    let dateValue = this.drillDownChartArea.dateValue;
    if (
      !this.drillDownChartArea.hasDateValue &&
      this.drillDownChartArea.currentHistogram &&
      this.drillDownChartArea.currentHistogram.latestValue
    ) {
      dateValue = this.drillDownChartArea.currentHistogram.latestValue.date!;
    }

    const timeConfig = this.drillDownChartArea.marketplaceDrillDown.timeConfig;
    const fromDate = DateTime.fromMillis(dateValue);
    const toDate = fromDate.plus(this.drillDownChartArea.currentHistogram?.pointInterval || timeConfig.binInterval);

    return fromDate.toFormat("EEE d/M/yyyy T") + " - " + toDate.toFormat("T");
  }

  @action
  setMetricType = (type: MetricTypesEnum) => {
    this.drillDownChartArea.marketplaceDrillDown.metricType = type;
  };

  static createMock(cardsCount: number): DrillDownLegendModel {
    return mockUtils.createMockObject<DrillDownLegendModel>({
      cards: Array.from(Array(cardsCount).keys()).map(() => DrillDownLegendCardModel.createMock()),
      metricType: MetricTypesEnum.AVAILABLE_BW,
      date: `TUE 2/8/2019 13:57 - 14:57`,
      isLastPoint: true,
      setMetricType: mockUtils.mockAction("setMetricType"),
    });
  }
}
