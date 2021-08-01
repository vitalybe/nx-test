import { loggerCreator } from "common/utils/logger";
import { StepEntity } from "src/workflowStatus/_domain/stepEntity";
import { WorkflowStore, WorkflowStoreContextProvider } from "src/workflowStatus/_stores/workflowStore";
import { DiffRequestEntity } from "src/workflowStatus/representationDiff/_domain/diffRequestEntity";
import { ProvisionFlowsStepsEnum } from "common/backend/provisionFlows";
import { openQwiltModal } from "common/components/qwiltModal/QwiltModal";
import { ContextDiffContainer } from "src/workflowStatus/contextDiff/ContextDiffContainer";
import { RepresentationDiffContainer } from "src/workflowStatus/representationDiff/RepresentationDiffContainer";
import * as React from "react";
import { WorkflowsProvider } from "src/workflowStatus/_providers/workflowsProvider";
import { AjaxMetadata } from "common/utils/ajax";
import {
  DiffRequestSerializable,
  WorkflowOpenDialogUrlParam,
} from "src/workflowStatus/_util/workflowOpenDialogUrlParam";

const moduleLogger = loggerCreator(__filename);

export class DiffOpenUtil {
  static async openDiffFromUrlParam(store: WorkflowStore, param: DiffRequestSerializable) {
    const workflows = await WorkflowsProvider.instance.provide(store.cdn.id, new AjaxMetadata());

    const leftWorkflow = workflows.find((workflow) => workflow.id === param.leftWorkflowId);
    const rightWorkflow = workflows.find((workflow) => workflow.id === param.rightWorkflowId);
    if (rightWorkflow) {
      const step = rightWorkflow?.steps.find((workflowStep) => workflowStep.stepId === param.stepId);

      if (step) {
        const diffRequest = new DiffRequestEntity({
          cdnId: store.cdn.id,
          stepId: step.stepId,
          rightWorkflow: rightWorkflow,
          leftWorkflow: leftWorkflow,
        });

        this.openDiff(step, store, diffRequest);
      }
    }
  }

  static openDiff(step: StepEntity, store: WorkflowStore, diffRequest: DiffRequestEntity) {
    if (step.stepId === ProvisionFlowsStepsEnum.SNAPSHOT_REPRESENTATION) {
      this.openRepresentationDiff(store, diffRequest);
    } else if (step.stepId === ProvisionFlowsStepsEnum.SNAPSHOT_PREVIEW) {
      this.openPreviewDiff(store, diffRequest);
    }
  }

  private static openPreviewDiff(store: WorkflowStore, diffRequest: DiffRequestEntity) {
    const cdn = store.cdn;
    if (!cdn) {
      throw new Error(`CDN with not selected`);
    }

    WorkflowOpenDialogUrlParam.setOpenDiff(diffRequest);
    // noinspection JSIgnoredPromiseFromCall
    openQwiltModal((closeModalWithResult) => (
      <WorkflowStoreContextProvider store={store}>
        <ContextDiffContainer
          left={diffRequest.leftWorkflow}
          right={diffRequest.rightWorkflow}
          cdn={cdn}
          isReviewEnabled={false}
          workflowControlEvents={undefined}
          onClose={() => {
            WorkflowOpenDialogUrlParam.clear();
            closeModalWithResult();
          }}
        />
      </WorkflowStoreContextProvider>
    ));
  }

  private static openRepresentationDiff(store: WorkflowStore, diffRequest: DiffRequestEntity) {
    WorkflowOpenDialogUrlParam.setOpenDiff(diffRequest);
    // noinspection JSIgnoredPromiseFromCall
    openQwiltModal((closeModalWithResult) => (
      <WorkflowStoreContextProvider store={store}>
        <RepresentationDiffContainer
          workflowEvents={undefined}
          diffRequest={diffRequest}
          onClose={() => {
            WorkflowOpenDialogUrlParam.clear();
            closeModalWithResult();
          }}
        />
      </WorkflowStoreContextProvider>
    ));
  }

  private constructor() {}
}
