import * as React from "react";
import styled from "styled-components";
import { loggerCreator } from "@qwilt/common/utils/logger";
import { useProvider } from "@qwilt/common/components/providerDataContainer/_providers/useProvider";
import { ContextDiffSegmentsProvider } from "./_providers/contextDiffSegmentsProvider";
import { WorkflowEntity } from "../_domain/workflowEntity";
import { ProviderDataContainer } from "@qwilt/common/components/providerDataContainer/ProviderDataContainer";
import { Button } from "@qwilt/common/components/configuration/button/Button";
import { ContextDiff } from "./ContextDiff";
import { CdnEntity } from "../../_domain/cdnEntity";

const moduleLogger = loggerCreator("__filename");

//region [[ Styles ]]

const ContextDiffContainerView = styled.div`
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
  cdn: CdnEntity;
  left: WorkflowEntity | undefined;
  right: WorkflowEntity;
  isReviewEnabled: boolean;

  onClose: (toRefresh: boolean) => void;
  workflowControlEvents:
    | undefined
    | {
        onStopWorkflow: () => void;
        onContinueWorkflow: (segmentIds: string[]) => void;
      };

  className?: string;
}

//endregion [[ Props ]]

export const ContextDiffContainer = (props: Props) => {
  const { data, metadata } = useProvider(
    (metadata) => ContextDiffSegmentsProvider.instance.provide(props.cdn.id, props.left, props.right, metadata),
    false,
    []
  );

  return (
    <ContextDiffContainerView className={props.className}>
      {!metadata.isError && (
        <ProviderDataContainerStyled providerMetadata={metadata}>
          {data && (
            <ContextDiff
              cdnName={props.cdn.name}
              right={data.right}
              left={data.left}
              segments={data.segments}
              isReviewEnabled={props.isReviewEnabled}
              workflowControlEvents={props.workflowControlEvents}
              onClose={() => props.onClose(true)}
            />
          )}
        </ProviderDataContainerStyled>
      )}
      {metadata.isError ? <CloseButton onClick={() => props.onClose(false)}>Close</CloseButton> : undefined}
    </ContextDiffContainerView>
  );
};
