import { loggerCreator } from "@qwilt/common/utils/logger";
import { AjaxMetadata } from "@qwilt/common/utils/ajax";
import { OrganizationsProvider, OrgMap } from "@qwilt/common/providers/organizationsProvider";
import { DsMetadataEntity } from "../_domain/dsMetadataEntity";
import { DeliveryServicesApi } from "@qwilt/common/backend/deliveryServices";

const moduleLogger = loggerCreator("__filename");

export class DeliveryServiceMetadataProvider {
  private constructor() {}

  provideList = async (metadata: AjaxMetadata, orgMap?: OrgMap): Promise<DsMetadataEntity[]> => {
    const organizations = orgMap ?? (await OrganizationsProvider.instance.provide(metadata));
    const dsMetadataEntityList: DsMetadataEntity[] = [];
    const dsMetadataApiResultList = await DeliveryServicesApi.instance.listMetadata(metadata);

    for (let i = 0; i < dsMetadataApiResultList.length; i++) {
      const dsMetadataApiResult = dsMetadataApiResultList[i];
      dsMetadataEntityList.push(
        new DsMetadataEntity({
          id: dsMetadataApiResult.metadataId,
          name: dsMetadataApiResult.userFriendlyName,
          reportingName: dsMetadataApiResult.reportingName,
          contentGroupId: dsMetadataApiResult.contentGroupId,
          contentProvider: organizations[dsMetadataApiResult.ownerOrgId],
          type: dsMetadataApiResult.type,
          missingAgreementLinks: [],
        })
      );
    }

    return dsMetadataEntityList;
  };

  //region [[ Singleton ]]
  private static _instance: DeliveryServiceMetadataProvider | undefined;
  static get instance(): DeliveryServiceMetadataProvider {
    if (!this._instance) {
      this._instance = new DeliveryServiceMetadataProvider();
    }

    return this._instance;
  }
  //endregion
}
