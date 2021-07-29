import * as React from "react";
import * as ReactDOM from "react-dom";
import { ElementObject } from "highcharts";
import { ChartSeriesArray } from "common/components/qwiltChart/_domain/chartSeriesArray";
import { ChartBehavior } from "common/components/qwiltChart/_domain/chartBehavior";
import { mockUtils } from "common/utils/mockUtils";
import { MeasuredPeakLayer } from "common/components/qwiltChart/_behaviors/measuredPeakBehavior/MeasuredPeakLayer";
import { ApiDetailedSeriesStat } from "common/backend/mediaAnalytics/mediaAnalyticsTypes";

export class MeasuredPeakBehavior implements ChartBehavior {
  constructor(private peakData: ApiDetailedSeriesStat) {}

  private id = "MeasuredPeakBehavior_" + mockUtils.sequentialId();
  private elementG: ElementObject | undefined = undefined;
  private callbackHoverIndexChange?: (newIndex: number) => void;

  private draw(index: number | undefined, chartSeriesArray: ChartSeriesArray) {
    if (!this.elementG && chartSeriesArray.highchartChart) {
      const renderer = chartSeriesArray.highchartChart.renderer;
      this.elementG = renderer.text(`<div id="${this.id}"></div>`, 0, 0, true).attr({ zIndex: 5 }).add();
    }

    if (!this.callbackHoverIndexChange) {
      throw new Error(`not subscribed to callback event - hover index change`);
    }

    ReactDOM.render(
      <MeasuredPeakLayer
        seriesArray={chartSeriesArray}
        measuredPeakInfo={this.peakData}
        currentIndex={index}
        onChangeIndex={(index) => this.callbackHoverIndexChange && this.callbackHoverIndexChange(index)}
      />,
      document.getElementById(this.id)
    );
  }

  drawAdditions(chartSeriesArray: ChartSeriesArray): void {
    if (this.elementG) {
      this.elementG.destroy();
      this.elementG = undefined;
    }

    this.draw(undefined, chartSeriesArray);
  }

  onChartHoverIndexChanged(index: number | undefined, chartSeriesArray: ChartSeriesArray): void {
    this.draw(index, chartSeriesArray);
  }

  subscribeHoverIndexChange(callback: (newIndex: number) => void) {
    this.callbackHoverIndexChange = callback;
  }
}
