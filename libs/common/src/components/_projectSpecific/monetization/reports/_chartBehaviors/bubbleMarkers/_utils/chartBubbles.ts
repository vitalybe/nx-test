import { ElementObject, RendererObject } from "highcharts";

interface BubbleCoordinatesObject {
  x: number;
  y: number;
  r: number;
}
export class ChartBubbles {
  constructor(private renderer: RendererObject) {}
  drawGroup(color: string, coordinates: BubbleCoordinatesObject, count: number, group?: ElementObject) {
    const groupContainer = this.renderer.g("bubble-group").add(group).toFront();
    let offSet = 0;
    for (let i = 0; i < Math.min(count, 3); i++) {
      this.drawSingle(color, { ...coordinates, y: coordinates.y - offSet }, groupContainer);
      offSet += coordinates.r;
    }
    return groupContainer;
  }
  drawSingle(color: string, { x, y, r }: BubbleCoordinatesObject, group?: ElementObject) {
    return this.renderer
      .circle(x, y, r)
      .attr({
        fill: color,
        stroke: "white",
        "stroke-width": 1,
        filter: "drop-shadow(0px 2px 2px rgba(0, 0, 0, .2))",
      })
      .add(group)
      .toFront();
  }
}
