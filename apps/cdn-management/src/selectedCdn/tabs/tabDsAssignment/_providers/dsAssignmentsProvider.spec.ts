import { DeliveryServicesProvider } from "src/_providers/deliveryServicesProvider";
import { AjaxMetadata } from "common/utils/ajax";
import { DsAssignmentsProvider } from "src/selectedCdn/tabs/tabDsAssignment/_providers/dsAssignmentsProvider";
import { DeliveryServiceEntity } from "src/_domain/deliveryServiceEntity";
import { ServersProvider } from "src/selectedCdn/tabs/tabMonitorsAndRouters/_providers/oldServersProvider";
import { DeliveryAgreementsApiMock } from "common/backend/deliveryAgreements";
import { DeliveryAgreementApiEntity } from "common/backend/deliveryAgreements/_types/deliveryAgreementsTypes";
import { DsAssignmentsApiMock } from "common/backend/ds-assignments";
import {
  AssignmentsApiType,
  RoutingDuApiType,
  RoutingNetworkApiType,
} from "common/backend/ds-assignments/_types/dsAssignmentsTypes";
import { DsMetadataEntity } from "src/_domain/dsMetadataEntity";
import { DsRuleEntity } from "src/selectedCdn/tabs/tabDsAssignment/_domain/dsRuleEntity";
import { GenericServerEntity } from "src/selectedCdn/tabs/tabMonitorsAndRouters/_domain/server/genericServerEntity";
import { CdnEntity } from "src/_domain/cdnEntity";
import { CacheGroupEntity } from "src/_domain/cacheGroupEntity";
import { CacheEntity } from "src/_domain/cacheEntity";
import { NameWithId } from "common/domain/nameWithId";
import { CachesProvider } from "src/_providers/cachesProvider";
import { CacheGroupsProvider } from "src/_providers/cacheGroupsProvider";
import { CommonTestUtils } from "common/utils/commonTestUtils";
import { MetadataServiceTypeEnum } from "common/backend/deliveryServices/_types/deliveryServiceMetadataTypes";

const CDN_ID = "CDN_ID";
const DS_METADATA_ID = "DS_METADATA_ID";
const DS_ID = "DS_ID";
const CACHE_ID = "CACHE_ID";
const REVISION_ID = "REVISION_ID";
const REVISION_LABEL = "REVISION_LABEL";
const NETWORK_ID = 1234;

function getDeliveryAgreementApiEntity(overrides: Partial<DeliveryAgreementApiEntity>) {
  return {
    daId: "1234",
    dsMetadataId: "n/a",
    networkId: 0,
    dsMetadata: {
      reportingName: "content-data",
      contentGroupId: 1234,
      userFriendlyName: "Content Data",
      type: MetadataServiceTypeEnum.VOD,
    },
    network: {
      uniqueName: "rgnAmerica_cnUsa_nwkNetwork",
      uiName: "Network",
      country: "America",
    },
    contentPublisher: {
      orgId: "cp",
      uiName: "Content Publisher",
    },
    serviceProvider: {
      orgId: "sp",
      uiName: "Service Provider",
    },
    ...overrides,
  };
}

async function getDsAssigmentProviderResult(
  assignmentRule: AssignmentsApiType,
  daApiEntity: DeliveryAgreementApiEntity | undefined
) {
  const cdn = CdnEntity.createMock({ id: CDN_ID });
  const groups = [CacheGroupEntity.createMock()];
  const group = groups[0];

  const cache = CacheEntity.createMock({
    group: new NameWithId({ name: group.name, id: group.id }),
    id: CACHE_ID,
    network: new NameWithId<number>({ id: NETWORK_ID, name: "My network" }),
  });

  return await DsAssignmentsProvider.instance.provide(
    ["test"],
    cdn.id,
    cdn.name,
    new AjaxMetadata(),
    new (class extends DeliveryServicesProvider {
      async provide(): Promise<DeliveryServiceEntity[]> {
        return [
          DeliveryServiceEntity.createMock({
            id: DS_ID,
            dsMetadata: DsMetadataEntity.createMock({ id: DS_METADATA_ID }),
            revisions: [
              { id: REVISION_ID, labels: [REVISION_LABEL], creationTimeFormatted: "2020-01-15T14:52:22.023Z" },
            ],
          }),
        ];
      }
    })(),
    new (class extends ServersProvider {
      async provide(): Promise<GenericServerEntity[]> {
        return [GenericServerEntity.createMock()];
      }
    })(),
    new (class extends DeliveryAgreementsApiMock {
      async list(): Promise<DeliveryAgreementApiEntity[]> {
        return daApiEntity ? [daApiEntity] : [];
      }
    })(),
    new (class extends DsAssignmentsApiMock {
      async getAssignmentRules(): Promise<AssignmentsApiType> {
        return assignmentRule;
      }

      async getRoutingRulesDu(): Promise<RoutingDuApiType> {
        return {
          deliveryUnit: [
            {
              ruleId: "34ed5dd1-0b11-42a5-a458-0e571479ef46",
              cdnId: "9b2d89fe-7078-41e1-89c9-077f041ba480",
              deliveryUnitId: "8211c8fb-31ed-439f-94df-0412b4e05cd7",
              deliveryServiceId: "5e3c30469877620001b1b25e",
              routingEnabled: false,
            },
          ],
        };
      }

      async getRoutingRulesNetwork(): Promise<RoutingNetworkApiType> {
        return {
          network: [],
        };
      }
    })(),
    new (class extends CachesProvider {
      prepareQuery() {
        return CommonTestUtils.getMockQueryResult(async () => {
          return [cache];
        });
      }
    })(),
    new (class extends CacheGroupsProvider {
      prepareQuery() {
        return CommonTestUtils.getMockQueryResult(async () => {
          return groups;
        });
      }
    })()
  );
}

describe("dsAssignmentsProvider provide", function () {
  it("should provide blank assignments rules", async function () {
    const result = await getDsAssigmentProviderResult(
      {
        rules: {
          network: [],
          manifestRouter: [],
          deliveryUnit: [],
        },
      },
      undefined
    );

    expect(result.assignedDsCount).toEqual(0);
    expect(result.assignmentPerDs[DS_ID]).toEqual(0);
    expect(result.dsAssignmentsMap.size).toEqual(1);

    const rule = result.dsAssignmentsMap.get(DS_ID)?.[0];
    expect(rule).toMatchObject({ ruleType: "network" });
    expect(rule?.assignmentRule).toMatchObject({ assignment: "" });
    expect(rule?.deliveryService.missingAgreementLinks).toHaveLength(0);
  });

  describe("network assignment rules", function () {
    const assignmentRule: AssignmentsApiType = {
      rules: {
        network: [
          {
            ruleId: "1",
            cdnId: CDN_ID,
            networkId: NETWORK_ID,
            deliveryService: {
              id: DS_ID,
              label: REVISION_LABEL,
            },
            assignmentBlocked: false,
          },
        ],
        manifestRouter: [],
        deliveryUnit: [],
      },
    };

    it("should return rule", async function () {
      const result = await getDsAssigmentProviderResult(
        assignmentRule,
        getDeliveryAgreementApiEntity({ dsMetadataId: DS_METADATA_ID, networkId: NETWORK_ID })
      );

      expect(result.assignedDsCount).toEqual(1);
      expect(result.assignmentPerDs[DS_ID]).toEqual(1);
      expect(result.dsAssignmentsMap.size).toEqual(1);

      const rule = result.dsAssignmentsMap.get(DS_ID)?.[0];
      expect(rule).toMatchObject({ ruleType: "network" });
      expect(rule?.assignmentRule).toMatchObject({ assignment: REVISION_LABEL });

      expect(rule?.deliveryService.missingAgreementLinks).toHaveLength(0);
    });

    it("should return missing agreement links", async function () {
      const result = await getDsAssigmentProviderResult(assignmentRule, undefined);

      const rule = result.dsAssignmentsMap.get(DS_ID)?.[0];
      expect(rule?.deliveryService.missingAgreementLinks).toHaveLength(1);
      const missingAgreementLink = rule?.deliveryService.missingAgreementLinks[0];
      expect(missingAgreementLink).toMatchObject({
        dsMetadataId: DS_METADATA_ID,
        networkId: NETWORK_ID,
      });
    });
  });

  describe("cache assignment rules", function () {
    const assignmentRule: AssignmentsApiType = {
      rules: {
        network: [],
        manifestRouter: [],
        deliveryUnit: [
          {
            ruleId: "1",
            cdnId: CDN_ID,
            deliveryUnitId: CACHE_ID,
            deliveryService: {
              id: DS_ID,
              label: REVISION_LABEL,
            },
            assignmentBlocked: false,
          },
        ],
      },
    };

    it("should return rule", async function () {
      const result = await getDsAssigmentProviderResult(
        assignmentRule,
        getDeliveryAgreementApiEntity({ dsMetadataId: DS_METADATA_ID, networkId: NETWORK_ID })
      );

      expect(result.assignedDsCount).toEqual(1);
      expect(result.assignmentPerDs[DS_ID]).toEqual(1);
      expect(result.dsAssignmentsMap.size).toEqual(1);

      const networkRule = result.dsAssignmentsMap.get(DS_ID)?.[0];
      expect(networkRule).toMatchObject<Partial<DsRuleEntity>>({ ruleType: "network" });
      const cacheGroupRule = networkRule?.children?.[0];
      expect(cacheGroupRule).toMatchObject<Partial<DsRuleEntity>>({ ruleType: "cache-group-edge" });
      const cacheRule = cacheGroupRule?.children?.[0];
      expect(cacheRule).toMatchObject<Partial<DsRuleEntity>>({ ruleType: "cache" });
      expect(cacheRule?.assignmentRule).toMatchObject({ assignment: REVISION_LABEL });

      expect(networkRule?.deliveryService.missingAgreementLinks).toHaveLength(0);
    });

    it("should return missing agreement links", async function () {
      const result = await getDsAssigmentProviderResult(assignmentRule, undefined);

      expect(result.assignedDsCount).toEqual(1);
      expect(result.assignmentPerDs[DS_ID]).toEqual(1);
      expect(result.dsAssignmentsMap.size).toEqual(1);

      const networkRule = result.dsAssignmentsMap.get(DS_ID)?.[0];
      const cacheGroupRule = networkRule?.children?.[0];
      const cacheRule = cacheGroupRule?.children?.[0];

      expect(cacheRule?.deliveryService.missingAgreementLinks).toHaveLength(1);
      const missingAgreementLink = cacheRule?.deliveryService.missingAgreementLinks[0];
      expect(missingAgreementLink).toMatchObject({
        dsMetadataId: DS_METADATA_ID,
        networkId: NETWORK_ID,
      });
    });
  });
});
