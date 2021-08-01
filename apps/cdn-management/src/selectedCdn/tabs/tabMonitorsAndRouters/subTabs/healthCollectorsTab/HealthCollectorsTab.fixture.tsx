/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-console */
import * as React from "react";
import styled from "styled-components";
import {
  HealthCollectorsTab,
  Props,
} from "./HealthCollectorsTab";
import { HealthCollectorEntity } from "./_domain/healthCollectorEntity";
import { SelectedCdnFixtureDecorator } from "../../../_utils/SelectedCdnFixtureDecorator";

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
    cdnName: "1234",
    entities: [
      HealthCollectorEntity.createMock(),
      HealthCollectorEntity.createMock(),
      HealthCollectorEntity.createMock(),
    ],
  };
}

export default {
  regular: (
    <View>
      <HealthCollectorsTab {...getProps()}></HealthCollectorsTab>
    </View>
  ),
};
