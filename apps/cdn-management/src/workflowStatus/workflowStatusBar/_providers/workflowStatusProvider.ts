import { loggerCreator } from "@qwilt/common/utils/logger";
import { AjaxMetadata } from "@qwilt/common/utils/ajax";
import { WorkflowEntity } from "../../_domain/workflowEntity";
import { ProvisionFlowsApi } from "@qwilt/common/backend/provisionFlows";
import { WorkflowsProvider } from "../../_providers/workflowsProvider";
import { PrepareQueryResult } from "@qwilt/common/utils/reactQueryUtils/prepareQueryResult";

const moduleLogger = loggerCreator("__filename");

export class WorkflowStatusProvider {
  private constructor() {}

  async stopWorkflow(cdnId: string, workflowId: string) {
    await ProvisionFlowsApi.instance.createActionCancel(cdnId, workflowId);
    this.prepareQuery(cdnId).invalidateWithChildren();
  }

  prepareQuery(cdnId: string): PrepareQueryResult<{ isCdnLocked: boolean; workflows: WorkflowEntity[] }> {
    return new PrepareQueryResult<{ isCdnLocked: boolean; workflows: WorkflowEntity[] }>({
      name: "WorkflowStatusProvider.prepareQuery",
      // NOTE: remove if there are no arguments
      // eslint-disable-next-line prefer-rest-params
      params: [...arguments],
      provide: async () => {
        return await this.provide(cdnId, new AjaxMetadata());
      },
    });
  }

  provide = async (
    cdnId: string,
    metadata: AjaxMetadata,
    provisionFlowsApi: ProvisionFlowsApi = ProvisionFlowsApi.instance
  ): Promise<{ isCdnLocked: boolean; workflows: WorkflowEntity[] }> => {
    const [executionStatus, workflows] = await Promise.all([
      provisionFlowsApi.listExecutionStatus(cdnId, metadata),
      WorkflowsProvider.instance.provide(cdnId, metadata, provisionFlowsApi),
    ]);

    return {
      isCdnLocked: executionStatus.locked,
      workflows: workflows,
    };
  };

  //region [[ Singleton ]]
  private static _instance: WorkflowStatusProvider | undefined;
  static get instance(): WorkflowStatusProvider {
    if (!this._instance) {
      this._instance = new WorkflowStatusProvider();
    }

    return this._instance;
  }
  //endregion
}
