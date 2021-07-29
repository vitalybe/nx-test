import * as React from "react";

import styled from "styled-components";
import { EditorCache, Props } from "src/selectedCdn/tabs/tabCaches/editorCache/EditorCache";

import { CacheEntity } from "src/_domain/cacheEntity";
import { MonitorSegmentEntity } from "src/selectedCdn/tabs/tabMonitorSegments/_domain/MonitorSegmentEntity";
import { CacheGroupEntity } from "src/_domain/cacheGroupEntity";
import { SelectedCdnFixtureDecorator } from "src/selectedCdn/tabs/_utils/SelectedCdnFixtureDecorator";

const View = styled(SelectedCdnFixtureDecorator)`
  margin: 1em;
  width: 400px;
  border: 3px dashed lightgrey;
`;

function getProps(propsOverrides?: Partial<Props>): Props {
  return {
    onClose: function () {},
    isEdit: true,
    cache: CacheEntity.createMock(),
    monitorSegments: [
      MonitorSegmentEntity.createMock(),
      MonitorSegmentEntity.createMock(),
      MonitorSegmentEntity.createMock(),
    ],
    cacheGroups: [CacheGroupEntity.createMock(), CacheGroupEntity.createMock(), CacheGroupEntity.createMock()],
    ...propsOverrides,
  };
}

export default {
  Regular: (
    <View>
      <EditorCache {...getProps()} />
    </View>
  ),
};
