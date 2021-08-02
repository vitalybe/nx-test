import React, { ReactNode } from "react";
import styled from "styled-components";
import { CommonColors, CommonColors as Colors } from "common/styling/commonColors";

import { DropdownEntity } from "common/components/entitiesDropdown/_domain/dropdownEntity";
import { SearchInput } from "common/components/searchInput/SearchInput";
import { transparentize } from "polished";
import { DropdownListItem } from "common/components/entitiesDropdown/_parts/entitiesSelectionMenu/_parts/dropdownListItem/DropdownListItem";
import { useSelectedItems } from "common/components/entitiesDropdown/_parts/entitiesSelectionMenu/_hooks/useSelectedItems";
import { Clickable } from "common/components/configuration/clickable/Clickable";
import { Notifier } from "common/utils/notifications/notifier";
import { DynamicVirtualizedList } from "common/components/virtualizedList/DynamicVirtualizedList";
import { HierarchyUtils, SelectionModeEnum } from "common/utils/hierarchyUtils";

//region [[ Styles ]]

const EntitiesSelectionMenuView = styled.div`
  width: 100%;
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
  background-color: ${CommonColors.WHITE};
  border-radius: 5px;
  color: ${Colors.ARAPAWA};
  text-align: left;
  user-select: none;
`;

const Header = styled.div`
  padding: 0.7em 1em;
  display: flex;
  justify-content: flex-end;
  border-bottom: 1px solid ${transparentize(0.9, CommonColors.NAVY_4)};
  font-size: 12px;
  align-items: center;
`;
const SelectCounter = styled.div`
  font-weight: bold;
  margin-right: auto;
`;

const BulkActionLink = styled(Clickable).attrs({ textColor: Colors.ARAPAWA })`
  &:not(:last-child) {
    margin-right: 8px;
  }
`;

const Footer = styled.div`
  padding: 0.7em 1em;
  display: flex;
  justify-content: flex-end;
`;
const Apply = styled(Clickable).attrs({ textColor: Colors.BLUE_LAGOON })<{ disabled: boolean }>`
  text-transform: uppercase;
  font-weight: bold;
`;

//endregion [[ Styles ]]

//region [[ Props ]]

export interface Props {
  originalItems: DropdownEntity[];
  itemType: string;
  itemTypePlural: string;
  isSingleSelection: boolean;
  //allows only a single root selection yet multi-children selection on the selected root
  isSingleRootMultiSelection?: boolean;
  showApplyButton: boolean;
  shouldSortBySelection?: boolean;
  onSelectionChanged: (selectedItems: DropdownEntity[], allItems: DropdownEntity[]) => void;
  isSearchable?: boolean;
  //temporary prop for QNs selection until QND supports long URLs
  maxPartialSelectionCount?: number;
  customHeader?: ReactNode;
  className?: string;
}
//endregion [[ Props ]]

export const EntitiesSelectionMenu = ({ ...props }: Props) => {
  const {
    rootItems,
    searchedItems,
    leafItems,
    selectedLeafItems,
    searchInput,
    setSearchInput,
    toggleItem,
    toggleAllItems,
  } = useSelectedItems(props.originalItems, props.shouldSortBySelection);

  const selectedItemsCount = selectedLeafItems.length;

  let message = "None selected";
  if (selectedItemsCount > 0) {
    const itemType = selectedItemsCount > 1 ? props.itemTypePlural : props.itemType;
    message = `${selectedItemsCount} ${itemType} selected`;
  }

  function selectionCallback(item: DropdownEntity) {
    if (props.isSingleSelection) {
      if (item.customSelectionCallback) {
        props.onSelectionChanged(item.customSelectionCallback(searchedItems), leafItems);
      } else {
        props.onSelectionChanged([new DropdownEntity({ ...item, selection: SelectionModeEnum.SELECTED })], leafItems);
      }
    } else {
      const isSelected = item.selection === SelectionModeEnum.SELECTED;
      if (props.isSingleRootMultiSelection) {
        let currentSelectedRootItem: DropdownEntity | undefined;
        let newSelectedRootItem: DropdownEntity | undefined;

        rootItems.forEach((rootItem) => {
          if (
            rootItem.id === selectedLeafItems[0]?.id ||
            rootItem.children?.some((child) => child.id === selectedLeafItems[0]?.id)
          ) {
            currentSelectedRootItem = rootItem;
          }

          if (rootItem.id === item.id || rootItem.children?.some((child) => child.id === item.id)) {
            newSelectedRootItem = rootItem;
          }
        });

        if (currentSelectedRootItem && newSelectedRootItem && currentSelectedRootItem.id !== newSelectedRootItem.id) {
          HierarchyUtils.toggleSelectionMutate([currentSelectedRootItem], currentSelectedRootItem.id, false);
        }
        HierarchyUtils.toggleSelectionMutate(rootItems, item.id, isSelected);
      }
      const toggleResult = toggleItem(item.id, !isSelected);

      if (!props.showApplyButton) {
        apply(toggleResult.selectedLeafItems, toggleResult.rootItems, props);
      }
    }
  }

  function toggleAll(isSelected: boolean) {
    const toggleResult = toggleAllItems(isSelected);

    if (!props.showApplyButton) {
      apply(toggleResult.selectedLeafItems, toggleResult.rootItems, props);
    }
  }

  return (
    <EntitiesSelectionMenuView data-testid={"dropdown-options"} className={props.className}>
      {(!props.isSingleSelection || props.isSearchable) && (
        <Header>
          {props.isSearchable && (
            <SearchInput value={searchInput} onChange={setSearchInput} placeholder={"Search " + props.itemTypePlural} />
          )}
          {props.customHeader ?? null}
          {!props.isSingleRootMultiSelection && !props.isSingleSelection && !props.customHeader && (
            <>
              <BulkActionLink onClick={() => toggleAll(false)}>Clear all</BulkActionLink>
              <BulkActionLink onClick={() => toggleAll(true)}>Select all</BulkActionLink>
            </>
          )}
        </Header>
      )}
      <DynamicVirtualizedList
        totalCount={searchedItems.length}
        renderer={(index) => {
          const item = searchedItems[index];
          return (
            item && (
              <DropdownListItem
                key={item.id}
                entity={item}
                onSelect={selectionCallback}
                isSingleSelection={item.isSingleSelection ?? props.isSingleSelection}
              />
            )
          );
        }}
      />
      {props.showApplyButton && (
        <Footer>
          <SelectCounter>{message}</SelectCounter>
          <Apply disabled={selectedLeafItems.length === 0} onClick={() => apply(selectedLeafItems, rootItems, props)}>
            Apply
          </Apply>
        </Footer>
      )}
    </EntitiesSelectionMenuView>
  );
};

function apply(selectedItems: DropdownEntity[], rootItems: DropdownEntity[], props: Props) {
  const maxSelectionCount = props.maxPartialSelectionCount;
  const selectedItemsCount = selectedItems.length;
  const isTooManySelected =
    maxSelectionCount && selectedItemsCount !== selectedItems.length && selectedItemsCount > maxSelectionCount;
  if (!isTooManySelected) {
    props.onSelectionChanged(selectedItems, rootItems);
  } else if (isTooManySelected) {
    Notifier.info(`Too many items were selected`, {
      text: `Currently, partial selection of more than ${maxSelectionCount} ${props.itemTypePlural} is not supported`,
    });
  }
}
