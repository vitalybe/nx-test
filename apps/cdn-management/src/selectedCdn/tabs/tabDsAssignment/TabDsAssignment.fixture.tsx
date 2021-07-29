import * as React from "react";

import styled from "styled-components";
import { Props, TabDsAssignment } from "./TabDsAssignment";

import { DeliveryServiceEntity } from "../../../_domain/deliveryServiceEntity";
import _ from "lodash";
import { SelectedCdnFixtureDecorator } from "../_utils/SelectedCdnFixtureDecorator";
import { CdnEntity } from "../../../_domain/cdnEntity";

const View = styled(SelectedCdnFixtureDecorator)`
  margin: 1em;
  padding: 1em;
  position: absolute;
  border: 3px dashed lightgrey;
  width: 80vw;
  height: 80vh;
  display: flex;
`;

function getProps(propsOverrides?: Partial<Props>): Props {
  const selectedCdn = CdnEntity.createMock();

  return {
    assignmentPerDs: {},
    selectedCdn,
    orphanContainingServicesIds: [],
    deliveryServices: _.range(5).map(() => DeliveryServiceEntity.createMock()),
    ...propsOverrides,
  };
}

export default {
  "-Regular": (
    <View>
      <TabDsAssignment {...getProps()} />
    </View>
  ),
};
