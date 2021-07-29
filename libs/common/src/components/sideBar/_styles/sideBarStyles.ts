import { css } from "styled-components";

export class SideBarStyles {
  static readonly SIDEBAR_WIDE_WIDTH = "208px";
  static readonly SIDEBAR_NARROW_WIDTH = "64px";

  static readonly NAV_BUTTON_HEIGHT = "48px";
  static readonly NAV_BUTTON_HOVER_COLOR = "#004865";

  static readonly NAV_BUTTON_DEFAULT_BACKGROUND = "transparent";
  static readonly NAV_BUTTON_DEFAULT_SELECTED_BACKGROUND = "#00597d";

  static readonly CHILD_NAV_BUTTON_BACKGROUND = "#0a3140";
  static readonly CHILD_NAV_BUTTON_SELECTED_BACKGROUND = "#006e98";

  static readonly WHITE_FILTER = css`
    filter: brightness(0) invert(1);
  `;
}
