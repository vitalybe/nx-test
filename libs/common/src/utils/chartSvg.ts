import { ElementObject, RendererObject } from "highcharts";
import { CommonColors } from "common/styling/commonColors";
import { Fonts } from "common/styling/fonts";
import anime, { AnimeParams } from "animejs";
import { darken, rgba, transparentize } from "polished";
import { DateTime } from "luxon";

export interface ChartPeakPoint {
  x: number;
  y: number;
  color: string;
  testCssClass?: string;
}
interface PlotBox {
  x: number;
  y: number;
  width: number;
  height: number;
}
interface RendererExtension extends RendererObject {
  plotBox: { x: number; y: number; width: number; height: number };
  width: number;
  height: number;
}

interface AnimatedCirclesOptions {
  radius: number;
  attrsCallback: (point: ChartPeakPoint, isHalo?: boolean) => object;
  animationDuration: number;
}

export class ChartSvg {
  renderer!: RendererExtension;
  plotBox!: PlotBox;
  readonly plotBase!: PlotBox;

  constructor(renderer: RendererObject, private container: ElementObject) {
    this.renderer = renderer as RendererExtension;
    this.plotBox = (renderer as RendererExtension).plotBox;
    this.plotBase = {
      x: this.plotBox.x,
      y: this.plotBox.y,
      width: this.plotBox.width,
      height: Number(this.plotBox.height),
    };
  }

  paintBottomAxis = () => {
    const y = this.plotBase.y + this.plotBase.height;
    this.renderer
      .rect(0, y, this.renderer.width, this.renderer.height - y, 0)
      .attr({
        fill: CommonColors.NAVY_8,
        zIndex: -1,
      })
      .add(this.container);
  };

  drawTopLabel = (text: string) => {
    this.renderer
      .label(`<span>${text}</span>`, this.plotBase.x + 60, this.plotBase.y)
      .css({
        opacity: 0.2,
        fontSize: "12px",
        fontWeight: "bold",
        fontFamily: Fonts.FONT_FAMILY,
        color: CommonColors.DAINTREE,
        textTransform: "uppercase",
      })
      .add(this.container);
  };
  // contrast peaks are used for dark/light backgrounds that makes it hard to notice the regular peak
  // used in ds-dashboard-cp
  drawContrastPeaks = (points: ChartPeakPoint[], radius: number = 5, borderColor?: string) => {
    const attrsCallback = (point: ChartPeakPoint, isHalo = false) => ({
      fill: isHalo ? "black" : point.color,
      stroke: isHalo ? "transparent" : borderColor || darken(0.1, point.color),
      "stroke-width": isHalo ? 0 : 1,
    });
    this.drawAnimatedCircles(
      points,
      {
        radius,
        attrsCallback,
        animationDuration: 3000,
      },
      {
        fill: [rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2), rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0)],
      }
    );
  };

  drawPeakPoints = (points: ChartPeakPoint[], radius: number = 5, borderColor?: string) => {
    const attrsCallback = (point: ChartPeakPoint, isHalo = false) => ({
      fill: isHalo ? transparentize(0.5, point.color) : point.color,
      stroke: isHalo ? point.color : borderColor || darken(0.1, point.color),
      "stroke-width": 1,
    });
    this.drawAnimatedCircles(
      points,
      {
        radius,
        attrsCallback,
        animationDuration: 2500,
      },
      {
        opacity: [0.9, 0],
      }
    );
  };

  drawAnimatedCircles(
    points: ChartPeakPoint[],
    options: Partial<AnimatedCirclesOptions>,
    animeOptions: Partial<AnimeParams>
  ) {
    const { radius = 5, attrsCallback, animationDuration = 2500 } = options;
    const haloSize = radius * 4;

    const _circle = (point: ChartPeakPoint, isHalo = false) => {
      const attr = {
        class: isHalo ? "chart-peak-halo" : "chart-peak-circle" + ` test-class-${point.testCssClass}`,
        ...(attrsCallback?.(point, isHalo) ?? {}),
      };
      return this.renderer
        .circle(point.x + this.plotBase.x, point.y + this.plotBase.y, radius)
        .attr(attr)
        .add(this.container);
    };

    for (const point of points) {
      _circle(point, true);
      _circle(point, true);
      _circle(point);
    }
    anime({
      targets: ".chart-peak-halo",
      r: [radius, radius + haloSize],
      duration: animationDuration,
      easing: "easeInOutCubic",
      loop: true,
      delay: (target: HTMLElement, index: number) => {
        return index % 2 === 0 ? animationDuration / 2 : 0;
      },
      ...animeOptions,
    });
  }

  drawWeekSeparators = (dayPoints: { date: number; plotX: number }[]) => {
    let shouldColor = false;
    for (let i = 0; i < dayPoints.length; i++) {
      const point = dayPoints[i];
      const nextX = i === dayPoints.length - 1 ? this.renderer.width : dayPoints[i + 1].plotX;
      const day = DateTime.fromSeconds(point.date).day;
      if (day === 0) {
        shouldColor = !shouldColor;
      }
      if (shouldColor) {
        this.renderer
          .rect(point.plotX + this.plotBase.x, 0, nextX - point.plotX, this.plotBase.height + this.plotBase.y, 0)
          .attr({
            fill: CommonColors.GRAY_2,
            opacity: 1,
            zIndex: -1,
          })
          .add(this.container);
      }
      this.renderer
        .path(["M", point.plotX + this.plotBase.x, 0, "V", this.plotBase.y + this.plotBase.height])
        .attr({
          "stroke-width": 1,
          opacity: day === 0 ? 0.1 : 0.3,
          stroke: day === 0 ? CommonColors.NAVY_4 : CommonColors.GRAY_1,
          zIndex: -1,
        })
        .add(this.container);
    }
  };
}
