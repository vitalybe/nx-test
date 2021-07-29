/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-console */
import * as React from "react";
import styled from "styled-components";
import { CdnEditor, Props } from "src/topBar/cdnsDropdown/cdnEditor/CdnEditor";
import FixtureDecorator from "common/utils/cosmos/FixtureDecorator";
import { CdnEntity } from "src/_domain/cdnEntity";

const View = styled(FixtureDecorator)`
  margin: 1em;
  padding: 1em;
  position: relative;
  border: 3px dashed lightgrey;

  width: 1000px;
  height: 500px;
`;

function getProps(): Props {
  return {
    editedItem: CdnEntity.createMock(),
    onClose: () => {},
  };
}

export default {
  regular: (
    <View>
      <CdnEditor {...getProps()}></CdnEditor>
    </View>
  ),
};
