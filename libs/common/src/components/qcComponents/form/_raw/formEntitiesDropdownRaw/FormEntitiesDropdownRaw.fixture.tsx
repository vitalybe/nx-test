/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-console */
import * as React from "react";
import styled from "styled-components";
import {
  FormEntitiesDropdownRaw,
  Props,
} from "./FormEntitiesDropdownRaw";
import FixtureDecorator from "../../../../../utils/cosmos/FixtureDecorator";
import { DropdownEntity } from "../../../../entitiesDropdown/_domain/dropdownEntity";
const View = styled(FixtureDecorator)`
  margin: 1em;
  padding: 1em;
  position: relative;
  border: 3px dashed lightgrey;

  width: 480px;
  height: 500px;
`;

function getProps(): Props {
  return {
    label: "select networks",
    items: [DropdownEntity.createMock(), DropdownEntity.createMock(), DropdownEntity.createMock()],
    onChange: () => null,
    selectionMode: "single",
  };
}

export default {
  regular: (
    <View>
      <FormEntitiesDropdownRaw {...getProps()} />
    </View>
  ),
};
