import * as _ from "lodash";
import { loggerCreator } from "common/utils/logger";
import { AjaxMetadata } from "common/utils/ajax";
import { DeliveryAgreementsGroupEntity } from "src/_domain/deliveryAgreementsGroupEntity";
import { DeliveryAgreementsApi } from "common/backend/deliveryAgreements";
import { DaNetworkConnectionEntity } from "src/_domain/daNetworkConnectionEntity";
import { DeliveryAgreementUpdateApiEntity } from "common/backend/deliveryAgreements/_types/deliveryAgreementsTypes";
import { Utils } from "common/utils/utils";
import { Notifier } from "common/utils/notifications/notifier";
import { OrganizationsProvider } from "common/providers/organizationsProvider";
import { DeliveryServicesApi } from "common/backend/deliveryServices";

const moduleLogger = loggerCreator(__filename);

export class DeliveryAgreementsProvider {
  private constructor() {}

  provide = async (
    metadata: AjaxMetadata,
    deliveryAgreementApi: DeliveryAgreementsApi = DeliveryAgreementsApi.instance
  ): Promise<DeliveryAgreementsGroupEntity[]> => {
    const organizations = await OrganizationsProvider.instance.provide(metadata);
    const deliveryAgreementsRaw = await deliveryAgreementApi.list(metadata);
    const daByDsMetadataName = _.groupBy(deliveryAgreementsRaw, (da) => da.dsMetadata?.reportingName ?? "N/A");

    const existingAgreements = Object.keys(daByDsMetadataName).map((name) => {
      const deliveryAgreement = daByDsMetadataName[name][0];
      const dsMetadata = deliveryAgreement.dsMetadata;

      return new DeliveryAgreementsGroupEntity({
        dsMetadataId: deliveryAgreement.dsMetadataId,
        name: dsMetadata?.userFriendlyName ?? "N/A",
        dsMetadataCpName: deliveryAgreement.contentPublisher?.uiName ?? "N/A",
        networks: daByDsMetadataName[name].map(
          (da) =>
            new DaNetworkConnectionEntity({
              deliveryAgreementId: da.daId,
              networkId: da.networkId,
              name: da.network?.uiName ?? "N/A",
            })
        ),
      });
    });

    // We're showing DS Metadata -> Network connection. However, DS Metadatas without connection (i.e. without an
    // a delegation agreement) will not be returned. So we need to manually fetch them directly from DS Metadata API
    const dsMetadataRaw = await DeliveryServicesApi.instance.listMetadata(metadata);
    const dsMetadataWithoutAgreements = dsMetadataRaw.filter(
      (ds) => !existingAgreements.find((da) => da.dsMetadataId === ds.metadataId)
    );

    existingAgreements.push(
      ...dsMetadataWithoutAgreements.map(
        (ds) =>
          new DeliveryAgreementsGroupEntity({
            dsMetadataId: ds.metadataId,
            dsMetadataCpName: organizations[ds.ownerOrgId]?.name ?? ds.ownerOrgId,
            name: ds.userFriendlyName,
            networks: [],
          })
      )
    );

    return existingAgreements;
  };

  private toUpdateApiType(entity: DeliveryAgreementsGroupEntity, networkId: number): DeliveryAgreementUpdateApiEntity {
    return {
      dsMetadataId: entity.dsMetadataId,
      networkId: networkId,
    };
  }

  async update(oldEntity: DeliveryAgreementsGroupEntity, newEntity: DeliveryAgreementsGroupEntity) {
    await this.updateInternal(oldEntity, newEntity);
  }

  async create(newEntity: DeliveryAgreementsGroupEntity) {
    await this.updateInternal(undefined, newEntity);
  }

  async delete(oldEntity: DeliveryAgreementsGroupEntity) {
    await this.updateInternal(oldEntity, undefined);
  }

  private updateInternal = async (
    oldEntity: DeliveryAgreementsGroupEntity | undefined,
    newEntity: DeliveryAgreementsGroupEntity | undefined,
    deliveryAgreementApi: DeliveryAgreementsApi = DeliveryAgreementsApi.instance
  ) => {
    const entity = oldEntity ?? newEntity;
    if (!entity) {
      throw new Error(`nothing to update - either new or old entity must be set`);
    }

    let deletedNetworkAssociations: DaNetworkConnectionEntity[] = [];
    if (oldEntity) {
      deletedNetworkAssociations = _.differenceBy(
        oldEntity.networks,
        newEntity?.networks ?? [],
        (item) => item.networkId
      );
    }

    let newNetworkAssociations: DaNetworkConnectionEntity[] = [];
    if (newEntity) {
      newNetworkAssociations = _.differenceBy(newEntity.networks, oldEntity?.networks ?? [], (item) => item.networkId);
    }

    const promises: Promise<void>[] = [];
    for (const networkAssociation of deletedNetworkAssociations) {
      promises.push(deliveryAgreementApi.delete(networkAssociation.deliveryAgreementId));
    }

    for (const networkAssociation of newNetworkAssociations) {
      promises.push(
        deliveryAgreementApi.create({
          dsMetadataId: entity.dsMetadataId,
          networkId: networkAssociation.networkId,
        })
      );
    }

    const promisesResult = await Promise.allSettled(promises);
    const errorMessages = promisesResult
      .map((result) => (result.status === "rejected" ? result.reason.message : undefined))
      .filter(Utils.isTruthy);

    if (errorMessages.length) {
      Notifier.modal("Operation failed:\n" + errorMessages.join("\n"));
    }
  };

  private async createInternal(
    dsName: string,
    networkName: string,
    apiEntity: DeliveryAgreementUpdateApiEntity
  ): Promise<void> {
    try {
      await DeliveryAgreementsApi.instance.create(apiEntity);
    } catch (e) {
      throw new Error(`Failed to create an association: ${dsName} -> ${networkName}: ${e.message}`);
    }
  }

  private async deleteInternal(dsName: string, networkName: string, daId: string): Promise<void> {
    try {
      await DeliveryAgreementsApi.instance.delete(daId);
    } catch (e) {
      throw new Error(`Failed to delete an association: ${dsName} -> ${networkName}`);
    }
  }

  //region [[ Singleton ]]
  private static _instance: DeliveryAgreementsProvider | undefined;
  static get instance(): DeliveryAgreementsProvider {
    if (!this._instance) {
      this._instance = new DeliveryAgreementsProvider();
    }

    return this._instance;
  }
  //endregion
}
