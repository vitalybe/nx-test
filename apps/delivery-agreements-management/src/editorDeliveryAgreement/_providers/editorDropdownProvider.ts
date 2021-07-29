import { loggerCreator } from "@qwilt/common/utils/logger";
import { AjaxMetadata } from "@qwilt/common/utils/ajax";
import { DeploymentEntitiesProvider } from "@qwilt/common/providers/deploymentEntitiesProvider";
import { DeploymentEntity } from "@qwilt/common/domain/qwiltDeployment/deploymentEntity";

const moduleLogger = loggerCreator("__filename");

export class EditorDropdownProvider {
  private constructor() {}

  provide = async (metadata: AjaxMetadata): Promise<DeploymentEntity[]> => {
    return await DeploymentEntitiesProvider.instance.provideNetworks(metadata);
  };

  //region [[ Singleton ]]
  private static _instance: EditorDropdownProvider | undefined;
  static get instance(): EditorDropdownProvider {
    if (!this._instance) {
      this._instance = new EditorDropdownProvider();
    }

    return this._instance;
  }
  //endregion
}
