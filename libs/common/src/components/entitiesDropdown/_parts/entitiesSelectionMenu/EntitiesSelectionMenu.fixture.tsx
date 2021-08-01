import * as React from "react";
import styled from "styled-components";
import {
  EntitiesSelectionMenu,
  Props,
} from "./EntitiesSelectionMenu";
import { DropdownEntity } from "../../_domain/dropdownEntity";
import FixtureDecorator from "../../../../utils/cosmos/FixtureDecorator";
import { SelectionModeEnum } from "../../../../utils/hierarchyUtils";

const View = styled(FixtureDecorator)`
  margin: 1em;
  padding: 1em;
  position: absolute;
  border: 3px dashed lightgrey;
  background-color: #01222f;
  width: 400px;
`;

const EntitiesSelectionMenuStyled = styled(EntitiesSelectionMenu)`
  width: 100%;
  height: 100%;
`;

function getProps(): Props {
  return {
    originalItems: [
      DropdownEntity.createMock({ selection: SelectionModeEnum.NOT_SELECTED }),
      DropdownEntity.createMock({ selection: SelectionModeEnum.NOT_SELECTED }),
      DropdownEntity.createMock({
        selection: SelectionModeEnum.NOT_SELECTED,
        label: "this is a very very long title wow so long this is a very very long title wow so long",
      }),
      DropdownEntity.createMock({ selection: SelectionModeEnum.NOT_SELECTED }),
      DropdownEntity.createMock({ selection: SelectionModeEnum.NOT_SELECTED }),
      DropdownEntity.createMock({ selection: SelectionModeEnum.NOT_SELECTED }),
    ],
    itemType: "ISP",
    itemTypePlural: "ISPs",
    isSingleSelection: false,
    showApplyButton: true,
    onSelectionChanged: () => {},
  };
}

function getTreeProps() {
  return {
    originalItems: createTreeListItems(),
    itemType: "QN",
    itemTypePlural: "QNs",
    isSingleSelection: false,
    showApplyButton: true,
    onSelectionChanged: () => {},
  };
}
function createTreeListItems() {
  return [
    DropdownEntity.createMock({
      selection: SelectionModeEnum.NOT_SELECTED,
      children: [
        DropdownEntity.createMock({ selection: SelectionModeEnum.NOT_SELECTED }),
        DropdownEntity.createMock({ selection: SelectionModeEnum.NOT_SELECTED }),
      ],
    }),
    DropdownEntity.createMock({
      selection: SelectionModeEnum.NOT_SELECTED,
      children: [
        DropdownEntity.createMock({
          selection: SelectionModeEnum.NOT_SELECTED,
          children: [DropdownEntity.createMock({ selection: SelectionModeEnum.NOT_SELECTED })],
        }),
        DropdownEntity.createMock({ selection: SelectionModeEnum.NOT_SELECTED }),
      ],
    }),
  ];
}
export default {
  "0 selected": (
    <View>
      <EntitiesSelectionMenuStyled {...getProps()} />
    </View>
  ),
  "1 selected": () => {
    const props = getProps();
    props.originalItems[2].selection = SelectionModeEnum.SELECTED;
    return (
      <View>
        <EntitiesSelectionMenuStyled {...props} />
      </View>
    );
  },
  "2+ selected": () => {
    const props = getProps();
    props.originalItems[2].selection = SelectionModeEnum.SELECTED;
    props.originalItems[3].selection = SelectionModeEnum.SELECTED;
    return (
      <View>
        <EntitiesSelectionMenuStyled {...props} />
      </View>
    );
  },
  "single selection": () => {
    return (
      <View>
        <EntitiesSelectionMenuStyled isSingleSelection {...getProps()} />
      </View>
    );
  },
  "multi selection search": () => {
    return (
      <View>
        <EntitiesSelectionMenuStyled isSearchable {...getProps()} />
      </View>
    );
  },
  "single selection search": () => {
    return (
      <View>
        <EntitiesSelectionMenuStyled isSingleSelection isSearchable {...getProps()} />
      </View>
    );
  },
  "tree structure": () => {
    return (
      <View>
        <EntitiesSelectionMenuStyled isSearchable {...getTreeProps()} />
      </View>
    );
  },
  "virtualised long list": () => {
    return (
      <View>
        <EntitiesSelectionMenuStyled
          isSearchable
          {...getTreeProps()}
          originalItems={[...Array(300)].flatMap(createTreeListItems)}
        />
      </View>
    );
  },
};
