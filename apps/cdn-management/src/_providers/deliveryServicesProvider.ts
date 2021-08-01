import { DeliveryServiceEntity, Revision } from "src/_domain/deliveryServiceEntity";
import { DeliveryServicesApi } from "common/backend/deliveryServices";
import { AjaxMetadata } from "common/utils/ajax";
import { DeliveryServiceMetadataProvider } from "src/_providers/deliveryServiceMetadataProvider";
import { DsMetadataEntity } from "src/_domain/dsMetadataEntity";
import { PrepareQueryResult } from "common/utils/reactQueryUtils/prepareQueryResult";

export class DeliveryServicesProvider {
  prepareQuery(): PrepareQueryResult<DeliveryServiceEntity[]> {
    return new PrepareQueryResult<DeliveryServiceEntity[]>({
      name: "DeliveryServicesProvider.prepareQuery",
      provide: async () => {
        return await this.provide();
      },
    });
  }

  async provide(
    metadata: AjaxMetadata = new AjaxMetadata(),
    includeRevisions = false
  ): Promise<DeliveryServiceEntity[]> {
    const deliveryServices = await DeliveryServicesApi.instance.listDeliveryServices(metadata, includeRevisions);

    const dsMetadataList = await DeliveryServiceMetadataProvider.instance.provideList(metadata);
    return deliveryServices.map((ds) => {
      let revisions: Revision[] = [];
      if (includeRevisions && ds.dsRevisionDescriptions) {
        revisions = ds.dsRevisionDescriptions.map((revisionType) => ({
          id: revisionType.dsRevisionId,
          labels: revisionType.labels,
          creationTimeFormatted: revisionType.creationTimeFormatted,
        }));
      }

      let dsMetadata: DsMetadataEntity | undefined;
      if (ds.metadataId) {
        dsMetadata = dsMetadataList.find((dsMetadata) => dsMetadata.id === ds.metadataId);
      }

      return new DeliveryServiceEntity({
        id: ds.dsId,
        name: ds.name,
        description: ds.description,
        isActive: ds.isActive,
        revisions: revisions,
        dsMetadata: dsMetadata,
        missingAgreementLinks: [],
      });
    });
  }

  //region [[ Singleton ]]
  private static _instance: DeliveryServicesProvider | undefined;
  static get instance(): DeliveryServicesProvider {
    if (!this._instance) {
      this._instance = new DeliveryServicesProvider();
    }

    return this._instance;
  }
  //endregion
}
