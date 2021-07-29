import * as React from "react";
import { useMemo } from "react";
import styled from "styled-components";
import { loggerCreator } from "@qwilt/common/utils/logger";
import { observer } from "mobx-react-lite";
import { DeliveryServiceEntity } from "../../../_domain/deliveryServiceEntity";
import { CardDsAssignment } from "./cardDsAssignment/CardDsAssignment";
import { ProjectUrlStore } from "../../../_stores/projectUrlStore";
import { DsRuleEntity } from "./_domain/dsRuleEntity";
import { ProjectUrlParams } from "../../../_stores/projectUrlParams";
import { ProviderDataContainer } from "@qwilt/common/components/providerDataContainer/ProviderDataContainer";
import { useProvider } from "@qwilt/common/components/providerDataContainer/_providers/useProvider";
import { DsList } from "./dsList/DsList";
import { CdnEntity } from "../../../_domain/cdnEntity";

const moduleLogger = loggerCreator("__filename");

//region [[ Styles ]]

const TabDsAssignmentView = styled(ProviderDataContainer)`
  display: flex;
  flex: 1;
  min-height: 0;
`;

const CardDsAssignmentContainer = styled(ProviderDataContainer)`
  width: 100%;
  height: 100%;
  min-height: 0;
`;

const CardDsAssignmentStyled = styled(CardDsAssignment)`
  width: 500px;
`;

//endregion

//region [[ Props ]]
export interface Props {
  selectedCdn: CdnEntity;
  orphanContainingServicesIds: string[];
  deliveryServices: DeliveryServiceEntity[];
  allDsAssignments?: Map<string, DsRuleEntity[]>;
  assignmentPerDs: { [key: string]: number };
  reloadFn?: () => {};
  className?: string;
}
//endregion

//region [[ Functions ]]

//endregion

export const TabDsAssignment = observer(({ ...props }: Props) => {
  const selectedDsParam = ProjectUrlStore.getInstance().getParam(ProjectUrlParams.selectedDs);
  const selectedDs = useMemo<DeliveryServiceEntity>(() => {
    const urlDs =
      selectedDsParam !== undefined ? props.deliveryServices.find((ds) => ds?.id === selectedDsParam) : undefined;
    return urlDs ?? props.deliveryServices[0];
  }, [props.deliveryServices, selectedDsParam]);

  const onSelectDs = (dsId: string) => {
    ProjectUrlStore.getInstance().setParam(ProjectUrlParams.selectedDs, dsId);
  };

  const { metadata } = useProvider((metadata) => selectedDs.updateRevisions(metadata), true, [selectedDs]);

  const selectedDsAssignments = useMemo(() => {
    return props.allDsAssignments && selectedDs && props.allDsAssignments.get(selectedDs.id);
  }, [props.allDsAssignments, selectedDs]);

  return (
    <TabDsAssignmentView className={props.className}>
      <DsList
        deliveryServices={props.deliveryServices}
        selectedDsId={selectedDs?.id ?? ""}
        orphanContainingServicesIds={props.orphanContainingServicesIds}
        assignmentPerDs={props.assignmentPerDs}
        onSelectDs={onSelectDs}
      />
      <CardDsAssignmentContainer providerMetadata={metadata}>
        {!metadata.isLoading && (
          <CardDsAssignmentStyled
            deliveryService={selectedDs}
            dsName={selectedDs?.name ?? ""}
            rules={selectedDsAssignments ?? []}
          />
        )}
      </CardDsAssignmentContainer>
    </TabDsAssignmentView>
  );
});
