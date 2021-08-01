import { loggerCreator } from "../utils/logger";
import { AjaxMetadata } from "../utils/ajax";
import { DeliveryAgreementsApi, ValidatedDeliveryAgreement } from "../backend/deliveryAgreements";
import _ from "lodash";
import { ContentPublisherEntity } from "../domain/contentPublishers/contentPublisherEntity";
import {
  ContentPublishersEntities,
  EntitiesRestrictionsObject,
} from "../domain/contentPublishers/contentPublishersEntities";

// noinspection JSUnusedLocalSymbols
const moduleLogger = loggerCreator("__filename");

export class DeliveryAgreementCpEntitiesProvider {
  private constructor() {}
  private createCpEntities(deliveryAgreements: ValidatedDeliveryAgreement[]) {
    const agreementsByCp = _.groupBy(
      deliveryAgreements,
      ({ contentPublisher, cpOrgId }) => contentPublisher.orgId ?? cpOrgId
    );
    return Object.keys(agreementsByCp).map(cpId => {
      const agreements = agreementsByCp[cpId];
      const cp = agreements[0].contentPublisher;
      return new ContentPublisherEntity({
        name: cp.uiName ?? _.startCase(cpId),
        id: cpId,
        isps: agreements.map(({ serviceProvider, network, networkId }) => ({
          name: (serviceProvider ?? network).uiName,
          id: networkId.toString(),
          uniqueName: network.uniqueName,
        })),
        deliveryServices: _.uniqBy(agreements, ({ dsMetadataId }) => dsMetadataId).map(({ dsMetadata }) => ({
          name: dsMetadata.userFriendlyName,
          id: dsMetadata.reportingName,
          type: dsMetadata.type,
        })),
      });
    });
  }

  provide = async (
    metadata: AjaxMetadata,
    restrictions?: EntitiesRestrictionsObject
  ): Promise<ContentPublishersEntities> => {
    const deliveryAgreements = await DeliveryAgreementsApi.instance.listValidated(metadata);

    const cps = this.createCpEntities(deliveryAgreements);
    return new ContentPublishersEntities(cps, restrictions);
  };

  //region [[ Singleton ]]
  private static _instance: DeliveryAgreementCpEntitiesProvider | undefined;
  static get instance(): DeliveryAgreementCpEntitiesProvider {
    if (!this._instance) {
      this._instance = new DeliveryAgreementCpEntitiesProvider();
    }

    return this._instance;
  }
  //endregion
}
