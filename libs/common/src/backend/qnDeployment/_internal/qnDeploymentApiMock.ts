/* eslint-disable unused-imports/no-unused-vars */
import * as _ from "lodash";
import { AjaxMetadata } from "common/utils/ajax";
import { QnDeploymentApi } from "common/backend/qnDeployment";
import {
  EntitiesApiModel,
  EntitiesParams,
  EntityHistoryModel,
  EntityTypeEnum,
  PostEntityModel,
  PostResponse,
} from "common/backend/qnDeployment/_types/entitiesApiType";
import mockData from "common/backend/_utils/mockData";
import { sleep } from "common/utils/sleep";
import { mockNetworkSleep } from "common/utils/mockUtils";

export class QnDeploymentApiMock implements QnDeploymentApi {
  mockConfigOfNetworks: string[] = mockData.networks.slice();
  mockConfigOfQns: string[] = mockData.qns.slice();

  async entitiesList(params: EntitiesParams, metadata: AjaxMetadata): Promise<EntitiesApiModel> {
    await sleep(mockNetworkSleep);

    if (
      _.isEqual(params, {
        types: EntityTypeEnum.NETWORK,
        entities_list_format: "details",
        contained_in_list_format: "none",
        contains_list_format: "none",
      })
    ) {
      return require("common/backend/qnDeployment/_internal/mockData/networkHierarchyMockData").default;
    } else if (params.types === EntityTypeEnum.QN) {
      return {
        entities: this.mockConfigOfQns.map((qnSystemId) => ({
          id: 1,
          uniqueName: qnSystemId,
          name: qnSystemId,
          type: EntityTypeEnum.QN,
          attributes: {
            systemId: qnSystemId,
          },
        })),
      };
    } else if (
      params.types === EntityTypeEnum.NETWORK &&
      (params.contained_in_list_group_by_type === "true" || params.contains_list_group_by_type === "true")
    ) {
      return {
        entities: [
          {
            id: 1,
            uniqueName: this.mockConfigOfNetworks[0],
            name: this.mockConfigOfNetworks[0],
            type: EntityTypeEnum.NETWORK,
            attributes: {
              ispId: mockData.ispId[0],
              asns: "1,2",
            },
            containsByType: {
              qn: [this.generateQnEntity(0)],
            },
          },
          {
            id: 2,
            uniqueName: this.mockConfigOfNetworks[1],
            name: this.mockConfigOfNetworks[1],
            type: EntityTypeEnum.NETWORK,
            attributes: {
              ispId: mockData.ispId[1],
              asns: "3,4",
            },
            containsByType: {
              qn: [this.generateQnEntity(1)],
            },
          },
          {
            id: 3,
            uniqueName: this.mockConfigOfNetworks[2],
            name: this.mockConfigOfNetworks[2],
            type: EntityTypeEnum.NETWORK,
            attributes: {},
            containsByType: {
              qn: [this.generateQnEntity(2)],
            },
          },
          {
            id: 4,
            uniqueName: this.mockConfigOfNetworks[3],
            name: this.mockConfigOfNetworks[3],
            type: EntityTypeEnum.NETWORK,
            attributes: {},
            containsByType: {
              qn: [this.generateQnEntity(3)],
            },
          },
        ],
      };
    } else if (
      params.types === EntityTypeEnum.REGION &&
      params.contains_list_format === "details" &&
      params.entities_list_format === "details" &&
      params.contains_list_recursive === "true"
    ) {
      return require("common/backend/qnDeployment/_internal/mockData/qnDeploymentFullHierarchyMockData.json");
    } else if (
      params.types === EntityTypeEnum.REGION &&
      params.contains_list_format === "none" &&
      params.contained_in_list_format === "none" &&
      params.entities_list_format === "details" &&
      params.contains_list_recursive !== "true"
    ) {
      return require("common/backend/qnDeployment/_internal/mockData/qnDeploymentRegionsMockData.json");
    } else if (
      params.entities_list_format === "details" &&
      params.contained_in_list_format === "none" &&
      params.contains_list_format === "none" &&
      params.contains_recursive &&
      params.ids
    ) {
      return {
        entities: [
          {
            id: 2704,
            name: "USA",
            uniqueName: "rgnAmerica_cnUsa",
            type: EntityTypeEnum.COUNTRY,
            attributes: {
              countryCode: "US",
            },
          },
          {
            id: 3557,
            name: "MDTWDEMTD04",
            uniqueName: "rgnAmerica_cnUsa_nwkVerizonFios_mktDelaware_stMiddletown_qnHVBSMD2",
            type: EntityTypeEnum.QN,
            attributes: {},
          },
          {
            id: 2757,
            name: "Verizon FiOS",
            uniqueName: "rgnAmerica_cnUsa_nwkVerizonFiOS",
            type: EntityTypeEnum.NETWORK,
            attributes: {
              ispId: "1234",
              asns: "701",
              orgId: "verizon-fios",
            },
          },
          {
            id: 3319,
            name: "Delaware",
            uniqueName: "rgnAmerica_cnUsa_stateDE",
            type: EntityTypeEnum.STATE,
            attributes: {
              stateCode: "DE",
            },
          },
          {
            id: 2698,
            name: "America",
            uniqueName: "rgnAmerica",
            type: EntityTypeEnum.REGION,
            attributes: {},
          },
          {
            id: 2974,
            name: "Middletown",
            uniqueName: "rgnAmerica_cnUsa_nwkVerizonFios_mktDelaware_stMiddletown",
            type: EntityTypeEnum.SITE,
            attributes: {},
          },
          {
            id: 2830,
            name: "Delaware",
            uniqueName: "rgnAmerica_cnUsa_nwkVerizonFios_mktDelaware",
            type: EntityTypeEnum.MARKET,
            attributes: {},
          },
        ],
      };
    } else {
      throw new Error(`TBD`);
    }
  }

  async entitiesCreate(entity: PostEntityModel): Promise<PostResponse> {
    return { ...entity, id: 1, uniqueName: "uniqueName", contains: [] };
  }

  async entitiesUpdate(entityId: string, entity: PostEntityModel): Promise<PostResponse> {
    return { ...entity, id: 1, uniqueName: "uniqueName", contains: [] };
  }

  async entitiesDelete(entityId: string): Promise<EntitiesApiModel> {
    return {
      entities: [
        {
          id: Number.parseInt(entityId),
          name: "name",
          uniqueName: "uniqueName",
          type: EntityTypeEnum.STATE,
          attributes: {
            stateCode: "DE",
          },
        },
      ],
    };
  }

  async entityHistoryList(entityId: string, metadata: AjaxMetadata): Promise<EntityHistoryModel> {
    return {
      entity: [
        {
          id: Number.parseInt(entityId),
          name: "SLT-2",
          uniqueName: `unique_${entityId}`,
          type: EntityTypeEnum.QN,
          attributes: {
            systemId: "59CWH42",
            "support-name": "SLT-2",
            "serial-number": "59CWH42",
            locationLatitude: "22",
            platformType: "qb-100",
          },
          containedIn: [],
        },
        {
          id: Number.parseInt(entityId),
          name: "SLT-223",
          uniqueName: `unique_${entityId}`,
          type: EntityTypeEnum.QN,
          attributes: {
            systemId: "59CWH42",
            "support-name": "SLT-2",
            "serial-number": "Oops",
            locationLatitude: "22",
            platformType: "qb-100",
          },
          containedIn: [],
          modifiedBy: "yuvalw@qwilt.com",
        },
        {
          id: Number.parseInt(entityId),
          name: "SLT-2",
          uniqueName: `unique_${entityId}`,
          type: EntityTypeEnum.QN,
          attributes: {
            systemId: "59CWH42",
            "support-name": "SLT-2",
            "serial-number": "59CWH42",
            locationLatitude: "22",
            platformType: "qb-100",
          },
          containedIn: [],
          modifiedBy: "yuvalw@qwilt.com",
        },
      ],
    };
  }

  generateQnEntity(index: number) {
    const mockQnSystemId = this.mockConfigOfQns[index];
    return {
      id: index + 1,
      uniqueName: mockQnSystemId,
      name: mockQnSystemId,
      type: EntityTypeEnum.QN,
      attributes: {
        systemId: mockQnSystemId,
      },
    };
  }

  //region [[ Singleton ]]
  protected static _instance: QnDeploymentApiMock | undefined;
  static get instance(): QnDeploymentApiMock {
    if (!this._instance) {
      this._instance = new QnDeploymentApiMock();
    }

    return this._instance;
  }
  //endregion
}
