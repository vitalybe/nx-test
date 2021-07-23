/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-console */
import * as React from "react";
import styled from "styled-components";
import {
  Props,
  ServiceTypeIconRenderer,
} from "common/components/svg/serviceTypes/serviceTypeIconRenderer/ServiceTypeIconRenderer";
import FixtureDecorator from "common/utils/cosmos/FixtureDecorator";
import { ServiceTypesEnum } from "common/providers/mediaSitePackProvider";
import { CommonColors } from "common/styling/commonColors";

const ServiceTypeIconRendererStyled = styled(ServiceTypeIconRenderer)`
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
    type: ServiceTypesEnum.DOWNLOAD,
  };
}

export default {
  All: (
    <View>
      <ServiceTypeIconRenderer {...getProps()} type={ServiceTypesEnum.DOWNLOAD} />
      <ServiceTypeIconRenderer {...getProps()} type={ServiceTypesEnum.IMAGE} />
      <ServiceTypeIconRenderer {...getProps()} type={ServiceTypesEnum.MUSIC} />
      <ServiceTypeIconRenderer {...getProps()} type={ServiceTypesEnum.VOD} />
      <ServiceTypeIconRenderer {...getProps()} type={ServiceTypesEnum.LIVE} />
      <ServiceTypeIconRenderer {...getProps()} type={ServiceTypesEnum.OTHER} />
    </View>
  ),
  "All - large": (
    <View>
      <ServiceTypeIconRendererStyled {...getProps()} type={ServiceTypesEnum.DOWNLOAD} />
      <ServiceTypeIconRendererStyled {...getProps()} type={ServiceTypesEnum.IMAGE} />
      <ServiceTypeIconRendererStyled {...getProps()} type={ServiceTypesEnum.MUSIC} />
      <ServiceTypeIconRendererStyled {...getProps()} type={ServiceTypesEnum.VOD} />
      <ServiceTypeIconRendererStyled {...getProps()} type={ServiceTypesEnum.LIVE} />
      <ServiceTypeIconRendererStyled {...getProps()} type={ServiceTypesEnum.OTHER} />
    </View>
  ),
  "custom color": (
    <View>
      <ServiceTypeIconRendererStyled {...getProps()} color={CommonColors.GEYSER} innerColor={"#484848"} />
    </View>
  ),
};
