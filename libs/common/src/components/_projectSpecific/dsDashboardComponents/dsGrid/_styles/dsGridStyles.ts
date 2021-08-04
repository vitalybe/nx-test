import { css } from "styled-components";
import { transparentize } from "polished";
import { CommonColors as Colors } from "common/styling/commonColors";
import { Cell } from "common/components/_projectSpecific/dsDashboardComponents/dsGrid/_styles/cell";

export enum GridClasses {
  GROUP_CHILD_CELL = "group-child-cell",
  GROUP_CHILD_HEADER = "group-child-header",
  GROUP_LAST_CHILD_HEADER = "group-last-child-header",
  NO_RIGHT_BORDER = "no-right-border",
  DRILLDOWN_ACTION_CELL = "drilldown-action-cell",
  SUB_GROUP_HEADER = "sub-group-header",
  CELL_CENTERED = "cell-centered",
}

export const dsGridStyles = css`
  .ag-theme-material {
    .ag-group-expanded,
    .ag-group-contracted {
      margin-right: 0 !important;
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
    .ag-icon-desc::before,
    .ag-icon-none::before {
      font-family: "Font Awesome 5 Free";
      font-weight: 900;
      content: "\f063";
    }
    .ag-icon-asc::before {
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
      &.ag-header-row-column-group:nth-child(1) {
        height: 30px !important;
      }
      &.ag-header-row-column-group {
        .ag-header-group-cell-with-group {
          border-top: none !important;
        }
      }
      &.ag-header-row-column-group:nth-child(2),
      &.ag-header-row-column:nth-child(3) {
        height: 15px !important;
      }
      &.ag-header-row-column-group:nth-child(2) {
        top: 30px !important;
      }
      &.ag-header-row-column:nth-child(3) {
        top: 45px !important;
      }
    }
    .ag-header {
      background-color: white !important;
      border-top: 1px solid ${Colors.PATTENS_BLUE} !important;
      span {
        font-size: 0.75rem;
        color: ${Colors.BLUE_LAGOON};
        font-weight: 500;
        font-family: "Avenir", "Helvetica Neue", "Helvetica", "Arial", sans-serif !important;
      }
    }
    .ag-header-cell {
      padding: 0 0.75rem;
    }
    .ag-header-group-cell-label {
      justify-content: center;
    }

    .ag-header-group-cell-no-group:first-child {
      border-right: none !important;
    }

    .ag-header-group-cell-no-group:nth-of-type(1),
    .ag-header-group-cell-no-group:last-child,
    .ag-header-group-cell-no-group {
      border-right: 1px solid ${Colors.PATTENS_BLUE} !important;
    }

    .ag-header-group-cell {
      span {
        font-size: 0.75rem !important;
        text-transform: uppercase;
        font-weight: 600;
        color: ${Colors.BLUE_LAGOON};
      }
      &:hover {
        background-color: initial !important;
      }

      &:not(.ag-header-group-cell-no-group) {
        border-left: none !important;
        border-right: 1px solid ${Colors.PATTENS_BLUE} !important;
      }
      &.${GridClasses.NO_RIGHT_BORDER} {
        border-right: none !important;
      }

      &.${GridClasses.SUB_GROUP_HEADER} {
        border-top: none !important;
        .ag-header-group-cell-label {
          align-items: flex-end;
        }
        span {
          opacity: 0.8;
          font-size: 0.625rem !important;
          font-weight: 500;
        }
      }
    }
    .${GridClasses.GROUP_LAST_CHILD_HEADER} {
      border-right: 1px solid ${Colors.PATTENS_BLUE} !important;
    }

    .ag-pinned-left-header {
      .ag-header-group-cell-no-group:last-child {
        border-right: none !important;
      }
      border-right: none !important;
    }

    .ag-header-cell {
      border-top: none !important;
      &.${GridClasses.CELL_CENTERED} {
        .ag-header-cell-label {
          justify-content: center;
        }
      }
      .ag-header-cell-label {
        display: flex;
        justify-content: flex-start;
      }

      &:hover {
        background-color: initial !important;
      }

      &:not(.${GridClasses.GROUP_CHILD_HEADER}) {
        border-left: none !important;
        border-right: 1px solid ${Colors.PATTENS_BLUE} !important;
      }

      &.${GridClasses.NO_RIGHT_BORDER} {
        border-right: none !important;
      }
    }

    .ag-header-cell-resize {
      border-left: none !important;
      border-right: 1px solid ${Colors.PATTENS_BLUE} !important;
    }

    .ag-cell {
      border: none !important;
      font-size: 0.75rem !important;
      font-weight: 600;
      font-family: "Avenir", "Helvetica Neue", "Helvetica", "Arial", sans-serif !important;
      padding: 0 0.75rem;
      &.${GridClasses.NO_RIGHT_BORDER} {
        border-right: none !important;
      }
    }
    .ag-cell:not(.${GridClasses.GROUP_CHILD_CELL}):not(.${GridClasses.NO_RIGHT_BORDER}) {
      border-right: 1px solid ${Colors.PATTENS_BLUE} !important;
    }

    .ag-cell-focus {
      border: none !important;
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
      margin-left: 0.75rem !important;
    }

    .ag-react-container {
      height: 100%;
    }

    .ds-grid-row {
      opacity: 1;
      cursor: default;
      .${GridClasses.DRILLDOWN_ACTION_CELL} {
        width: 32px;
        padding: 0;
        cursor: pointer;
        img {
          opacity: 0;
          transition: 200ms ease-out;
        }
      }
      &:hover,
      &.ag-row-hover,
      &.ag-row-selected {
        .${GridClasses.DRILLDOWN_ACTION_CELL} {
          img {
            opacity: 0.7;
          }
          &:hover {
            img {
              opacity: 1;
            }
          }
        }
      }
      &:hover,
      &.ag-row-hover {
        background-color: ${transparentize(0.5, Colors.PATTENS_BLUE)} !important;
      }

      &.ag-row-selected {
        background-color: ${Colors.ICE_BLUE} !important;
        ${Cell} {
          color: ${Colors.BLUE_WHALE};
        }
      }
    }
  }
`;
