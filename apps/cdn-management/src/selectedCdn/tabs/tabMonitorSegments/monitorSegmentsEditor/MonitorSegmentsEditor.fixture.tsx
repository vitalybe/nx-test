/* eslint-disable react-hooks/rules-of-hooks */
import * as React from "react";
import styled from "styled-components";
import {
  MonitorSegmentsEditor,
  Props,
} from "src/selectedCdn/tabs/tabMonitorSegments/monitorSegmentsEditor/MonitorSegmentsEditor";
import { MonitorSegmentEntity } from "src/selectedCdn/tabs/tabMonitorSegments/_domain/MonitorSegmentEntity";
import { SelectedCdnFixtureDecorator } from "src/selectedCdn/tabs/_utils/SelectedCdnFixtureDecorator";
import { CdnEntity } from "src/_domain/cdnEntity";

const View = styled(SelectedCdnFixtureDecorator)`
  margin: 1em;
  padding: 1em;
  position: relative;
`;

function getProps(): Props {
  const editedItem = MonitorSegmentEntity.createMock();
  return {
    allHealthCollectorIds: [
      editedItem.id,
      MonitorSegmentEntity.createMock().id,
      MonitorSegmentEntity.createMock().id,
      MonitorSegmentEntity.createMock().id,
    ],
    editedItem,
    cdn: CdnEntity.createMock(),
    onClose: () => {},
  };
}

export default {
  regular: (
    <View>
      <MonitorSegmentsEditor {...getProps()}></MonitorSegmentsEditor>
    </View>
  ),
};
