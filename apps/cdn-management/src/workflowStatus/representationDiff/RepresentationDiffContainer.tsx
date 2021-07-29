import * as React from "react";
import styled from "styled-components";
import { loggerCreator } from "common/utils/logger";
import { useProvider } from "common/components/providerDataContainer/_providers/useProvider";
import { DiffRequestEntity } from "src/workflowStatus/representationDiff/_domain/diffRequestEntity";
import { DiffWorkflowsProvider } from "src/workflowStatus/representationDiff/_providers/diffWorkflowsProvider";
import { ProviderDataContainer } from "common/components/providerDataContainer/ProviderDataContainer";
import { RepresentationDiff } from "src/workflowStatus/representationDiff/RepresentationDiff";
import { Button } from "common/components/configuration/button/Button";

const moduleLogger = loggerCreator(__filename);

//region [[ Styles ]]

const RepresentationDiffContainerView = styled.div`
  width: 70vw;
  height: 90vh;
  min-height: 500px;
  min-width: 800px;
  display: flex;
  flex-direction: column;
`;

const ProviderDataContainerStyled = styled(ProviderDataContainer)`
  flex: 1;
  min-height: 100px;
  display: grid;
`;

const CloseButton = styled(Button)`
  width: 150px;
  margin-left: 1rem;
`;

//endregion [[ Styles ]]

//region [[ Props ]]

export interface Props {
  diffRequest: DiffRequestEntity;

  onClose: () => void;
  workflowEvents:
    | undefined
    | {
        onContinueWorkflow: () => void;
        onStopWorkflow: () => void;
      };

  className?: string;
}

//endregion [[ Props ]]

export const RepresentationDiffContainer = (props: Props) => {
  const { data, metadata } = useProvider(
    (metadata) => DiffWorkflowsProvider.instance.provide(props.diffRequest, metadata),
    false,
    []
  );

  return (
    <RepresentationDiffContainerView className={props.className}>
      <ProviderDataContainerStyled providerMetadata={metadata}>
        {data && (
          <RepresentationDiff
            diffMetadata={data}
            onClose={props.onClose}
            workflowControlEvents={props.workflowEvents}
          />
        )}
      </ProviderDataContainerStyled>
      {metadata.isError ? <CloseButton onClick={props.onClose}>Close</CloseButton> : undefined}
    </RepresentationDiffContainerView>
  );
};
