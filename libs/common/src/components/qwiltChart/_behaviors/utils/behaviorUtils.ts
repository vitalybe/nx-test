import { CSSObject, ElementObject, RendererObject } from "highcharts";
import { Fonts } from "../../../../styling/fonts";

export class BehaviorUtils {
  static readonly axisCommonLabelStyleOption: CSSObject = {
    fontSize: "10px",
    fontFamily: Fonts.FONT_FAMILY,
    textOverflow: "ellipsis",
  };

  static getDrawingG(
    renderer: RendererObject,
    currentG: ElementObject | undefined,
    gName: string,
    zIndex = 3
  ): ElementObject {
    if (currentG) {
      currentG.destroy();
    }

    return renderer
      .g(gName)
      .attr({ zIndex: zIndex })
      .add();
  }
}
