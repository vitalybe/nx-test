import * as React from "react";

import styled from "styled-components";
import { EditorCache, Props } from "./EditorCache";

import { CacheEntity } from "../../../../_domain/cacheEntity";
import { MonitorSegmentEntity } from "../../tabMonitorSegments/_domain/MonitorSegmentEntity";
import { CacheGroupEntity } from "../../../../_domain/cacheGroupEntity";
import { SelectedCdnFixtureDecorator } from "../../_utils/SelectedCdnFixtureDecorator";

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
