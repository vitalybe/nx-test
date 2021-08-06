import { css } from "styled-components";
import { CommonColors } from "../../../styling/commonColors";
import { desaturate, lighten } from "polished";

export class ConfigurationStyles {
  static readonly FONT_SIZE_TITLE = "22px";
  static readonly FONT_SIZE_SUBTITLE = "18px";

  static readonly COLOR_CLICKABLE = CommonColors.MATISSE;
  static readonly COLOR_BUTTON_BACKGROUND = CommonColors.MATISSE;
  static readonly COLOR_BUTTON_TEXT = CommonColors.MYSTIC_2;
  static readonly COLOR_BUTTON_DISABLED = CommonColors.SILVER_SAND;

  static readonly COLOR_BACKGROUND = CommonColors.MYSTIC;

  static readonly COLOR_DODGER_BLUE = "#f7f7f7";
  static readonly COLOR_BLUE_4 = "#cad5d9";

  static readonly COLOR_GREY_1 = "#dedede";
  static readonly COLOR_SILVER_SAND = "#B6B8B9";
  static readonly COLOR_ROLLING_STONE = "#6A7A80";

  static readonly COLOR_READ_ONLY_COLUMN = "#f1fced";
  static readonly COLOR_SUB_GRID_HEADERS = "#B8EED8";

  static readonly SHADOW = "0 1px 4px 0 #b2bcbf";

  static readonly DISABLED_COLOR_STYLE = css`
    color: ${desaturate(1, lighten(0.4, CommonColors.NAVY_8))};
  `;

  static getEditorLabelShadow(color: string) {
    return `-1px -1px 0 ${color}, 1px -1px 0 ${color}, -1px 1px 0 ${color}, 1px 1px 0 ${color}`;
  }

  static STYLE_EDITOR_LABEL_FLOATING = css`
    top: 0;
    text-shadow: ${ConfigurationStyles.getEditorLabelShadow(ConfigurationStyles.COLOR_DODGER_BLUE)};
    font-size: 12px;
    color: ${ConfigurationStyles.COLOR_ROLLING_STONE};
  `;

  static STYLE_EDITOR_LABEL = css`
    font-weight: bold;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    left: 0.7em;
    color: ${ConfigurationStyles.COLOR_SILVER_SAND};
    pointer-events: none;

    transition: 0.3s ease;
    transition-property: left, top, color;
  `;

  static STYLE_EDITOR_CONTROL = css`
    width: 100%;
    border: 1px solid ${ConfigurationStyles.COLOR_BLUE_4};
    padding: 0.9em 1.5em 0.7em 0.5em;
    outline: 0;
    border-radius: 5px;
  `;
}
