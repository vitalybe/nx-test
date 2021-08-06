/* eslint-disable react-hooks/rules-of-hooks */
import * as React from "react";
import styled from "styled-components";
import {
  Props,
  SystemUpdatesForm,
} from "./SystemUpdatesForm";
import FixtureDecorator from "../../../../utils/cosmos/FixtureDecorator";
import { SystemUpdateFormEntity } from "../_domain/systemUpdateFormEntity";

const View = styled(FixtureDecorator)`
  margin: 1em;
  padding: 1em;
  position: relative;
  border: 3px dashed lightgrey;

  width: 1000px;
  height: 800px;
`;

function getProps(): Props {
  return {
    isShowDsDropdown: true,
    formAdditionalData: SystemUpdateFormEntity.createMock(),
    overrideButtons: [],
    existingSystemUpdate: undefined,
    affectedQnDeploymentIds: [],
  };
}

export default {
  regular: (
    <View>
      <SystemUpdatesForm {...getProps()}></SystemUpdatesForm>
    </View>
  ),
  "no-ds": (
    <View>
      <SystemUpdatesForm {...getProps()} isShowDsDropdown={false}></SystemUpdatesForm>
    </View>
  ),
};
