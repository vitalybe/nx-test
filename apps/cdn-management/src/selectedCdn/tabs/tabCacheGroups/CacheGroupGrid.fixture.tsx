/* eslint-disable react-hooks/rules-of-hooks */
import * as React from "react";
import styled from "styled-components";
import { CacheGroupGrid, Props } from "src/selectedCdn/tabs/tabCacheGroups/CacheGroupGrid";
import { CacheGroupEntity } from "src/_domain/cacheGroupEntity";
import { SelectedCdnFixtureDecorator } from "src/selectedCdn/tabs/_utils/SelectedCdnFixtureDecorator";

const View = styled(SelectedCdnFixtureDecorator)`
  margin: 1em;
  padding: 1em;
  position: relative;
  border: 3px dashed lightgrey;

  width: 1000px;
  height: 500px;
  // without 'grid' the child item won't get the dimensions of the parent
  display: grid;
`;

function getProps(): Props {
  return {
    cacheGroups: [CacheGroupEntity.createMock()],
  };
}

export default {
  regular: (
    <View>
      <CacheGroupGrid {...getProps()}></CacheGroupGrid>
    </View>
  ),
};
