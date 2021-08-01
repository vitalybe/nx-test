import { DeliveryServicesMatchType } from "common/backend/deliveryServices/_types/deliveryServicesTypes";
import { AjaxMetadata } from "common/utils/ajax";
import { DeliveryServicesApi } from "common/backend/deliveryServices";
import { DsMetadataEntity } from "src/_domain/dsMetadataEntity";
import { MissingAgreementLinkEntity } from "src/_domain/missingAgreementLinkEntity";

let lastMockId = 1;

export interface DeliveryServiceMatch {
  pattern: string;
  setNumber: number;
  type: DeliveryServicesMatchType;
}

export interface Revision {
  id: string;
  labels: string[];
  creationTimeFormatted: string;
}

// Define all fields here
interface DeliveryServiceEntityParams {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  revisions: Revision[];
  updatedRevisionsCreationTime?: boolean;
  dsMetadata?: DsMetadataEntity;
  missingAgreementLinks: MissingAgreementLinkEntity[];
}

export class DeliveryServiceEntity implements DeliveryServiceEntityParams {
  constructor(data: DeliveryServiceEntityParams) {
    Object.assign(this, data);
  }

  static getMissingDeliveryService = () => {
    return new DeliveryServiceEntity({
      id: (lastMockId += 1).toString(),
      name: `⚠️ Missing DS`,
      description: "",
      isActive: true,
      revisions: [],
      updatedRevisionsCreationTime: false,
      missingAgreementLinks: [],
    });
  };

  updateRevisions = async (metadata: AjaxMetadata = new AjaxMetadata()) => {
    if (!this.updatedRevisionsCreationTime) {
      const labels = await DeliveryServicesApi.instance.labelMapping(this.id);

      const dsLabelsMap: { [revisionId: string]: { labels: string[]; creationTimeFormatted: string } } = {};

      for (const [label, revisionId] of Object.entries(labels)) {
        if (!dsLabelsMap[revisionId]) {
          const { creationTimeFormatted } = await DeliveryServicesApi.instance.getRevision(
            this.id,
            revisionId,
            metadata
          );
          dsLabelsMap[revisionId] = {
            labels: [label],
            creationTimeFormatted,
          };
        } else {
          dsLabelsMap[revisionId].labels.push(label);
        }
      }

      this.revisions = Object.keys(dsLabelsMap).map((revisionId) => ({
        id: revisionId,
        labels: dsLabelsMap[revisionId].labels,
        creationTimeFormatted: dsLabelsMap[revisionId].creationTimeFormatted,
      }));
      this.updatedRevisionsCreationTime = true;
    }
  };

  static createMock(overrides?: Partial<DeliveryServiceEntityParams>, id: number = (lastMockId += 1)) {
    return new DeliveryServiceEntity({
      id: id.toString(),
      name: `Delivery service ${id}`,
      description: "DESCRIPTION",
      isActive: id % 2 === 0,
      missingAgreementLinks: [],
      revisions:
        id === 4
          ? []
          : [
              {
                labels: ["testing", "ga", "qa", "Label_X"],
                id: "bfebfm",
                creationTimeFormatted: "10-10-2019",
              },
              {
                labels: ["paris", "barcelona", "berlin", "rome"],
                id: "bfebfm",
                creationTimeFormatted: "10-10-2019",
              },
              {
                id: "bfebfm",
                labels: [],
                creationTimeFormatted: "10-10-2019",
              },
              {
                id: "bfebfm",
                labels: [],
                creationTimeFormatted: "10-10-2019",
              },
              {
                id: "bfebfm",
                labels: ["testing"],
                creationTimeFormatted: "10-10-2019",
              },
            ],
      ...overrides,
    });
  }
}

export interface DeliveryServiceEntity extends DeliveryServiceEntityParams {}
