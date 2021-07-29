import { CommonColors } from "common/styling/commonColors";
import { darken } from "polished";

export interface QcButtonTheme {
  backgroundColor?(isHighlighted: boolean): string;
  hoverColor?(isHighlighted: boolean): string;
  activeColor?(isHighlighted: boolean): string;
  textColor?(isHighlighted: boolean): string;
  borderColor?(isHighlighted: boolean): string;
}
// Tip: pass this as theme prop using ".attrs()" instead of inside render
export class QcButtonThemes {
  static readonly default: Required<QcButtonTheme> = {
    backgroundColor(isHighlighted) {
      return isHighlighted ? CommonColors.ROYAL_BLUE : "transparent";
    },
    hoverColor(isHighlighted) {
      return isHighlighted ? CommonColors.ROYAL_BLUE_2 : CommonColors.PATTENS_BLUE;
    },
    activeColor(isHighlighted) {
      return isHighlighted ? CommonColors.ROYAL_BLUE_3 : CommonColors.PATTENS_BLUE;
    },
    textColor(isHighlighted) {
      return isHighlighted ? "white" : CommonColors.BLUE_WHALE;
    },
    borderColor(isHighlighted) {
      return isHighlighted ? "transparent" : CommonColors.PATTENS_BLUE;
    },
  };

  static readonly dialogConfirm: QcButtonTheme = {
    backgroundColor(isHighlighted) {
      return isHighlighted ? CommonColors.ROYAL_BLUE : CommonColors.SILVER;
    },
    hoverColor(isHighlighted) {
      return isHighlighted ? CommonColors.ROYAL_BLUE_2 : darken(0.15, CommonColors.SILVER);
    },
    activeColor(isHighlighted) {
      return isHighlighted ? CommonColors.ROYAL_BLUE_3 : darken(0.2, CommonColors.SILVER);
    },
    textColor() {
      return "white";
    },
  };

  static readonly dialogDanger: QcButtonTheme = {
    backgroundColor(isHighlighted) {
      return isHighlighted ? CommonColors.ROYAL_RED : CommonColors.SILVER;
    },
    hoverColor(isHighlighted) {
      return isHighlighted ? CommonColors.ROYAL_RED_DARKENED : darken(0.15, CommonColors.SILVER);
    },
    activeColor(isHighlighted) {
      return isHighlighted ? CommonColors.ROYAL_RED_DARKENED_2 : darken(0.2, CommonColors.SILVER);
    },
    textColor() {
      return "white";
    },
  };
}
