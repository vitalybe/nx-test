import { css } from "styled-components";
import { CommonColors } from "../../../../styling/commonColors";

export class ParamsGridStyles {
  static readonly CSS = css`
  .ag-theme-material {
    box-shadow: none;
    button:focus {
      box-shadow: none;
    }
    .ag-icon-menu {
      display: none;
    }
    .ag-header-container {
      .ag-icon-none::before {
        opacity: 0;
        transition: opacity 200ms ease-out;
      }
      &:hover {
        .ag-icon-none::before {
          opacity: 0.5;
        }
      }
    }
    .ag-icon-asc::before,
    .ag-icon-none::before {
      font-family: "Font Awesome 5 Free";
      font-weight: 900;
      content: "\f063";
    }
    .ag-icon-desc::before {
      font-family: "Font Awesome 5 Free";
      font-weight: 900;
      content: "\f062";
    }
    .ag-invisible {
      display: none !important;
    }
    .ag-pivot-off {
      height: 64px !important;
      min-height: 64px !important;
    }
    .ag-header-viewport {
      .ag-header-row {
        height: 100% !important;
      }
    }
    .ag-header {
      background-color: white !important;
      span {
        font-size: 0.875rem !important;
        color: ${CommonColors.BLUE_LAGOON};
        font-weight: bold;
        font-family: "Avenir", "Helvetica Neue", "Helvetica", "Arial", sans-serif !important;
      }
    }

    .ag-header-cell-label {
      display: flex;
      justify-content: space-between;
    }

    .ag-header-group-cell-no-group:first-child {
      border-right: none !important;
    }

    .ag-header-group-cell-no-group:nth-of-type(1),
    .ag-header-group-cell-no-group:last-child {
      border-right: 1px solid ${CommonColors.PATTENS_BLUE} !important;
    }

    .ag-pinned-left-header {
      .ag-header-group-cell-no-group:last-child {
        border-right: none !important;
      }
      border-right: none !important;
    }

    .ag-header-cell {
      border-top: none;
      padding: 0 8px;
      &:hover {
        background-color: initial !important;
      }
    }

    .ag-header-cell-resize {
      border-left: none !important;
    }

    .ag-cell {
      color: ${CommonColors.BLUE_LAGOON};
      border: none !important;
      font-size: 12px !important;
      font-family: "Avenir", "Helvetica Neue", "Helvetica", "Arial", sans-serif !important;
      padding: 0;
      padding-left: 8px;
      font-weight: lighter;

    .ag-cell-focus {
    
    }
    .ag-row-group-indent-1 {
      padding-left: 21px !important;
    }
    .ag-row-group-indent-2 {
      padding-left: 42px !important;
    }
    .ag-row-group-indent-3 {
      padding-left: 63px !important;
    }
    .ag-row-group-indent-4 {
      padding-left: 84px !important;
    }

    .ag-row-group-leaf-indent {
      margin-left: 12px !important;
    }

    .ag-react-container {
      height: 100%;
    }
    
    .ag-cell-wrapper {
      .ag-selection-checkbox, .ag-group-expanded, .ag-group-contracted {
        margin-right: 0;
      }
    }
  }
  .ag-pinned-right-header, .ag-pinned-left-header {
      border: none;
      height: 100%;
      display: flex;
      align-items: center;
      .ag-header-cell, .ag-header-row, .ag-header-row-column {
        height: 64px !important;
        min-height: 64px !important;
      }
      .ag-cell-label-container {
        display: flex;
        justify-content: space-between;
        flex-direction: row-reverse;
        align-items: center;
        width: 100%;
        height: 100%;
      }
  }
  .ag-pinned-left-header {
    .ag-header-cell {
      padding: 0 25px;
    }
  }
  
`;
}
