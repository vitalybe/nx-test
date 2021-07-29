import * as React from "react";

import styled from "styled-components";
import { CardDsAssignment, Props } from "./CardDsAssignment";

import { DeliveryServiceEntity } from "../../../../_domain/deliveryServiceEntity";
import { DsRuleEntity } from "../_domain/dsRuleEntity";
import { MissingAgreementLinkEntity } from "../../../../_domain/missingAgreementLinkEntity";
import { SelectedCdnFixtureDecorator } from "../../_utils/SelectedCdnFixtureDecorator";

const View = styled(SelectedCdnFixtureDecorator)`
  margin: 1em;
  padding: 1em;
  position: absolute;
  border: 3px dashed lightgrey;
  height: 80vh;
  width: 80vw;
`;

const CardDsAssignmentStyled = styled(CardDsAssignment)`
  height: 100%;
`;

function getProps(propsOverrides?: Partial<Props>): Props {
  const deliveryService = new DeliveryServiceEntity({
    id: "5dc81825791b35000113d234",
    name: "Vitaly-test",
    description: "a2",
    isActive: false,
    revisions: [{ id: "mockId", labels: ["Test Label"], creationTimeFormatted: "10-10-2019" }],
    updatedRevisionsCreationTime: true,
    missingAgreementLinks: [],
  });

  const dsRuleEntity = DsRuleEntity.createMock();
  dsRuleEntity.missingAgreementLink = MissingAgreementLinkEntity.createMock();

  return {
    deliveryService: deliveryService,
    rules: [dsRuleEntity],
    dsName: "AwesomeDS",
    ...propsOverrides,
  };
}

export default {
  "-Regular": (
    <View>
      <CardDsAssignmentStyled {...getProps()} />
    </View>
  ),
};
