import * as React from "react";
import { useState } from "react";
import styled from "styled-components";
import { loggerCreator } from "common/utils/logger";
import { DsMetadataEntity } from "src/_domain/dsMetadataEntity";
import { DeliveryServiceEntity } from "src/_domain/deliveryServiceEntity";
import { ItemWithActions } from "common/components/configuration/itemWithActions/ItemWithActions";
import { faMinusSquare, faPlusSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CommonColors } from "common/styling/commonColors";
import { DsItem } from "src/selectedCdn/tabs/tabDsAssignment/dsList/dsItem/DsItem";
import { ErrorWithTooltip } from "src/selectedCdn/tabs/tabDsAssignment/_parts/errorWithTooltip/ErrorWithTooltip";
import { MissingAgreemenentError } from "src/selectedCdn/tabs/tabDsAssignment/_parts/missingAgreemenentError/MissingAgreemenentError";

// noinspection JSUnusedLocalSymbols
const moduleLogger = loggerCreator(__filename);

//region [[ Styles ]]

const DsMetadataItemView = styled.div``;

const ItemWithActionsStyled = styled(ItemWithActions)<{ isChild?: boolean; isDisabled?: boolean }>`
  margin-left: ${(props) => (props.isChild ? "1em" : 0)};
  outline: none;
  cursor: ${(props) => (props.isDisabled ? "default" : "pointer")};
  margin-top: 6px;
  padding-top: 12px;

  transition-duration: 0.3s;
`;

const ChildItems = styled.div`
  padding-left: 1rem;
`;

const FontAwesomeIconStyled = styled(FontAwesomeIcon)`
  margin-right: 0.6em;
`;

//endregion [[ Styles ]]

//region [[ Props ]]

export interface Props {
  dsMetadata: DsMetadataEntity;
  deliveryServices: DeliveryServiceEntity[];

  selectedDsId: string;
  orphanContainingServicesIds: string[];
  assignmentPerDs: Record<string, number>;

  onSelectDs: (dsId: string) => void;

  className?: string;
}

//endregion [[ Props ]]

export const DsMetadataItem = (props: Props) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  const isChildItemSelected = !!props.deliveryServices.find((ds) => ds.id === props.selectedDsId);
  const isEmptyDs = props.deliveryServices.length === 0;

  const onMetadataItemClick = () => {
    if (!(isChildItemSelected || isEmptyDs)) {
      setIsExpanded((currentValue) => !currentValue);
    }
  };

  return (
    <DsMetadataItemView className={props.className}>
      <ItemWithActionsStyled
        isDisabled={isChildItemSelected || isEmptyDs}
        title={props.dsMetadata.name}
        titleAddition={`(${props.deliveryServices.length} items)`}
        onClick={onMetadataItemClick}
        icon={
          <FontAwesomeIconStyled
            icon={isEmptyDs ? faPlusSquare : isExpanded ? faMinusSquare : faPlusSquare}
            color={isChildItemSelected || isEmptyDs ? CommonColors.SILVER_SAND : "black"}
          />
        }
        childrenBeforeButtons={
          <ErrorWithTooltip
            errorsContent={
              props.dsMetadata?.missingAgreementLinks.map((missingAgreementLink) => (
                <MissingAgreemenentError
                  key={missingAgreementLink.networkId}
                  missingAgreementLink={missingAgreementLink}
                />
              )) ?? []
            }
          />
        }
      />
      {isExpanded ? (
        <ChildItems>
          {props.deliveryServices.map((ds) => (
            <DsItem
              key={ds.id}
              deliveryService={ds}
              selectedDsId={props.selectedDsId}
              orphanContainingServicesIds={props.orphanContainingServicesIds}
              assignmentPerDs={props.assignmentPerDs}
              onSelectDs={props.onSelectDs}
            />
          ))}
        </ChildItems>
      ) : null}
    </DsMetadataItemView>
  );
};
