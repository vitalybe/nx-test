import { mockUtils } from "common/utils/mockUtils";
import { action, autorun, computed } from "mobx";
import { ChartObject, ElementObject, Options, PlotLines, PointObject, RendererObject } from "highcharts";
import { DrillDownChartSeries, SeriesDataPoint } from "src/drillDown/_domain/drillDownChartSeries";
import { UnitKindEnum, unitsFormatter } from "common/utils/unitsFormatter";
import { MetricTypesEnum } from "src/_domain/metricTypes";
import { NativeAnimations } from "common/styling/animations/nativeAnimations";
import { Colors } from "src/_styling/colors";
import { Fonts } from "common/styling/fonts";
import { ChartPeakPoint, ChartSvg } from "common/utils/chartSvg";
import { DrillDownChartAreaStore } from "src/drillDown/_stores/drillDownChartAreaStore";
import { DrillDownStore } from "src/drillDown/_stores/drillDownStore";
import { DateTime } from "luxon";
import { HistogramSeries } from "common/utils/histograms/domain/histogramSeries";
import { XAxisBehavior } from "common/components/qwiltChart/_behaviors/xAxisBehavior/xAxisBehavior";
import { ChartSeriesData } from "common/components/qwiltChart/_domain/chartSeriesData";
import { HighchartsUtils } from "common/utils/histograms/highchartsUtils";

const yAxisDefaultOptions = {
  maxPadding: 0.3,
  gridLineWidth: 0,
  title: undefined,
  showFirstLabel: false,
  labels: {
    x: 0,
    style: {
      opacity: 0.4,
      color: Colors.NAVY_1,
      fontSize: "10px",
      fontFamily: Fonts.FONT_FAMILY,
      fontWeight: "900",
    },
  },
};

export class DrillDownChartModel {
  constructor(private chartArea: DrillDownChartAreaStore) {}

  public marketplaceDrillDown = this.chartArea.marketplaceDrillDown;
  private marketplace = this.marketplaceDrillDown.marketplace;
  private readonly behaviors = this.getBehaviors();
  private elementG: ElementObject | undefined = undefined;

  chartInstance: ChartObject | undefined;

  private getBehaviors() {
    return [
      new XAxisBehavior({
        timezone: DateTime.local().zone,
        regularStyle: `color: ${Colors.WHITE}`,
        highlightedStyle: `color: ${Colors.WHITE}; text-transform: uppercase; font-weight: bold;`,
      }),
    ];
  }

  @computed
  get options(): Options {
    const model = this;
    const chartOptions: Options = {
      chart: {
        spacingLeft: 2,
        spacingRight: 6,
        marginLeft: 20,
        spacingTop: 15,
        marginRight: 20,
        type: "area",
        animation: false,
      },
      series: this.seriesData,
      plotOptions: {
        series: {
          cursor: "pointer",
          lineWidth: 1,
          animation: false,
          states: {
            hover: {
              animation: {
                duration: 0,
              },
              lineWidth: 1,
              halo: {
                size: 5,
              },
            },
          },
          marker: {
            enabled: false,
            symbol: "circle",
            radius: 3,
          },
          point: {
            events: {
              mouseOver(this: { x: number }) {
                const date = this.x;
                const index = model.getPointIndexForDate(date);
                model.chartArea.dateValue = date;
                model.hoverPointsAtIndex(index);
              },
            },
          },
        },
      },
      yAxis: [
        {
          ...yAxisDefaultOptions,
          plotLines: this.getYAxisPlotLines(),
          labels: {
            ...yAxisDefaultOptions.labels,
            align: "left",
            x: -15,
            formatter(): string {
              const type =
                model.marketplaceDrillDown.metricType === MetricTypesEnum.AVAILABLE_TPS
                  ? UnitKindEnum.COUNT
                  : UnitKindEnum.TRAFFIC;
              const chartUnit = HighchartsUtils.getChartUnit(this.chart, type);
              const formatted = unitsFormatter.format(this.value, type);
              const value = unitsFormatter.convert(this.value, chartUnit);
              return `${value.unitValue} ${this.isLast ? formatted.unit.toUpperCase() : ""}`;
            },
          },
        },
        {
          ...yAxisDefaultOptions,
          opposite: true,
          linkedTo: 0,

          labels: {
            ...yAxisDefaultOptions.labels,
            x: 15,
            align: "right",
            formatter(): string {
              const type =
                model.marketplaceDrillDown.metricType === MetricTypesEnum.AVAILABLE_TPS
                  ? UnitKindEnum.COUNT
                  : UnitKindEnum.TRAFFIC;
              const chartUnit = HighchartsUtils.getChartUnit(this.chart, type);
              const formatted = unitsFormatter.format(this.value, type);
              const value = unitsFormatter.convert(this.value, chartUnit);
              return `${value.unitValue} ${this.isLast ? formatted.unit.toUpperCase() : ""}`;
            },
          },
        },
      ],
      title: {
        text: "",
      },
      tooltip: {
        enabled: false,
      },
      legend: {
        enabled: false,
      },
      credits: {
        enabled: false,
      },
    };

    for (const behavior of this.behaviors) {
      if (behavior.modifyConfig) {
        behavior.modifyConfig(
          chartOptions,
          this.seriesData.map(
            (serie) =>
              new ChartSeriesData({
                name: serie.name,
                histogram: HistogramSeries.fromRawValues(serie.data),
                color: "unused",
              })
          )
        );
      }
    }

    return chartOptions;
  }

  @computed
  get isLoading() {
    return this.chartArea.currentHistogram === undefined;
  }

  @computed
  get seriesData(): DrillDownChartSeries[] {
    const seriesData = [];
    if (this.chartArea.currentHistogram) {
      const entities = this.marketplaceDrillDown.drillDownEntities;
      for (const entityData of this.chartArea.currentHistogram.getAllEntityData()) {
        const entityModel = entities.find((entity) => {
          return entity.marketplaceEntity.id === entityData.entityId;
        });
        if (entityModel) {
          seriesData.push(
            new DrillDownChartSeries(
              entityData.getAll().map((point) => new SeriesDataPoint(point.date, point.value)),
              entityModel,
              entities.filter((entity) => entity.isEnabled).length <= 2
            )
          );
        }
      }
    }
    return seriesData;
  }

  chartIsReady = (chart: ChartObject) => {
    this.chartInstance = chart;
    chart.container.addEventListener("mouseleave", this.chartMouseOut);
    this.hoverLastPoints(false);
  };

  hoverLastPoints = (animate: boolean = true, prevDateValue: number = 0) => {
    const initialIndex = this.getPointIndexForDate(prevDateValue);
    const lastIndex = this.getPointIndexForDate(0);
    if (animate) {
      NativeAnimations.runValues(initialIndex, lastIndex - initialIndex, 500, (index: number) => {
        this.hoverPointsAtIndex(Math.round(index));
      });
    } else {
      this.hoverPointsAtIndex(lastIndex);
    }
  };

  private highlightedSeriesId: string | undefined;

  private onHighlightedSeriesChanged = () => {
    const isHighlighted = this.chartArea.highlightedSeriesId !== undefined;
    const targetSeriesId = this.chartArea.highlightedSeriesId || this.highlightedSeriesId;
    this.highlightedSeriesId = this.chartArea.highlightedSeriesId;

    if (this.chartInstance && this.chartInstance.series) {
      const series = this.chartInstance.series.find((series) => targetSeriesId === series.options.id);
      if (series) {
        series.update({
          fillOpacity: isHighlighted ? 0.2 : 0.1,
          lineWidth: isHighlighted ? 2.5 : 1,
          zIndex: isHighlighted ? 100 : 1,
        });
      }
      this.hoverLastPoints(false);
    }
  };

  private highlightedSeriesChangedDisposer: undefined | (() => void);

  init = () => {
    this.highlightedSeriesChangedDisposer = autorun(this.onHighlightedSeriesChanged);
  };

  cleanUp = () => {
    this.highlightedSeriesChangedDisposer!();
  };

  @action
  private chartMouseOut = () => {
    this.hoverLastPoints(true, this.chartArea.dateValue);
    this.chartArea.dateValue = 0;
  };

  drawAdditions = (chart: Highcharts.ChartObject, renderer: RendererObject) => {
    if (this.elementG) {
      this.elementG.destroy();
      this.elementG = undefined;
    }
    this.elementG = renderer.g("peak-points").attr({ zIndex: 5 }).add();

    const workshop = new ChartSvg(renderer, this.elementG);
    if (workshop && this.chartInstance) {
      try {
        workshop.drawWeekSeparators(this.getDayPoints());
        workshop.paintBottomAxis();
        // eslint-disable-next-line no-empty
      } catch {}
    }
  };

  private getEnabledSeries = (): DrillDownChartSeries[] => {
    return this.marketplace.selectedEntities
      .filter((entity) => entity.isEnabled)
      .map((entity) => this.seriesData.find((series) => series.id === entity.id))
      .filter((seriesObject) => seriesObject !== undefined) as DrillDownChartSeries[];
  };

  private getYAxisPlotLines = (): PlotLines[] => {
    const enabledSeries = this.getEnabledSeries();
    const histogram = this.chartArea.currentHistogram;
    const lines: PlotLines[] = [];
    if (this.getEnabledSeries().length <= 2 && histogram) {
      let max = 0;
      for (const series of enabledSeries) {
        const entityHistogram = histogram.getHistogramEntity(series.id);
        if (entityHistogram && entityHistogram.average) {
          if (entityHistogram.average > max) {
            max = entityHistogram.average;
          }
          lines.push({
            color: series.color,
            zIndex: 5,
            dashStyle: "dot",
            width: 2.5,
            value: entityHistogram.average,
            label: {
              align: "right",
              text: "",
              x: 0,
              style: {
                opacity: 0.4,
                fontSize: "10px",
                fontWeight: "bold",
                fontFamily: Fonts.FONT_FAMILY,
                color: Colors.NAVY_1,
              },
            },
          });
        }
      }
      for (const line of lines) {
        if (line.value === max) {
          line.label!.text = "AVERAGE";
        }
      }
    }
    return lines;
  };

  private getDayPoints = () => {
    const points: { date: number; plotX: number }[] = [];
    if (this.chartInstance && this.chartInstance.xAxis) {
      const xAxis = this.chartInstance.xAxis[0];
      if (xAxis.tickPositions) {
        for (const date of xAxis.tickPositions) {
          const point = this.getPointForDate(date);
          if (point) {
            points.push({
              date,
              plotX: point.plotX,
            });
          }
        }
      }
    }
    return points;
  };

  private hoverPointsAtIndex = (index: number) => {
    if (this.chartInstance && this.chartInstance.series) {
      const enabledSeries = this.getEnabledSeries();
      enabledSeries.forEach((series) => {
        const chartSeries =
          this.chartInstance && this.chartInstance.series.find((chartSeries) => chartSeries.options.id === series.id);
        const point = chartSeries && chartSeries.data[index];
        if (series.visible && point && point.setState) {
          point.setState();
          point.setState("hover");
        }
      });
    }
  };

  private getPointForDate = (date: number, seriesId?: string): PointObject | undefined => {
    const chart = this.chartInstance;
    const index = this.getPointIndexForDate(date);
    if (chart && chart.series && chart.series.length > 0) {
      const series = !seriesId ? chart.series[0] : chart.series.find((series) => series.options.id === seriesId);
      if (series && index) {
        return series.data[index];
      }
    }
  };

  private getPointIndexForDate = (date: number): number => {
    if (this.chartInstance && this.chartInstance.series.length > 0) {
      const enabledSeries = this.getEnabledSeries();
      if (enabledSeries.length) {
        const seriesData = enabledSeries[0].data;
        for (let i = 0; i < seriesData.length; i++) {
          if (seriesData[i].x === date) {
            return i;
          }
        }
        return seriesData.length - 1;
      }
    }
    return 0;
  };

  static createMock(overrides?: Partial<DrillDownChartModel>) {
    return mockUtils.createMockObject<DrillDownChartModel>({
      options: {},
      seriesData: [],
      chartIsReady: () => null,
      drawAdditions: () => null,
      chartInstance: undefined,
      hoverLastPoints: () => null,
      isLoading: false,
      init: mockUtils.mockAction("init"),
      cleanUp: mockUtils.mockAction("cleanUp"),
      marketplaceDrillDown: DrillDownStore.createMock(),
      ...overrides,
    });
  }
}
