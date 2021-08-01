import * as _ from "lodash";
import { loggerCreator } from "@qwilt/common/utils/logger";
import { AjaxMetadata } from "@qwilt/common/utils/ajax";
import { StepMetadataEntity } from "../_domain/stepMetadataEntity";
import { ProvisionFlowsApi } from "@qwilt/common/backend/provisionFlows";

const moduleLogger = loggerCreator("__filename");

export class StepMetadataProvider {
  private constructor() {}

  provide = async (cdnId: string, metadata: AjaxMetadata): Promise<StepMetadataEntity[]> => {
    const stepsResult = await ProvisionFlowsApi.instance.listOperationalSteps(cdnId, metadata);
    return stepsResult.operationalSteps.map(
      (operationalStep) =>
        new StepMetadataEntity({
          id: operationalStep,
          name: operationalStep === "snapshotRepresentation" ? "Representation" : _.capitalize(operationalStep),
        })
    );
  };

  //region [[ Singleton ]]
  private static _instance: StepMetadataProvider | undefined;
  static get instance(): StepMetadataProvider {
    if (!this._instance) {
      this._instance = new StepMetadataProvider();
    }

    return this._instance;
  }
  //endregion
}
