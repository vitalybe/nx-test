import { ChartBehavior } from "../../../../qwiltChart/_domain/chartBehavior";
import { ChartSeriesArray } from "../../../../qwiltChart/_domain/chartSeriesArray";
import { ElementObject } from "highcharts";
import { Fonts } from "../../../../../styling/fonts";
import { FinancingPhaseData } from "../../_domain/monetizationProjectEntity";
import { DateTime } from "luxon";
import { CommonColors } from "../../../../../styling/commonColors";

interface BehaviorOptions {
  financingPhaseData: FinancingPhaseData;
  projectStartDate: DateTime;
}

export class ProjectPhasesBehavior implements ChartBehavior {
  private elementG: ElementObject | undefined = undefined;

  constructor(private options: BehaviorOptions) {}

  private centerText(element: ElementObject, plotWidth?: number) {
    const bbox = element.getBBox();
    let x: number;
    if (bbox.x < bbox.width / 2) {
      x = bbox.x + 2;
    } else if (plotWidth && bbox.x + bbox.width / 2 > plotWidth) {
      x = bbox.x - bbox.width - 2;
    } else {
      x = bbox.x - bbox.width / 2;
    }
    return element.attr({ x });
  }

  drawAdditions(chartSeriesGroup: ChartSeriesArray) {
    const finPhaseEndDate = this.options.financingPhaseData.endDate ?? this.options.financingPhaseData.expectedEndDate;
    if (
      chartSeriesGroup.highchartChart &&
      chartSeriesGroup.highchartChart.renderer.plotBox &&
      finPhaseEndDate &&
      finPhaseEndDate.toMillis() > this.options.projectStartDate.toMillis()
    ) {
      if (this.elementG) {
        this.elementG.destroy();
        this.elementG = undefined;
      }

      const renderer = chartSeriesGroup.highchartChart.renderer;

      const plotHeight = chartSeriesGroup.highchartChart.renderer.plotBox.height;
      const plotWidth = chartSeriesGroup.highchartChart.renderer.plotBox.width;
      const financingPhaseEndPlotX = chartSeriesGroup.highchartChart.xAxis[0].toPixels(finPhaseEndDate.toMillis());

      this.elementG = renderer.g("phases").add();

      const financingPhaseRect = renderer
        .rect(0, 0, financingPhaseEndPlotX, plotHeight, 0)
        .attr({ fill: "black", opacity: 0.03 })
        .add(this.elementG);

      const financingPhaseBox = financingPhaseRect.getBBox();

      const labelsCss = {
        cursor: "default",
        fontSize: "0.75rem",
        fontWeight: "600",
        color: CommonColors.SHERPA_BLUE,
        fontFamily: Fonts.FONT_FAMILY,
      };
      this.centerText(
        renderer
          .text("Financing Phase", financingPhaseBox.width / 2, 24)
          .css(labelsCss)
          .add(this.elementG),
        renderer.plotBox?.width
      );

      this.centerText(
        renderer
          .text("Revenue Stream Phase", (plotWidth - financingPhaseBox.width) / 2 + financingPhaseBox.width, 24)
          .css(labelsCss)
          .add(this.elementG)
      );
    }
  }
}
