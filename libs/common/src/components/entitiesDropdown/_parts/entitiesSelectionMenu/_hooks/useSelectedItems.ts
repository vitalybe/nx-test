import { useEffect, useMemo, useState } from "react";
import { DropdownEntity } from "../../../_domain/dropdownEntity";
import _ from "lodash";
import { HierarchyUtils, SelectionModeEnum } from "../../../../../utils/hierarchyUtils";

export interface SelectedItemsData {
  // all modified root items
  rootItems: DropdownEntity[];
  // all root items that are visible after search
  searchedItems: DropdownEntity[];
  // all leaf entities - same as rootItems if not a tree structure
  leafItems: DropdownEntity[];
  // all selected leaf entities
  selectedLeafItems: DropdownEntity[];
  // current search input
  searchInput: string;
  // actions
  toggleAllItems: (isSelected: boolean) => { selectedLeafItems: DropdownEntity[]; rootItems: DropdownEntity[] };
  toggleItem: (id: string, isSelected: boolean) => { selectedLeafItems: DropdownEntity[]; rootItems: DropdownEntity[] };
  setSearchInput: (value: string) => void;
}

export function useSelectedItems(originalItems: DropdownEntity[], shouldSort = true): SelectedItemsData {
  const [searchInput, setSearchInput] = useState("");
  const [modifiedItems, setModifiedItems] = useState<DropdownEntity[]>([]);

  useEffect(() => {
    const items = shouldSort ? orderBySelectionRecursive(_.cloneDeep(originalItems)) : _.cloneDeep(originalItems);
    setModifiedItems(items);
    // NOTE: Since we constantly changing the items (by selecting them), this effect keeps getting called.
    // However, we only want to sort the items at the first time the component mounts.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleAllItems = (isSelected: boolean) => {
    const nextItems = _.cloneDeep(modifiedItems);

    for (const item of nextItems) {
      HierarchyUtils.toggleSelectionMutate(nextItems, item.id, isSelected);
    }

    setModifiedItems(nextItems);

    const { selectedLeaves } = collectSelectedLeavesRecursive(nextItems);
    return { selectedLeafItems: selectedLeaves, rootItems: nextItems };
  };

  const toggleItem = (id: string, isSelected: boolean) => {
    const nextItems = _.cloneDeep(modifiedItems);
    HierarchyUtils.toggleSelectionMutate(nextItems, id, isSelected);
    setModifiedItems(nextItems);

    const { selectedLeaves } = collectSelectedLeavesRecursive(nextItems);
    return { selectedLeafItems: selectedLeaves, rootItems: nextItems };
  };

  const { allLeaves, selectedLeaves } = collectSelectedLeavesRecursive(modifiedItems);

  const searchedItems = useMemo(() => {
    return searchInput ? getSearchedItems(modifiedItems, searchInput) : modifiedItems;
  }, [modifiedItems, searchInput]);

  return {
    rootItems: modifiedItems,
    searchedItems,
    leafItems: allLeaves,
    selectedLeafItems: selectedLeaves,
    searchInput,
    toggleAllItems,
    toggleItem,
    setSearchInput,
  };
}

function getSearchedItems(items: DropdownEntity[], searchInput?: string): DropdownEntity[] {
  const isSearchPass = (entity: DropdownEntity) =>
    !searchInput || entity.label.toLowerCase().includes(searchInput.toLowerCase());

  const isIncluded = (entity: DropdownEntity) =>
    isSearchPass(entity) || (entity.children !== undefined && entity.children.some(isIncluded));

  return items.filter(isIncluded).map((entity) => {
    let children = entity.children?.slice();
    if (children && children.length > 0 && !isSearchPass(entity)) {
      children = getSearchedItems(children, searchInput);
    }
    return new DropdownEntity({ ...entity, children });
  });
}

function orderBySelectionRecursive(items: DropdownEntity[]) {
  for (const entity of items) {
    if (entity.children && entity.children.length > 0) {
      entity.children = orderBySelectionRecursive(entity.children);
    }
  }
  return _.orderBy(
    items,
    [(item) => item.groupRank, rankBySelection, (item) => item.label?.toLowerCase()],
    ["asc", "desc", "asc"]
  );
}

function rankBySelection({ selection }: DropdownEntity) {
  return selection === SelectionModeEnum.SELECTED ? 1 : selection === SelectionModeEnum.PARTIAL ? 0 : -1;
}

export function collectSelectedLeavesRecursive(
  items: DropdownEntity[],
  allLeaves: DropdownEntity[] = [],
  selectedLeaves: DropdownEntity[] = []
) {
  //leaf entity is one that has no children
  for (const item of items) {
    const isParent = item.children && item.children.length > 0;
    if (isParent) {
      collectSelectedLeavesRecursive(item.children!, allLeaves, selectedLeaves);
    } else {
      allLeaves.push(item);
      if (item.selection === SelectionModeEnum.SELECTED) {
        selectedLeaves.push(item);
      }
    }
  }
  return { allLeaves, selectedLeaves };
}
