import * as React from "react";
import styled from "styled-components";
import { Props, TabCaches } from "src/selectedCdn/tabs/tabCaches/TabCaches";

import { DeploymentEntity } from "common/domain/qwiltDeployment/deploymentEntity";
import { QnEntity } from "src/_domain/qnEntity";
import { CacheEntity } from "src/_domain/cacheEntity";
import { CacheGroupEntity } from "src/_domain/cacheGroupEntity";
import { SelectedCdnFixtureDecorator } from "src/selectedCdn/tabs/_utils/SelectedCdnFixtureDecorator";

const View = styled(SelectedCdnFixtureDecorator)`
  margin: 1em;
  border: 3px dashed lightgrey;
  height: 500px;
`;

function getProps(propsOverrides?: Partial<Props>): Props {
  return {
    networks: [
      DeploymentEntity.createMock(),
      DeploymentEntity.createMock(),
      DeploymentEntity.createMock(),
      DeploymentEntity.createMock(),
    ],
    availableQns: [QnEntity.createMock(), QnEntity.createMock(), QnEntity.createMock()],
    caches: [CacheEntity.createMock(), CacheEntity.createMock(), CacheEntity.createMock()],
    cacheGroups: [CacheGroupEntity.createMock(), CacheGroupEntity.createMock(), CacheGroupEntity.createMock()],
    ...propsOverrides,
  };
}

const props = getProps();

export default {
  Regular: () => (
    <View>
      <TabCaches {...props} />
    </View>
  ),
};
