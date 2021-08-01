/* eslint-disable react-hooks/rules-of-hooks */
import * as React from "react";
import styled from "styled-components";
import {
  MonitorSegmentsEditor,
  Props,
} from "./MonitorSegmentsEditor";
import { MonitorSegmentEntity } from "../_domain/MonitorSegmentEntity";
import { SelectedCdnFixtureDecorator } from "../../_utils/SelectedCdnFixtureDecorator";
import { CdnEntity } from "../../../../_domain/cdnEntity";

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
