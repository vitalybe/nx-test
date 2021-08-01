/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-console */
import * as React from "react";
import styled from "styled-components";
import {
  MonitorEditor,
  Props,
} from "src/selectedCdn/tabs/tabMonitorsAndRouters/subTabs/monitorsTab/monitorEditor/MonitorEditor";
import { MonitorEntity } from "src/selectedCdn/tabs/tabMonitorsAndRouters/subTabs/monitorsTab/_domain/monitorEntity";
import { SelectedCdnFixtureDecorator } from "src/selectedCdn/tabs/_utils/SelectedCdnFixtureDecorator";

const View = styled(SelectedCdnFixtureDecorator)`
  margin: 1em;
  padding: 1em;
  position: relative;
  border: 3px dashed lightgrey;

  width: 1000px;
  height: 500px;
`;

function getProps(): Props {
  return {
    editedItem: MonitorEntity.createMock(),
    cdnName: "CDN Name",
    onClose: () => {},
  };
}

export default {
  regular: (
    <View>
      <MonitorEditor {...getProps()}></MonitorEditor>
    </View>
  ),
};
