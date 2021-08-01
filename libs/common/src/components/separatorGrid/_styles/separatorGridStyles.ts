import { css } from "styled-components";
import { CommonColors, CommonColors as Colors } from "common/styling/commonColors";
import "@fortawesome/fontawesome-free/css/all.css";

export enum GridClasses {
  SEPARATOR = "ag-cell-separator",
  ENTITY = "ag-cell-entity",
}

export const separatorGridStyles = css`
  .ag-theme-material {
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
    .ag-header-row {
      height: 100% !important;
    }
    .ag-header {
      background-color: white !important;
      border-top: 1px solid ${Colors.PATTENS_BLUE} !important;
      span {
        font-size: 12px !important;
        color: ${Colors.BLUE_LAGOON};
        font-weight: normal;
        font-family: "Avenir", "Helvetica Neue", "Helvetica", "Arial", sans-serif !important;
      }
    }
    .ag-header-cell {
      padding: 0 12px;
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
      border-right: 1px solid ${Colors.PATTENS_BLUE} !important;
    }

    .ag-pinned-left-header {
      .ag-header-group-cell-no-group:last-child {
        border-right: none !important;
      }
      border-right: none !important;
    }

    .ag-header-cell {
      border-top: none;
      border-left: none !important;
      border-right: 1px solid ${Colors.PATTENS_BLUE} !important;
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
      font-weight: bold;
      font-family: "Avenir", "Helvetica Neue", "Helvetica", "Arial", sans-serif !important;
      padding: 0;
      padding-left: 8px;
      
      &.${GridClasses.ENTITY} {
        border-left: none !important;
        border-right: 1px solid ${Colors.PATTENS_BLUE} !important;
        font-weight: normal;
      }

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
`;
