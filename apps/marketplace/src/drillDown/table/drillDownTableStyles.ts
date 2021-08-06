import transparentize from "polished/lib/color/transparentize";
import { Colors } from "../../_styling/colors";
import { css } from "styled-components";

export class DrillDownTableStyles {
  static readonly HIGHLIGHT_COLOR = transparentize(0.85, Colors.BLUE_5);
  static readonly CELL_STYLE = css`
    padding-right: 1em;
    padding-left: 1em;
    white-space: nowrap;
    font-size: 16px;
  `;
}
