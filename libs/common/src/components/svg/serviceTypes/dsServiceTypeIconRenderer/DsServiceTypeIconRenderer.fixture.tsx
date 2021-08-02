/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-console */
import * as React from "react";
import styled from "styled-components";
import {
  DsServiceTypeIconRenderer,
  Props,
} from "common/components/svg/serviceTypes/dsServiceTypeIconRenderer/DsServiceTypeIconRenderer";
import FixtureDecorator from "common/utils/cosmos/FixtureDecorator";
import { CommonColors } from "common/styling/commonColors";
import { MetadataServiceTypeEnum } from "../../../../backend/deliveryServices/_types/deliveryServiceMetadataTypes";

const DsServiceTypeIconRendererStyled = styled(DsServiceTypeIconRenderer)`
  width: 3rem;
  height: 3rem;
`;
const View = styled(FixtureDecorator)`
  margin: 1em;
  padding: 1em;
  position: relative;
  border: 3px dashed lightgrey;

  width: 1000px;
  height: 500px;

  display: flex;
  grid-gap: 1rem;
`;

function getProps(): Props {
  return {
    type: MetadataServiceTypeEnum.SOFTWARE_DOWNLOAD,
  };
}

export default {
  All: (
    <View>
      <DsServiceTypeIconRenderer {...getProps()} type={MetadataServiceTypeEnum.SOFTWARE_DOWNLOAD} />
      <DsServiceTypeIconRenderer {...getProps()} type={MetadataServiceTypeEnum.MUSIC} />
      <DsServiceTypeIconRenderer {...getProps()} type={MetadataServiceTypeEnum.VOD} />
      <DsServiceTypeIconRenderer {...getProps()} type={MetadataServiceTypeEnum.LIVE} />
    </View>
  ),
  "All - large": (
    <View>
      <DsServiceTypeIconRendererStyled {...getProps()} type={MetadataServiceTypeEnum.SOFTWARE_DOWNLOAD} />
      <DsServiceTypeIconRendererStyled {...getProps()} type={MetadataServiceTypeEnum.MUSIC} />
      <DsServiceTypeIconRendererStyled {...getProps()} type={MetadataServiceTypeEnum.VOD} />
      <DsServiceTypeIconRendererStyled {...getProps()} type={MetadataServiceTypeEnum.LIVE} />
    </View>
  ),
  "custom color": (
    <View>
      <DsServiceTypeIconRendererStyled {...getProps()} color={CommonColors.GEYSER} innerColor={"#484848"} />
    </View>
  ),
};
