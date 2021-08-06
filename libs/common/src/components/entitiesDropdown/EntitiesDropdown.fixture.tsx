/* eslint-disable react-hooks/rules-of-hooks */
import * as React from "react";
import { useState } from "react";
import styled from "styled-components";
import { EntitiesDropdown, Props } from "./EntitiesDropdown";
import { DropdownEntity } from "./_domain/dropdownEntity";

import FixtureDecorator from "../../utils/cosmos/FixtureDecorator";
import { CommonColors } from "../../styling/commonColors";
import { EntitiesDropdownMocks } from "./_util/entitiesDropdownMocks";
import { DropdownSelectorRenderer } from "./_overrideableParts/dropdownSelectorRenderer/DropdownSelectorRenderer";
import { SelectionModeEnum } from "../../utils/hierarchyUtils";

const View = styled(FixtureDecorator)<{ isDark?: boolean }>`
  margin: 1em;
  padding: 1em;
  position: absolute;
  border: 3px dashed lightgrey;
  width: 400px;
  background-color: ${(props) => (props.isDark ? CommonColors.BLACK_PEARL : "transparent")};
`;

const EntitiesDropdownStyled = styled(EntitiesDropdown)`
  width: 100%;
  height: 62px;
`;

function getProps(): Props<DropdownEntity> {
  return {
    itemType: "ISP",
    itemTypePlural: "ISPs",
    items: EntitiesDropdownMocks.entitiesList(),
    componentThemeType: "dark",
    onSelectionChanged: () => {},
    dropdownSelectorRenderer: <DropdownSelectorRenderer allItemsSelectedText={"All Isps Overview".toUpperCase()} />,
    selectionMode: "multipleApplyOnButton",
  };
}

function getTreeProps(): Props<DropdownEntity> {
  return {
    ...getProps(),
    items: EntitiesDropdownMocks.treeList(),
  };
}

export default {
  "All selected": () => {
    const props = getProps();
    const items = props.items.map((item) => new DropdownEntity({ ...item, selection: SelectionModeEnum.SELECTED }));
    return (
      <View>
        <EntitiesDropdownStyled {...props} items={items} componentThemeType={"light"} />
      </View>
    );
  },
  "1 selected": () => {
    const props = getProps();
    props.items[0].selection = SelectionModeEnum.SELECTED;
    return (
      <View>
        <EntitiesDropdownStyled {...props} componentThemeType={"light"} />
      </View>
    );
  },
  "1 selected - Dark": () => {
    const props = getProps();
    props.items[0].selection = SelectionModeEnum.SELECTED;
    return (
      <View isDark>
        <EntitiesDropdownStyled {...props} componentThemeType={"dark"} />
      </View>
    );
  },
  "1 selected long name": () => {
    const props = getProps();
    props.items[0].label = "This is a very long ISP name This is a very long ISP name This is a very long ISP name";
    props.items[0].selection = SelectionModeEnum.SELECTED;
    return (
      <View>
        <EntitiesDropdownStyled {...props} componentThemeType={"light"} />
      </View>
    );
  },
  "3 selected": () => {
    const props = getProps();
    props.items[0].selection = SelectionModeEnum.SELECTED;
    props.items[1].selection = SelectionModeEnum.SELECTED;
    props.items[2].selection = SelectionModeEnum.SELECTED;
    return (
      <View>
        <EntitiesDropdownStyled {...props} componentThemeType={"light"} />
      </View>
    );
  },
  "4+ selected": () => {
    const props = getProps();
    props.items.slice(1).forEach((item) => (item.selection = SelectionModeEnum.SELECTED));
    return (
      <View>
        <EntitiesDropdownStyled {...props} componentThemeType={"light"} />
      </View>
    );
  },
  "single selection": () => {
    const props = getProps();
    props.items[0].selection = SelectionModeEnum.SELECTED;
    return (
      <View>
        <EntitiesDropdownStyled {...props} selectionMode={"single"} componentThemeType={"light"} />
      </View>
    );
  },
  searchable: () => {
    const props = getProps();
    props.items.slice(1).forEach((item) => (item.selection = SelectionModeEnum.SELECTED));
    return (
      <View>
        <EntitiesDropdownStyled isSearchable {...props} componentThemeType={"light"} />
      </View>
    );
  },
  "single selection searchable": () => {
    const props = getProps();
    props.items[0].selection = SelectionModeEnum.SELECTED;
    return (
      <View>
        <EntitiesDropdownStyled {...props} selectionMode={"single"} componentThemeType={"light"} isSearchable />
      </View>
    );
  },
  tree: () => {
    const props = getTreeProps();
    const [items, setItems] = useState(props.items);

    return (
      <View>
        <EntitiesDropdownStyled
          {...props}
          items={items}
          onSelectionChanged={(selectedItems: DropdownEntity[], allItems: DropdownEntity[]) => {
            setItems(allItems);
          }}
          componentThemeType={"light"}
        />
      </View>
    );
  },
  "custom selector renderer": () => {
    const props = getProps();
    props.items[0].selection = SelectionModeEnum.SELECTED;
    props.items[1].selection = SelectionModeEnum.SELECTED;
    props.items[2].selection = SelectionModeEnum.SELECTED;
    return (
      <View>
        <EntitiesDropdownStyled {...props} componentThemeType={"light"} dropdownSelectorRenderer={<div>Hello</div>} />
      </View>
    );
  },
  "multi-selection, no apply": () => {
    const props = getProps();
    return (
      <View>
        <EntitiesDropdownStyled {...props} selectionMode={"multipleApplyOnClose"} componentThemeType={"light"} />
      </View>
    );
  },
};
