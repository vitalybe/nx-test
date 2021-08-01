import * as React from "react";
import { useState } from "react";
import styled from "styled-components";
import { loggerCreator } from "common/utils/logger";
import { DiffRequestEntity } from "src/workflowStatus/representationDiff/_domain/diffRequestEntity";
import { WorkflowEntity } from "src/workflowStatus/_domain/workflowEntity";
import { RepresentationDiffContainer } from "src/workflowStatus/representationDiff/RepresentationDiffContainer";
import { WduSystemUpdateForm } from "src/workflowStatus/wizardDiffUpdate/wduSystemUpdateForm/WduSystemUpdateForm";
import { WduSummary } from "src/workflowStatus/wizardDiffUpdate/wduSummary/WduSummary";
import { SystemUpdateSchemaType } from "common/components/_projectSpecific/systemUpdatesManagement/_domain/systemUpdateSchema";
import { ConfigurationStyles } from "common/components/configuration/_styles/configurationStyles";
import { Notifier } from "common/utils/notifications/notifier";

const moduleLogger = loggerCreator(__filename);

//region [[ Styles ]]

const WizardDiffUpdateView = styled.div`
  width: 1000px;
  height: 90vh;

  background: ${ConfigurationStyles.COLOR_BACKGROUND};
  box-shadow: ${ConfigurationStyles.SHADOW};
`;

const RepresentationDiffContainerStyled = styled(RepresentationDiffContainer)`
  height: 100%;
  width: 100%;
`;

const WduSystemUpdateFormStyled = styled(WduSystemUpdateForm)`
  display: grid;
  height: 100%;
  width: 100%;
`;

//endregion [[ Styles ]]

//region [[ Props ]]

export interface Props {
  cdnId: string;
  workflow: WorkflowEntity;
  diffMetadata: DiffRequestEntity;

  onClose: (refresh: boolean) => void;

  onStopWorkflow: () => void;
  onContinueWorkflow: () => void;
  onCreateSystemUpdate: (update: SystemUpdateSchemaType) => void;

  className?: string;
}

//endregion [[ Props ]]

type StepType = "diff" | "system-update" | "summary";

interface StepData {
  step: StepType;
  systemUpdateForm: SystemUpdateSchemaType | undefined;
}

export const WizardDiffUpdate = (props: Props) => {
  const [stepData, setStepData] = useState<StepData>({ step: "diff", systemUpdateForm: undefined });

  return (
    <WizardDiffUpdateView className={props.className}>
      {
        {
          diff: (
            <RepresentationDiffContainerStyled
              diffRequest={props.diffMetadata}
              onClose={() => props.onClose(false)}
              workflowEvents={{
                onContinueWorkflow: () => {
                  setStepData({ ...stepData, step: "system-update" });
                },
                onStopWorkflow: async () => {
                  props.onStopWorkflow();
                  props.onClose(true);
                },
              }}
            />
          ),
          "system-update": (
            <WduSystemUpdateFormStyled
              onClose={() => props.onClose(false)}
              onNext={(systemUpdate: SystemUpdateSchemaType | undefined) => {
                setStepData({ step: "summary", systemUpdateForm: systemUpdate });
              }}
            />
          ),
          summary: (
            <WduSummary
              isSystemUpdateCreated={!!stepData.systemUpdateForm}
              onClose={() => props.onClose(false)}
              onFinish={async () => {
                let toContinue = true;
                try {
                  if (stepData.systemUpdateForm) {
                    await props.onCreateSystemUpdate(stepData.systemUpdateForm);
                  }
                } catch (e) {
                  toContinue = false;
                  Notifier.error(`Failed to create System Update - Workflow will not continue`, e);
                }

                if (toContinue) {
                  props.onContinueWorkflow();
                  props.onClose(true);
                }
              }}
            />
          ),
        }[stepData.step]
      }
    </WizardDiffUpdateView>
  );
};
