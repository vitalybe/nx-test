/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-console */
import * as React from "react";
import styled from "styled-components";
import { Props, ServiceTypesToggle } from "./ServiceTypesToggle";
import FixtureDecorator from "common/utils/cosmos/FixtureDecorator";
import { MetadataServiceTypeEnum } from "../../../../../backend/deliveryServices/_types/deliveryServiceMetadataTypes";

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
    selectedTypes: [MetadataServiceTypeEnum.SOFTWARE_DOWNLOAD, MetadataServiceTypeEnum.LIVE],
  };
}

export default {
  regular: (
    <View>
      <ServiceTypesToggle {...getProps()} />
    </View>
  ),
};
