/* eslint-disable react-hooks/rules-of-hooks */
import * as React from "react";
import styled from "styled-components";
import {
  DropdownListItem,
  Props,
} from "./DropdownListItem";
import FixtureDecorator from "../../../../../../utils/cosmos/FixtureDecorator";
import { DropdownEntity } from "../../../../_domain/dropdownEntity";
import { SelectionModeEnum } from "../../../../../../utils/hierarchyUtils";
import { RowItem } from "../../../../_common/rowItem/RowItem";

const View = styled(FixtureDecorator)`
  margin: 1em;
  padding: 1em;
  position: relative;
  border: 3px dashed lightgrey;
  width: 300px;
`;

const entityMock = DropdownEntity.createMock();
const selectedEntityMock = DropdownEntity.createMock({ selection: SelectionModeEnum.SELECTED });
const treeEntityMock = DropdownEntity.createMock({
  children: [
    DropdownEntity.createMock({
      children: [DropdownEntity.createMock(), DropdownEntity.createMock()],
    }),
  ],
});

function getProps(): Props {
  return {
    onSelect: () => {},
    entity: entityMock,
  };
}

export default {
  regular: (
    <View>
      <DropdownListItem {...getProps()} />
    </View>
  ),
  "status text": (
    <View>
      <DropdownListItem
        {...getProps()}
        entity={DropdownEntity.createMock({
          label: "entity 1",
          selection: SelectionModeEnum.NOT_SELECTED,
          rowRenderer: (entity) => RowItem({ entity, statusText: "8" }),
        })}
      />
    </View>
  ),
  selected: (
    <View>
      <DropdownListItem {...getProps()} entity={selectedEntityMock} />
    </View>
  ),
  tree: (
    <View>
      <DropdownListItem {...getProps()} entity={treeEntityMock} />
    </View>
  ),
};
