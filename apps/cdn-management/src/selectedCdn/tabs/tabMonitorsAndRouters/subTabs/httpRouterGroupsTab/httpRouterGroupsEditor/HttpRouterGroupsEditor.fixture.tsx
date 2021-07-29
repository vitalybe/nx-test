/* eslint-disable react-hooks/rules-of-hooks */
import * as React from "react";
import styled from "styled-components";
import {
  HttpRouterGroupsEditor,
  Props,
} from "./HttpRouterGroupsEditor";
import { HttpRouterGroupEntity } from "../_domain/httpRouterGroupEntity";
import { SelectedCdnFixtureDecorator } from "../../../../_utils/SelectedCdnFixtureDecorator";
import { CdnEntity } from "../../../../../../_domain/cdnEntity";

const View = styled(SelectedCdnFixtureDecorator)`
  margin: 1em;
  padding: 1em;
  position: relative;
`;

function getProps(): Props {
  const editedItem = HttpRouterGroupEntity.createMock();
  return {
    existingGroups: [
      editedItem,
      HttpRouterGroupEntity.createMock(),
      HttpRouterGroupEntity.createMock(),
      HttpRouterGroupEntity.createMock(),
    ],
    editedItem,
    cdn: CdnEntity.createMock(),
    onClose: () => {},
  };
}

export default {
  regular: (
    <View>
      <HttpRouterGroupsEditor {...getProps()}></HttpRouterGroupsEditor>
    </View>
  ),
};
