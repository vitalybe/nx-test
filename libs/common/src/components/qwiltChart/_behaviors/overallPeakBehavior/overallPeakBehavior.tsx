import * as React from "react";
import * as ReactDOM from "react-dom";
import { ElementObject } from "highcharts";
import { loggerCreator } from "../../../../utils/logger";
import { ChartSeriesArray } from "../../_domain/chartSeriesArray";
import { ChartBehavior } from "../../_domain/chartBehavior";
import { mockUtils } from "../../../../utils/mockUtils";
import { OverallPeakLayer } from "./overallPeak/OverallPeakLayer";

const moduleLogger = loggerCreator("__filename");

export class OverallPeakBehavior implements ChartBehavior {
  constructor(private seriesWithoutPeak: string[] = []) {}

  private id = "OverallPeakBehavior_" + mockUtils.sequentialId();
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
      <OverallPeakLayer
        seriesWithoutPeak={this.seriesWithoutPeak}
        chartSeriesGroup={chartSeriesArray}
        currentIndex={index}
        onChangeIndex={(index) => this.callbackHoverIndexChange && this.callbackHoverIndexChange(index)}
      />,
      document.getElementById(this.id)
    );
  }

  drawAdditions(chartSeriesGroup: ChartSeriesArray): void {
    if (this.elementG) {
      this.elementG.destroy();
      this.elementG = undefined;
    }

    this.draw(undefined, chartSeriesGroup);
  }

  onChartHoverIndexChanged(index: number | undefined, chartSeriesGroup: ChartSeriesArray): void {
    this.draw(index, chartSeriesGroup);
  }

  subscribeHoverIndexChange(callback: (newIndex: number) => void) {
    this.callbackHoverIndexChange = callback;
  }
}
