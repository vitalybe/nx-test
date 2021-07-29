import * as React from "react";
import { useState } from "react";
import styled from "styled-components";
import { loggerCreator } from "common/utils/logger";
import { DeliveryServiceEntity } from "src/_domain/deliveryServiceEntity";
import { ItemsCard } from "common/components/configuration/itemsCard/ItemsCard";
import { groupByToCollections } from "common/utils/groupByToCollecitons";
import { DsMetadataEntity } from "src/_domain/dsMetadataEntity";
import { DsMetadataItem } from "src/selectedCdn/tabs/tabDsAssignment/dsList/dsMetadataItem/DsMetadataItem";
import { MetadataServiceTypeEnum } from "common/backend/deliveryServices/_types/deliveryServiceMetadataTypes";

// noinspection JSUnusedLocalSymbols
const moduleLogger = loggerCreator(__filename);

//region [[ Styles ]]

const DeliveryServicesCardStyled = styled(ItemsCard)`
  margin-right: 1em;
  width: 300px;
  height: 100%;
`;

//endregion [[ Styles ]]

//region [[ Props ]]

export interface Props {
  deliveryServices: DeliveryServiceEntity[];
  selectedDsId: string;
  orphanContainingServicesIds: string[];
  assignmentPerDs: Record<string, number>;

  onSelectDs: (dsId: string) => void;

  className?: string;
}

//endregion [[ Props ]]

export const DsList = (props: Props) => {
  const [filter, setFilter] = useState("");

  const filteredDeliveryServices = props.deliveryServices.filter(
    (ds) => ds.name.toLowerCase().includes(filter) || ds.dsMetadata?.name.toLowerCase().includes(filter)
  );

  const unassignedMetadata = new DsMetadataEntity({
    name: "No Metadata",
    contentGroupId: 0,
    contentProvider: undefined,
    id: "no-metadata",
    reportingName: "no-metadata",
    type: MetadataServiceTypeEnum.LIVE,
    missingAgreementLinks: [],
  });

  const dsMetadataItems = groupByToCollections(filteredDeliveryServices, (ds) => ds.dsMetadata ?? unassignedMetadata);

  return (
    <DeliveryServicesCardStyled
      title={"Delivery Service"}
      filter={{ onFilter: (filter) => setFilter(filter), filterValue: filter ?? "" }}>
      {props.deliveryServices.length === 0 && <div>⚠️ No delivery services available</div>}
      {dsMetadataItems.map((dsMetadataGroup) => {
        return (
          <DsMetadataItem
            key={dsMetadataGroup.key.id}
            dsMetadata={dsMetadataGroup.key}
            deliveryServices={dsMetadataGroup.items}
            selectedDsId={props.selectedDsId}
            orphanContainingServicesIds={props.orphanContainingServicesIds}
            assignmentPerDs={props.assignmentPerDs}
            onSelectDs={props.onSelectDs}
          />
        );
      })}
    </DeliveryServicesCardStyled>
  );
};
