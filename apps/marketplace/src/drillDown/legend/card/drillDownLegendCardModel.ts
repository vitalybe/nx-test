import { action, computed } from "mobx";
import { DrillDownEntity } from "src/drillDown/_domain/drillDownEntity";
import { UnitKindEnum, unitsFormatter, UnitsFormatterResult } from "common/utils/unitsFormatter";
import { mockUtils } from "common/utils/mockUtils";
import { Colors } from "src/_styling/colors";
import { Utils } from "common/utils/utils";
import { MetricTypesEnum } from "src/_domain/metricTypes";
import { HistogramValue } from "src/drillDown/_domain/drillDownHistogram";
import { DrillDownChartAreaStore } from "src/drillDown/_stores/drillDownChartAreaStore";
import { MouseEvent } from "react";
import { ParentLocation } from "src/_domain/parentLocation";
import { DateTime } from "luxon";

export class DrillDownLegendCardModel {
  constructor(private entity: DrillDownEntity, private chartArea: DrillDownChartAreaStore) {}

  private marketplaceDrillDown = this.chartArea.marketplaceDrillDown;
  private marketplace = this.marketplaceDrillDown.marketplace;

  private undoState: { id: string; index: number } | undefined = undefined;

  @computed
  get id(): string {
    return this.entity.marketplaceEntity.id;
  }

  @computed
  get color(): string {
    return this.entity.color;
  }

  @computed
  get title(): string {
    return this.entity.marketplaceEntity.name;
  }

  @computed
  get ispIcon(): string | undefined {
    return this.entity.ispIcon;
  }

  @computed
  get parentLocation(): ParentLocation {
    return this.entity.marketplaceEntity.parentLocation;
  }

  @computed
  get currentPoint(): HistogramValue | undefined {
    const chartArea = this.chartArea;
    if (chartArea.currentHistogram && chartArea.currentHistogram.latestValue) {
      const currentDateValue = chartArea.hasDateValue
        ? chartArea.dateValue
        : chartArea.currentHistogram.latestValue.date;
      const point = currentDateValue && chartArea.currentHistogram.getHistogramValue(this.id, currentDateValue);
      if (point) {
        return point;
      }
    }
  }
  @computed
  get isPeak(): boolean {
    if (this.chartArea.currentHistogram && this.currentPoint) {
      const histogramEntity = this.chartArea.currentHistogram.getHistogramEntity(this.id);
      if (histogramEntity && histogramEntity.peakValue) {
        return this.currentPoint.date === histogramEntity.peakValue.date;
      }
    }
    return false;
  }
  @computed
  get currentMetric(): UnitsFormatterResult | undefined {
    const selectedMetricTab = this.marketplaceDrillDown.metricType;
    const point = this.currentPoint;
    if (point) {
      const isTrafficMetric =
        selectedMetricTab === MetricTypesEnum.AVAILABLE_BW || selectedMetricTab === MetricTypesEnum.BITRATE;
      const metricType = isTrafficMetric ? UnitKindEnum.TRAFFIC : UnitKindEnum.COUNT;
      return unitsFormatter.format(point.value, metricType);
    }
  }

  @computed
  get isEnabled() {
    return this.entity.isEnabled;
  }

  @action
  handleClick = () => {
    const id = this.entity.marketplaceEntity.id;
    const enabledEntities = this.marketplaceDrillDown.drillDownEntities.filter((entity) => entity.isEnabled);
    const isAllEnabled = this.marketplaceDrillDown.drillDownEntities.length === enabledEntities.length;
    const isEntityIsolated = enabledEntities.length === 1 && enabledEntities[0].marketplaceEntity.id === id;

    if (isAllEnabled) {
      // isolation mode - disable everyone except clicked
      this.marketplace.selectedEntities.forEach((entity) => {
        const isEnabled = entity.marketplaceEntity.id === id;
        this.marketplace.selectedEntitySetEnabled(entity.marketplaceEntity.id, isEnabled);
      });
    } else if (isEntityIsolated) {
      // exit isolation mode
      this.marketplace.selectedEntities.forEach((entity) => {
        this.marketplace.selectedEntitySetEnabled(entity.marketplaceEntity.id, true);
      });
    } else {
      this.marketplace.selectedEntitySetEnabled(id, !this.entity.isEnabled);
    }
  };

  @action
  removeSelf = (e: MouseEvent<HTMLButtonElement> | undefined) => {
    if (e) {
      e.stopPropagation();
    }

    const removeIndex = this.marketplace.selectedEntities.map((entity) => entity.id).indexOf(this.id);

    this.undoState = { id: this.id, index: removeIndex };

    this.marketplace.removeSelectedEntitiesIds(this.id);

    const drillDownEntities = this.marketplaceDrillDown.drillDownEntities;
    if (drillDownEntities.length && drillDownEntities.filter((entity) => entity.isEnabled).length === 0) {
      // all the remaining entities are disabled, enable everything to prevent everything from being disabled
      drillDownEntities.forEach((entity) => {
        this.marketplace.selectedEntitySetEnabled(entity.marketplaceEntity.id, true);
      });
    }
  };

  @action
  undoRemove = () => {
    if (this.undoState) {
      this.marketplace.addSelectedEntitiesIds(this.undoState.id, this.undoState.index);
    }
  };

  @action
  highlightSeries = (id: string | undefined) => {
    this.chartArea.highlightSeries(id);
  };

  static createMock(overrides?: Partial<DrillDownLegendCardModel>): DrillDownLegendCardModel {
    const colors = Object.values(Colors);
    const entityNames = ["france", "usa", "germany", "italy", "israel", "philippines", "comcast", "cox", "fios"];
    const isps = ["comcast", "cox", "fios"];
    const randomMetricValue = () => Math.round(Math.random() * Math.pow(10, 13));
    const randomIndexOf = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];
    const title = randomIndexOf(entityNames);
    const hasParent = isps.includes(title) && Math.random() > 0.5;
    return mockUtils.createMockObject<DrillDownLegendCardModel>({
      id: Utils.generateHashString(),
      currentMetric: unitsFormatter.format(randomMetricValue(), UnitKindEnum.TRAFFIC),
      color: randomIndexOf(colors),
      title,
      ispIcon: isps.includes(title) ? `isps/${title}.png` : undefined,
      parentLocation: ParentLocation.createMock(hasParent),
      isPeak: false,
      currentPoint: new HistogramValue(DateTime.local().valueOf(), randomMetricValue()),
      isEnabled: true,
      handleClick: mockUtils.mockAction("handleClick"),
      removeSelf: mockUtils.mockAction("removeSelf"),
      undoRemove: () => {},
      highlightSeries: mockUtils.mockAction("highlightSeries"),
      ...overrides,
    });
  }
}
