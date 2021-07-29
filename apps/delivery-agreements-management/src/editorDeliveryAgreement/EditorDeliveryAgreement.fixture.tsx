import * as React from "react";

import styled from "styled-components";
import { EditorDeliveryAgreement, Props } from "src/editorDeliveryAgreement/EditorDeliveryAgreement";
import { DeliveryAgreementsGroupEntity } from "src/_domain/deliveryAgreementsGroupEntity";

import FixtureDecorator from "common/utils/cosmos/FixtureDecorator";

const View = styled(FixtureDecorator)`
  margin: 1em;
  padding: 1em;
  position: absolute;
  border: 3px dashed lightgrey;
`;

const EditorDeliveryAgreementStyled = styled(EditorDeliveryAgreement)`
  width: 500px;
  height: 100%;
`;

function getProps(propsOverrides?: Partial<Props>): Props {
  return {
    preselectedNetworkId: undefined,
    entity: DeliveryAgreementsGroupEntity.createMock(),
    onModalClose: () => {},
    ...propsOverrides,
  };
}

export default {
  "-Regular": (
    <View>
      <EditorDeliveryAgreementStyled {...getProps()} />
    </View>
  ),
};
