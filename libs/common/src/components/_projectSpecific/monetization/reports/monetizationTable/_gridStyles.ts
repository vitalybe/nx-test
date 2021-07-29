import { css } from "styled-components";
import "@fortawesome/fontawesome-free/css/all.css";
import { Fonts } from "common/styling/fonts";
import { CommonColors } from "common/styling/commonColors";

export enum MonetizationGridClasses {
  CELL_CENTERED = "cell-centered",
  MONETIZATION_GRID_ROW = "monetization-grid-row",
}

export const monetizationGridStyles = css`
  .ag-theme-material {
    font-family: ${Fonts.FONT_FAMILY};
    border: none ${CommonColors.ICE_BLUE};
    .ag-cell:not(:last-of-type) {
      border-right-color: ${CommonColors.ICE_BLUE};
      border-right-width: 1px;
    }
    .ag-row {
      border-bottom: 1px solid ${CommonColors.ICE_BLUE};
      border-top: none !important;
    }
    .ag-header-icon {
      margin: 0 1rem;
    }
    .ag-icon-menu {
      display: none;
    }
    .ag-header-container {
      .ag-icon-none::before {
        opacity: 0.2;
        transition: opacity 200ms ease-out;
      }
      &:hover {
        .ag-icon-none::before {
          opacity: 0.5;
        }
      }
    }
    .ag-icon-desc::before,
    .ag-icon-none::before {
      font-family: "Font Awesome 5 Free", sans-serif;
      font-weight: 900;
      content: "\f063";
    }
    .ag-icon-asc::before {
      font-family: "Font Awesome 5 Free", sans-serif;
      font-weight: 900;
      content: "\f062";
    }
    .ag-invisible {
      display: none !important;
    }

    .ag-header {
      background-color: white !important;
      border-bottom: 1px solid ${CommonColors.ICE_BLUE};
      span {
        font-size: 0.75rem;
        color: ${CommonColors.BLUE_LAGOON};
        font-weight: 600;
      }
    }
    .ag-header-cell {
      padding: 0 1.5rem;
    }
    .ag-cell {
      font-weight: 600;
      padding: 0 1rem;
      font-size: 0.875rem;
      &.print-cell {
        font-size: 0.65rem !important;
      }
    }
    .ag-react-container {
      height: 100%;
      width: 100%;
    }
    .react-cell-wrapper {
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
  }
`;
