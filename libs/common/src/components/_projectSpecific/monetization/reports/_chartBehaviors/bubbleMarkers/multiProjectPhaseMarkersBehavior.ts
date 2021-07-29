import { MonetizationProjectEntity } from "../../../_domain/monetizationProjectEntity";
import { ChartSeriesArray } from "../../../../../qwiltChart/_domain/chartSeriesArray";
import { ChartBehavior } from "../../../../../qwiltChart/_domain/chartBehavior";
import { ElementObject } from "highcharts";
import { ChartBubbles } from "./_utils/chartBubbles";
import { CommonColors } from "../../../../../../styling/commonColors";
import tippy from "tippy.js";
import { ReactElement } from "react";
import ReactDOMServer from "react-dom/server";
import {
  ProjectBubbleTooltip,
  Props as TooltipProps,
} from "./_parts/projectBubbleTooltip/ProjectBubbleTooltip";
import {
  MonetizationProviderUtils,
  ProjectEventData,
} from "../../../_utils/monetizationProviderUtils/monetizationProviderUtils";
import _ from "lodash";

interface BehaviorOptions {
  projects: MonetizationProjectEntity[];
}

export class MultiProjectPhaseMarkersBehavior implements ChartBehavior {
  private elementG: ElementObject | undefined = undefined;
  static readonly RADIUS = 5;
  static readonly STROKE_WIDTH = 1;
  static readonly STROKE_HIGHLIGHT_WIDTH = 2;

  constructor(private options: BehaviorOptions) {}

  drawBubble(bubbles: ChartBubbles, x: number, y: number, tooltipProps: TooltipProps) {
    const bubble = bubbles.drawSingle(
      CommonColors.POOL_BLUE,
      { x, y, r: MultiProjectPhaseMarkersBehavior.RADIUS },
      this.elementG
    );
    bubble.on("mouseover", function (this: SVGElement) {
      elementMouseover(this, ProjectBubbleTooltip(tooltipProps));
    });

    return bubble;
  }

  drawBubbleGroup(bubbles: ChartBubbles, x: number, y: number, markers: ProjectEventData[]) {
    if (markers.length === 1) {
      this.drawBubble(bubbles, x, y, {
        date: markers[0].date,
        title: markers[0].project.name,
        content: markers[0].description,
      });
    } else {
      const group = bubbles.drawGroup(
        CommonColors.POOL_BLUE,
        { x, y, r: MultiProjectPhaseMarkersBehavior.RADIUS },
        markers.length,
        this.elementG
      );
      group.on("mouseover", function (this: SVGElement) {
        elementMouseover(
          this,
          ProjectBubbleTooltip({
            date: markers[0].date,
            content: markers.map(({ project, description }) => {
              return { label: project.name, text: description };
            }),
          })
        );
      });
    }
  }

  drawAdditions(chartSeriesGroup: ChartSeriesArray) {
    const renderer = chartSeriesGroup.highchartChart?.renderer;
    if (chartSeriesGroup.highchartChart && renderer?.plotBox) {
      const bubbles = new ChartBubbles(renderer);
      const plotHeight = renderer.plotBox.height;

      if (this.elementG) {
        this.elementG.destroy();
        this.elementG = undefined;
      }

      this.elementG = renderer.g("phases").add().toFront();
      const markersFlat = MonetizationProviderUtils.collectProjectEvents(this.options.projects);
      const markerGroupByX = _.groupBy(markersFlat, ({ date }) => date.toMillis());

      for (const dateInMillis of Object.keys(markerGroupByX)) {
        const dateXPos = chartSeriesGroup.highchartChart.xAxis[0].toPixels(_.toNumber(dateInMillis));
        this.drawBubbleGroup(bubbles, dateXPos, plotHeight, markerGroupByX[dateInMillis]);
      }
    }
  }
}
function elementMouseover(element: SVGElement, tooltipContent: ReactElement) {
  tippy(element, {
    content: ReactDOMServer.renderToString(tooltipContent),
    interactive: true,
    delay: 200,
    hideOnClick: false,
    arrow: true,
    theme: "chart",
    placement: "top",
    onShow: () => {
      element.style.strokeWidth = MultiProjectPhaseMarkersBehavior.STROKE_HIGHLIGHT_WIDTH + "px";
    },
    onHide: () => {
      element.style.strokeWidth = MultiProjectPhaseMarkersBehavior.STROKE_WIDTH + "px";
    },
  });

  return element;
}
