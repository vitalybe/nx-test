import * as React from "react";
import { ReactElement, ReactNode, useContext, useEffect, useMemo, useState } from "react";
import styled, { css, FlattenSimpleInterpolation as StyledCSS } from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons/faChevronDown";
import { faChevronUp } from "@fortawesome/free-solid-svg-icons/faChevronUp";
import { lighten } from "polished";
import { EntitiesSelectionMenu } from "./_parts/entitiesSelectionMenu/EntitiesSelectionMenu";
import { CommonColors as Colors } from "../../styling/commonColors";
import { DropdownEntity } from "./_domain/dropdownEntity";
import { Tooltip, TooltipControlType, useTooltip } from "../Tooltip";
import { collectSelectedLeavesRecursive } from "./_parts/entitiesSelectionMenu/_hooks/useSelectedItems";
import { CommonStyles } from "../../styling/commonStyles";
import { ConfigurationStyles } from "../configuration/_styles/configurationStyles";
import { faSpinner } from "@fortawesome/free-solid-svg-icons/faSpinner";
import { DropdownSelectorRenderer } from "./_overrideableParts/dropdownSelectorRenderer/DropdownSelectorRenderer";
import { TippyProps } from "@tippy.js/react";

//region [[ Styles ]]

export interface ComponentTheme {
  backgroundColor: string;
  hoverColor: string;
  borderColor: string;
  color: string;
  iconBackground: string;
}

const darkTheme: ComponentTheme = {
  backgroundColor: Colors.DAINTREE,
  hoverColor: lighten(0.2, Colors.DAINTREE),
  borderColor: Colors.DAINTREE,
  color: Colors.WHITE,
  iconBackground: Colors.WHITE,
};

const lightTheme: ComponentTheme = {
  backgroundColor: Colors.WHITE,
  hoverColor: Colors.PATTENS_BLUE,
  borderColor: Colors.WHITE,
  color: Colors.ARAPAWA,
  iconBackground: "transparent",
};

type ComponentThemeType = "light" | "dark";

const EntitiesDropdownView = styled.div<{ disabled?: boolean }>`
  position: relative;
  pointer-events: ${(props) => (props.disabled ? "none" : "inherit")};
  background: ${(props) => (props.disabled ? "grey" : "transparent")};
  ${(props) =>
    props.disabled &&
    css`
      pointer-events: none;
      background: grey;
    `};
`;

export const Content = styled.div<{ componentTheme: ComponentTheme; customStyles?: StyledCSS; disabled?: boolean }>`
  border: 1px solid ${(props) => props.componentTheme.borderColor};
  background-color: ${(props) => props.componentTheme.backgroundColor};
  color: ${(props) => props.componentTheme.color};
  display: flex;
  padding: 0.625rem 1.6rem 0.625rem 1rem;
  height: 100%;
  min-height: 2.8rem;
  border-radius: 4px;
  align-items: center;
  &:focus {
    outline: none;
    border-color: black;
  }
  ${(props) =>
    props.customStyles ??
    CommonStyles.clickableStyle("background-color", "rgba(0,0,0,0)", {
      hoverColor: props.componentTheme.hoverColor,
      activeColor: props.componentTheme.hoverColor,
    })}

  ${(props) =>
    props.disabled
      ? css`
          background-color: ${ConfigurationStyles.COLOR_GREY_1};
          pointer-events: none;
          color: grey;
          border: none;
        `
      : ""};
`;

export const ToggleIcon = styled(FontAwesomeIcon)`
  position: absolute;
  right: 0.6rem;
  margin-left: auto;
  font-size: 0.75rem !important;
`;

const EntitiesSelectionMenuStyled = styled(EntitiesSelectionMenu)<{ customStyles?: StyledCSS }>`
  min-width: 21.875rem;
  ${(props) => props.customStyles};
`;
//endregion [[ Styles ]]

//region [[ Props ]]
export type EntitiesDropdownSelectionMode = "single" | "multipleApplyOnClose" | "multipleApplyOnButton";
export interface Props<T extends DropdownEntity> {
  dropdownSelectorRenderer: ReactNode;

  itemType?: string;
  itemTypePlural?: string;

  isLoading?: boolean;
  disabled?: boolean;
  items: DropdownEntity[];
  selectionMode: EntitiesDropdownSelectionMode;
  //allows only a single root selection yet multi-children selection on the selected root
  isSingleRootMultiSelection?: boolean;

  onSelectionChanged: (selectedItems: T[], allItems: T[], itemType: string, itemTypePlural: string) => void;

  shouldSortBySelection?: boolean;
  isControlled?: boolean;
  isSearchable?: boolean;
  //temporary prop for QNs selection until QND supports long URLs
  maxPartialSelectionCount?: number;

  //used to control the tooltip from parent component
  tooltipControl?: TooltipControlType;

  componentThemeType: ComponentThemeType;
  // allows passing styled.css definitions directly to the tooltip element (selection menu).
  tooltipStyles?: StyledCSS;
  tooltipMaxWidth?: number | string;
  customHeader?: ReactNode;
  shouldMatchMenuWidth?: boolean;
  contentStyles?: StyledCSS;
  tippyOverrides?: Partial<TippyProps>;
  overrideEntitiesSelectionMenu?: ReactElement;
  className?: string;
}

export interface Ref {
  hideDropDown: () => void;
}
//endregion [[ Props ]]

export const EntitiesDropdown = <T extends DropdownEntity>({
  itemType = "item",
  itemTypePlural = "items",
  shouldSortBySelection = true,
  ...props
}: Props<T>) => {
  const tooltipControl = useTooltip({ matchParentWidth: !!props.shouldMatchMenuWidth });
  const { isOpen, hide, tooltipController } = props.tooltipControl ?? tooltipControl;

  const componentTheme = props.componentThemeType === "light" ? lightTheme : darkTheme;

  const [selectedItems, setSelectedItems] = useState<DropdownEntity[]>([]);

  const isSingleSelection = props.selectionMode === "single";

  const selectedItemsMemo = useMemo(() => {
    return props.isControlled ? collectSelectedLeavesRecursive(props.items).selectedLeaves : selectedItems;
  }, [props.items, selectedItems, props.isControlled]);

  useEffect(() => {
    if (!props.isControlled) {
      const { selectedLeaves } = collectSelectedLeavesRecursive(props.items);
      setSelectedItems(selectedLeaves);
    }
  }, [props.items, props.isControlled]);

  function onSelectionChanged(selectedItems: DropdownEntity[], allItems: DropdownEntity[]) {
    if (!props.isControlled) {
      setSelectedItems(selectedItems);
    }
    props.onSelectionChanged(selectedItems as T[], allItems as T[], itemType, itemTypePlural);

    if (props.selectionMode !== "multipleApplyOnClose") {
      hide();
    }
  }

  return (
    <EntitiesDropdownContext.Provider
      value={{
        items: props.items,
        selectedItems: selectedItemsMemo,

        componentTheme: componentTheme,
        isSingleSelection: isSingleSelection,
        itemType: itemType,
        itemTypePlural: itemTypePlural,
      }}>
      <EntitiesDropdownView className={props.className} disabled={props.disabled}>
        <Tooltip
          ignoreBoundaries
          content={
            isOpen
              ? props.overrideEntitiesSelectionMenu ?? (
                  <EntitiesSelectionMenuStyled
                    shouldSortBySelection={shouldSortBySelection}
                    customStyles={props.tooltipStyles}
                    isSingleSelection={isSingleSelection}
                    isSearchable={props.isSearchable}
                    originalItems={props.items}
                    itemType={itemType}
                    itemTypePlural={itemTypePlural}
                    onSelectionChanged={onSelectionChanged}
                    maxPartialSelectionCount={props.maxPartialSelectionCount}
                    customHeader={props.customHeader}
                    showApplyButton={props.selectionMode === "multipleApplyOnButton"}
                    isSingleRootMultiSelection={props.isSingleRootMultiSelection}
                  />
                )
              : ""
          }
          maxWidth={props.tooltipMaxWidth ?? ""}
          distance={4}
          disabled={props.isLoading}
          placement={"bottom-start"}
          hideOnClick={true}
          interactive={true}
          trigger={"click"}
          arrow={false}
          tooltipController={tooltipController}
          {...props.tippyOverrides}>
          <Content
            data-testid={"dropdown-selector"}
            componentTheme={componentTheme}
            customStyles={props.contentStyles}
            disabled={props.disabled}>
            {props.dropdownSelectorRenderer || (
              <DropdownSelectorRenderer noSelectionPlaceholder={props.isLoading ? "Loading" : "No Selection"} />
            )}
            <ToggleIcon
              icon={props.isLoading ? faSpinner : isOpen ? faChevronUp : faChevronDown}
              spin={props.isLoading}
            />
          </Content>
        </Tooltip>
      </EntitiesDropdownView>
    </EntitiesDropdownContext.Provider>
  );
};

interface PropsByContext {
  items: DropdownEntity[];
  selectedItems: DropdownEntity[];

  itemType: string;
  itemTypePlural: string;
  isSingleSelection: boolean;
  componentTheme: ComponentTheme;
}

export const EntitiesDropdownContext = React.createContext<PropsByContext | undefined>(undefined);

export function useEntitiesDropdownContext() {
  const contextData = useContext(EntitiesDropdownContext);
  if (!contextData) {
    throw new Error(`component lacks EntitiesDropdown context`);
  }
  return contextData;
}
