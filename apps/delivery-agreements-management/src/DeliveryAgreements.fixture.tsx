import * as React from "react";

import styled from "styled-components";
import { DeliveryAgreements, Props } from "./DeliveryAgreements";
import FixtureDecorator from "@qwilt/common/utils/cosmos/FixtureDecorator";

const View = styled(FixtureDecorator)`
  margin: 1em;
  padding: 1em;
  position: absolute;
  width: 1400px;
  height: 700px;
  border: 3px dashed lightgrey;
`;

const DeliveryAgreementsStyled = styled(DeliveryAgreements)`
  width: 100%;
  height: 100%;
`;

function getProps(): Props {
  return {};
}

export default {
  "-Regular": (
    <View>
      <DeliveryAgreementsStyled {...getProps()} />
    </View>
  ),
};
