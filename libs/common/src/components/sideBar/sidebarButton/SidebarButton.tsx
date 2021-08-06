import * as React from "react";
import { FocusEventHandler } from "react";
import styled from "styled-components";
import { loggerCreator } from "../../../utils/logger";
import { SideBarStyles } from "../_styles/sideBarStyles";
import { Title } from "../_styles/sideBarCommon";
import { Icons } from "../../../styling/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const moduleLogger = loggerCreator("__filename");

//region [[ Styles ]]

const SidebarButtonView = styled.a<{ isChild: boolean; isSelected: boolean }>`
  text-decoration: none;
  cursor: pointer;
  width: ${SideBarStyles.SIDEBAR_WIDE_WIDTH};
  display: flex;
  align-items: center;
  transition: 0.3s ease;
  padding-right: 0.5rem;
  &:hover {
    background-color: ${SideBarStyles.NAV_BUTTON_HOVER_COLOR};
  }
  min-height: ${SideBarStyles.NAV_BUTTON_HEIGHT};

  background-color: ${(props) => {
    if (props.isChild) {
      return props.isSelected
        ? SideBarStyles.CHILD_NAV_BUTTON_SELECTED_BACKGROUND
        : SideBarStyles.CHILD_NAV_BUTTON_BACKGROUND;
    } else {
      return props.isSelected
        ? SideBarStyles.NAV_BUTTON_DEFAULT_SELECTED_BACKGROUND
        : SideBarStyles.NAV_BUTTON_DEFAULT_BACKGROUND;
    }
  }};
`;

const IconContainer = styled.div<{ selected: boolean }>`
  ${(props) => (props.selected ? `${SideBarStyles.WHITE_FILTER}` : "")};
  padding-left: 8px;
  width: 20px;
`;

const ItemIcon = styled(FontAwesomeIcon)<{ selected: boolean }>`
  color: #0db2f6;
  opacity: ${({ selected }) => (selected ? 1 : 0.4)};
  ${SidebarButtonView}:hover & {
    opacity: ${({ selected }) => (selected ? 1 : 0.6)};
  }
  margin-top: -1px;
`;

const RouteIcon = styled.img<{ hasChildren: boolean; selected: boolean }>`
  margin-left: ${(props) => (props.hasChildren ? "0" : "20px")};
  opacity: ${({ selected }) => (selected ? 1 : 0.4)};
  ${({ selected }) => (selected ? "filter: brightness(0) invert(1)" : "")};

  ${SidebarButtonView}:hover & {
    opacity: ${({ selected }) => (selected ? 1 : 0.6)};
  }
`;

const TitleStyled = styled(Title)<{ selected: boolean }>`
  max-width: 100%;
  margin-left: 16px;
  color: ${({ selected }) => (selected ? "#ffffff" : "#3780a2")};

  ${SidebarButtonView}:hover & {
    color: ${({ selected }) => (selected ? "#ffffff" : "#5ea8c9")};
  }
`;

//endregion [[ Styles ]]

//region [[ Props ]]

export interface Props {
  shouldShowTitle: boolean;
  isSelected: boolean;
  image?: string;
  label: string;
  href?: string;

  childrenState: "none" | "collapsed" | "expanded";
  isChild: boolean;

  onClick?: () => void;
  onFocus?: FocusEventHandler;
  className?: string;
}

//endregion [[ Props ]]

export const SidebarButton = (props: Props) => {
  return (
    <SidebarButtonView
      onFocus={props.onFocus}
      className={props.className}
      isSelected={props.isSelected}
      href={props.href}
      isChild={props.isChild}
      onClick={props.onClick}>
      {props.childrenState !== "none" ? (
        <IconContainer selected={props.isSelected}>
          <ItemIcon
            selected={props.isSelected}
            icon={props.childrenState === "expanded" ? Icons.ANGLE_DOWN : Icons.ANGLE_RIGHT}
          />
        </IconContainer>
      ) : null}
      {props.image && (
        <RouteIcon
          hasChildren={props.childrenState !== "none"}
          selected={props.isSelected}
          src={props.image}
          alt={props.label}
        />
      )}
      {props.shouldShowTitle && <TitleStyled selected={props.isSelected}>{props.label}</TitleStyled>}
    </SidebarButtonView>
  );
};
