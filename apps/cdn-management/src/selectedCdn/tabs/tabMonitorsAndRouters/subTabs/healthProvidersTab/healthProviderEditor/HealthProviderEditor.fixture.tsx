/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-console */
import * as React from "react";
import styled from "styled-components";
import FixtureDecorator from "@qwilt/common/utils/cosmos/FixtureDecorator";
import {
  HealthProviderEditor,
  Props,
} from "./HealthProviderEditor";
import { HealthProviderEntity } from "../_domain/healthProviderEntity";

const View = styled(FixtureDecorator)`
  margin: 1em;
  padding: 1em;
  position: relative;
  border: 3px dashed lightgrey;

  width: 1000px;
  height: 500px;
`;

function getProps(): Props {
  return {
    editedItem: HealthProviderEntity.createMock(),
    cdnName: "CDN Name",
    onClose: () => {},
  };
}

export default {
  regular: (
    <View>
      <HealthProviderEditor {...getProps()}></HealthProviderEditor>
    </View>
  ),
};
