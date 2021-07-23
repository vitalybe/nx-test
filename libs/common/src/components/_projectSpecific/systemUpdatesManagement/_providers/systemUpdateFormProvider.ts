import { loggerCreator } from "common/utils/logger";
import { AjaxMetadata } from "common/utils/ajax";
import { SystemUpdateFormEntity } from "common/components/_projectSpecific/systemUpdatesManagement/_domain/systemUpdateFormEntity";
import { DeliveryServicesApi } from "common/backend/deliveryServices";
import { DeliveryServicesApiType } from "common/backend/deliveryServices/_types/deliveryServicesTypes";
import { Notifier } from "common/utils/notifications/notifier";
import { NameWithId } from "common/domain/nameWithId";
import { DeploymentEntitiesProvider } from "common/providers/deploymentEntitiesProvider";

const moduleLogger = loggerCreator(__filename);

export class SystemUpdateFormProvider {
  private constructor() {}

  private async maybeDeliveryServices(metadata: AjaxMetadata): Promise<DeliveryServicesApiType[]> {
    try {
      return await DeliveryServicesApi.instance.listDeliveryServices(metadata, false);
    } catch (e) {
      Notifier.error("Failed to get Delivery Services information");
      return [];
    }
  }

  provide = async (metadata: AjaxMetadata): Promise<SystemUpdateFormEntity> => {
    const [networkHierarchy, deliveryServicesResult] = await Promise.all([
      DeploymentEntitiesProvider.instance.provideNetworkHierarchy(metadata, false, true),
      this.maybeDeliveryServices(metadata),
    ]);

    return new SystemUpdateFormEntity({
      networksHierarchy: networkHierarchy,
      deliveryServices: deliveryServicesResult.map((ds) => new NameWithId({ name: ds.name, id: ds.dsId })),
    });
  };

  //region [[ Singleton ]]
  private static _instance: SystemUpdateFormProvider | undefined;
  static get instance(): SystemUpdateFormProvider {
    if (!this._instance) {
      this._instance = new SystemUpdateFormProvider();
    }

    return this._instance;
  }
  //endregion
}
