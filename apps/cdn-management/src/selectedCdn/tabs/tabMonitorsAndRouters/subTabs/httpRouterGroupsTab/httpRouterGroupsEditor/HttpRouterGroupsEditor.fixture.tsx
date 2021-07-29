/* eslint-disable react-hooks/rules-of-hooks */
import * as React from "react";
import styled from "styled-components";
import {
  HttpRouterGroupsEditor,
  Props,
} from "src/selectedCdn/tabs/tabMonitorsAndRouters/subTabs/httpRouterGroupsTab/httpRouterGroupsEditor/HttpRouterGroupsEditor";
import { HttpRouterGroupEntity } from "src/selectedCdn/tabs/tabMonitorsAndRouters/subTabs/httpRouterGroupsTab/_domain/httpRouterGroupEntity";
import { SelectedCdnFixtureDecorator } from "src/selectedCdn/tabs/_utils/SelectedCdnFixtureDecorator";
import { CdnEntity } from "src/_domain/cdnEntity";

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
