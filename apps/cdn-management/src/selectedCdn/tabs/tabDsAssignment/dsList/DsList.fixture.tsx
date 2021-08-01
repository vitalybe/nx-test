/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-console */
import * as React from "react";
import styled from "styled-components";
import { DsList } from "./DsList";
import { DeliveryServiceEntity } from "../../../../_domain/deliveryServiceEntity";
import { DsMetadataEntity } from "../../../../_domain/dsMetadataEntity";
import { MissingAgreementLinkEntity } from "../../../../_domain/missingAgreementLinkEntity";
import { SelectedCdnFixtureDecorator } from "../../_utils/SelectedCdnFixtureDecorator";

const View = styled(SelectedCdnFixtureDecorator)`
  margin: 5em;
  padding: 1em;
  position: relative;
  border: 3px dashed lightgrey;

  width: 1000px;
  height: 500px;
`;

function getCommonProps() {
  return {
    assignmentPerDs: {},
    onSelectDs: () => {},
    orphanContainingServicesIds: [],
  };
}

export default {
  "no metadata": () => {
    const deliveryServices = [
      DeliveryServiceEntity.createMock(),
      DeliveryServiceEntity.createMock(),
      DeliveryServiceEntity.createMock(),
      DeliveryServiceEntity.createMock(),
    ];

    const props = {
      deliveryServices: deliveryServices,
      selectedDsId: deliveryServices[0].id,
    };

    return (
      <View>
        <DsList {...getCommonProps()} {...props}></DsList>
      </View>
    );
  },
  "with metadata": () => {
    const dsMetadata1 = DsMetadataEntity.createMock();
    const dsMetadata2 = DsMetadataEntity.createMock();
    const deliveryServices = [
      DeliveryServiceEntity.createMock({ dsMetadata: dsMetadata1 }),
      DeliveryServiceEntity.createMock({ dsMetadata: dsMetadata1 }),
      DeliveryServiceEntity.createMock({ dsMetadata: dsMetadata2 }),
      DeliveryServiceEntity.createMock({ dsMetadata: dsMetadata2 }),
      DeliveryServiceEntity.createMock({ dsMetadata: undefined }),
      DeliveryServiceEntity.createMock({ dsMetadata: undefined }),
    ];

    const props = {
      deliveryServices: deliveryServices,
      selectedDsId: deliveryServices[3].id,
    };

    return (
      <View>
        <DsList {...getCommonProps()} {...props} />
      </View>
    );
  },
  "with errors": () => {
    const dsMetadata1 = DsMetadataEntity.createMock();
    const dsMetadata2 = DsMetadataEntity.createMock({
      missingAgreementLinks: [MissingAgreementLinkEntity.createMock()],
    });
    const deliveryServices = [
      DeliveryServiceEntity.createMock({ dsMetadata: dsMetadata1 }),
      DeliveryServiceEntity.createMock({ dsMetadata: dsMetadata1 }),
      DeliveryServiceEntity.createMock({ dsMetadata: dsMetadata2 }),
      DeliveryServiceEntity.createMock({ dsMetadata: dsMetadata2 }),
      DeliveryServiceEntity.createMock({ dsMetadata: undefined }),
      DeliveryServiceEntity.createMock({ dsMetadata: undefined }),
    ];

    const props = {
      deliveryServices: deliveryServices,
      selectedDsId: deliveryServices[3].id,
      orphanContainingServicesIds: [deliveryServices[0].id, deliveryServices[1].id],
    };

    return (
      <View>
        <DsList {...getCommonProps()} {...props} />
      </View>
    );
  },
};
