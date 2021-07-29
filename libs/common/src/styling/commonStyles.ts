import { css } from "styled-components";
import { darken, lighten, mix } from "polished";
import { ConfigurationStyles } from "common/components/configuration/_styles/configurationStyles";

export interface ClickableStyleOptions {
  hoverColor?: string;
  activeColor?: string;

  isDisabled?: boolean;
  disabledColor?: string;

  colorFunction?: "lighten" | "darken";
}

export class CommonStyles {
  static clickableStyle(
    changingAttribute: "color" | "background-color",
    color: string,
    options?: ClickableStyleOptions
  ) {
    const disabledColor = options?.disabledColor ?? ConfigurationStyles.COLOR_BUTTON_DISABLED;

    const colorFunction = options?.colorFunction === "darken" ? darken : lighten;
    const hoverColor = options?.hoverColor || colorFunction(0.1, color);
    const activeColor = options?.activeColor || colorFunction(0.2, color);

    let additionalCss;
    if (options?.isDisabled) {
      additionalCss = css`
        ${changingAttribute}: ${disabledColor};
      `;
    } else {
      additionalCss = css`
        cursor: pointer;
        &:hover {
          ${changingAttribute}: ${hoverColor};
        }

        &:active {
          ${changingAttribute}: ${activeColor};
        }
      `;
    }

    // NOTE: we do "transition-property" for both in case the user combines 2 clickableStyles
    return css`
      transition: 0.2s ease;
      transition-property: color, background-color;
      ${changingAttribute}: ${color};
      ${additionalCss};
    `;
  }

  static clickableSelectableStyle(
    changingAttribute: "color" | "background-color",
    selectedColor: string,
    notSelectedColor: string,
    isSelected: boolean,
    options?: ClickableStyleOptions
  ) {
    const hoverColor = isSelected ? selectedColor : options?.hoverColor ?? mix(0.5, notSelectedColor, selectedColor);
    const activeColor = isSelected ? selectedColor : options?.activeColor ?? mix(0.2, notSelectedColor, selectedColor);

    return css`
      ${this.clickableStyle(changingAttribute, isSelected ? selectedColor : notSelectedColor, {
        // don't show hover effect for selected items because they can't be clicked
        hoverColor: hoverColor,
        activeColor: activeColor,
      })};

      ${isSelected &&
        css`
          cursor: auto;
        `}
    `;
  }

  private constructor() {}
}
