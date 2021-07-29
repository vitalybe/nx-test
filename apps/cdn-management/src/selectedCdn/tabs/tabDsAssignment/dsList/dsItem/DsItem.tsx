import * as React from "react";
import { loggerCreator } from "common/utils/logger";
import { ItemWithActions } from "common/components/configuration/itemWithActions/ItemWithActions";
import { DeliveryServiceIcon } from "common/components/_projectSpecific/management/deliveryServiceIcon/DeliveryServiceIcon";
import { DeliveryServiceEntity } from "src/_domain/deliveryServiceEntity";
import { MissingAgreemenentError } from "src/selectedCdn/tabs/tabDsAssignment/_parts/missingAgreemenentError/MissingAgreemenentError";
import { ErrorWithTooltip } from "src/selectedCdn/tabs/tabDsAssignment/_parts/errorWithTooltip/ErrorWithTooltip";

// noinspection JSUnusedLocalSymbols
const moduleLogger = loggerCreator(__filename);

//region [[ Props ]]

export interface Props {
  deliveryService: DeliveryServiceEntity;
  selectedDsId: string;
  orphanContainingServicesIds: string[];
  assignmentPerDs: Record<string, number>;

  onSelectDs: (dsId: string) => void;

  className?: string;
}

//endregion [[ Props ]]

export const DsItem = (props: Props) => {
  const deliveryService = props.deliveryService;

  const assignmentsCount = props.assignmentPerDs[deliveryService.id];

  const assignmentStatus =
    assignmentsCount !== undefined ? `${assignmentsCount} assignment${assignmentsCount === 1 ? "" : "s"}` : "";

  const errors = [];
  const isOrphan = props.orphanContainingServicesIds.includes(deliveryService.id);
  if (isOrphan) {
    errors.push(<div>Orphan assignment indicated</div>);
  }

  const missingAgreementLinks = props.deliveryService.missingAgreementLinks;
  if (missingAgreementLinks?.length) {
    errors.push(
      missingAgreementLinks.map((missingAgreementLink) => (
        <MissingAgreemenentError key={missingAgreementLink.networkId} missingAgreementLink={missingAgreementLink} />
      ))
    );
  }

  return (
    <ItemWithActions
      className={props.className}
      key={deliveryService.id}
      title={deliveryService.name}
      subtitle={assignmentStatus}
      icon={<DeliveryServiceIcon isActive={deliveryService.isActive} />}
      isSelected={props.selectedDsId === deliveryService.id}
      isSelectable={true}
      onClick={() => props.onSelectDs(deliveryService.id)}
      childrenBeforeButtons={<ErrorWithTooltip errorsContent={errors} />}
    />
  );
};
