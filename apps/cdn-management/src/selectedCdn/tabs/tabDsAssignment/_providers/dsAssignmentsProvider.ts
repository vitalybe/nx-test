import _ from "lodash";
import { loggerCreator } from "@qwilt/common/utils/logger";
import { AjaxMetadata } from "@qwilt/common/utils/ajax";
import { DsRuleEntity, RuleType } from "../_domain/dsRuleEntity";
import { DsAssignmentsApi } from "@qwilt/common/backend/ds-assignments";
import { DeliveryServiceEntity } from "../../../../_domain/deliveryServiceEntity";
import {
  ApiDsRule,
  ApiEntityRuleType,
  ApiRuleAssignment,
  ApiRuleRouting,
  AssignmentsApiType,
  RoutingDuApiType,
  RoutingNetworkApiType,
} from "@qwilt/common/backend/ds-assignments/_types/dsAssignmentsTypes";
import { Notifier } from "@qwilt/common/utils/notifications/notifier";
import { Utils } from "@qwilt/common/utils/utils";
import { ServerType } from "@qwilt/common/backend/trafficRoutersMonitors/_types/trafficRoutersMonitorsTypes";
import { ServersProvider } from "../../tabMonitorsAndRouters/_providers/serversProvider";
import { ServersProvider as ServersProviderOld } from "../../tabMonitorsAndRouters/_providers/oldServersProvider";
import { DeliveryServicesProvider } from "../../../../_providers/deliveryServicesProvider";
import { HierarchyUtils, SelectionModeEnum } from "@qwilt/common/utils/hierarchyUtils";
import { DeliveryAgreementsApi } from "@qwilt/common/backend/deliveryAgreements";
import { DeliveryAgreementApiEntity } from "@qwilt/common/backend/deliveryAgreements/_types/deliveryAgreementsTypes";
import { MissingAgreementLinkEntity } from "../../../../_domain/missingAgreementLinkEntity";
import { ProjectUrlStore } from "../../../../_stores/projectUrlStore";
import { ProjectUrlParams } from "../../../../_stores/projectUrlParams";
import { GenericServerEntity } from "../../tabMonitorsAndRouters/_domain/server/genericServerEntity";
import { CachesProvider } from "../../../../_providers/cachesProvider";
import { KeyType, PrepareQueryResult } from "@qwilt/common/utils/reactQueryUtils/prepareQueryResult";
import { CacheEntity } from "../../../../_domain/cacheEntity";
import { NameWithId } from "@qwilt/common/domain/nameWithId";
import { CacheGroupEntity } from "../../../../_domain/cacheGroupEntity";
import { CacheGroupsProvider } from "../../../../_providers/cacheGroupsProvider";

const moduleLogger = loggerCreator("__filename");
export const UNASSIGNED_VALUE = "unassigned";
export const EMPTY_VALUE = "empty";

export class DsAssignmentsProvider {
  prepareQuery(cdnId: string, cdnName: string): PrepareQueryResult<DsAssignmentsProviderResult> {
    return new PrepareQueryResult<DsAssignmentsProviderResult>({
      name: "DsAssignmentsProvider.prepareQuery",
      // NOTE: remove if there are no arguments
      // eslint-disable-next-line prefer-rest-params
      params: [...arguments],
      provide: async (key) => {
        return await this.provide(key, cdnId, cdnName);
      },
    });
  }

  async provide(
    queryKey: KeyType,

    cdnId: string,
    cdnName: string,

    metadata: AjaxMetadata = new AjaxMetadata(),
    deliveryServiceProvider = DeliveryServicesProvider.instance,
    serversProviderOld = ServersProviderOld.instance,
    deliveryAgreementsApi = DeliveryAgreementsApi.instance,
    dsAssignmentsApi = DsAssignmentsApi.instance,
    cachesProvider = CachesProvider.instance,
    cacheGroupsProvider = CacheGroupsProvider.instance
  ): Promise<DsAssignmentsProviderResult> {
    const map = new Map<string, DsRuleEntity[]>();

    const [manifestRouters, deliveryServices, deliveryAgreementsRaw, caches, cacheGroups] = await Promise.all([
      fetchManifestRouters(cdnName, metadata, serversProviderOld),
      deliveryServiceProvider.provide(metadata),
      deliveryAgreementsApi.list(metadata),
      cachesProvider.prepareQuery(cdnId).fetchQueryAsDependency(queryKey),
      cacheGroupsProvider.prepareQuery(cdnId).fetchQueryAsDependency(queryKey),
    ]);

    const assignmentsResult = await dsAssignmentsApi.getAssignmentRules(cdnId, metadata);
    const routingRulesDuResult = await this.fetchRoutingRulesDu(dsAssignmentsApi, cdnId, metadata);
    const routingRulesNetworkResult = await this.fetchRoutingRulesNetwork(dsAssignmentsApi, cdnId, metadata);

    await Promise.all(
      deliveryServices.map((ds) => {
        const networks = caches.flatMap((cache) => cache.network).filter(Utils.isTruthy);

        const ruleEntity = this.provideDsRulesEntity(
          cdnId,
          assignmentsResult,
          routingRulesDuResult,
          routingRulesNetworkResult,
          ds,
          caches,
          cacheGroups,
          networks,
          manifestRouters
        );

        map.set(ds.id, ruleEntity);
      })
    );

    const assignedDs = Array.from(map?.values() ?? []);
    const assignmentPerDs: { [key: string]: number } = {};
    let assignedDsCount = 0;

    assignedDs.forEach((rules) => {
      if (rules.length > 0) {
        const assignmentsCount = _.sumBy(rules, (rule) => this.countDsAssignmentsRecursively(rule));
        if (assignmentsCount > 0) {
          assignedDsCount += 1;
        }
        assignmentPerDs[rules[0].deliveryService.id] = assignmentsCount;
      }
    });

    assignedDs
      .flatMap((dsRules) => dsRules)
      .forEach((rule) => this.validateMissingDeliveryAgreementLinks(rule, deliveryAgreementsRaw));

    const dsAssignmentsRules = _.flatten([...map.values()]);
    const orphanContainingServicesIds = dsAssignmentsRules
      ? dsAssignmentsRules
          .filter((rule) => rule.children?.some((rule) => rule.orphanDeliveryUnitId !== undefined))
          .map((rule) => rule.deliveryService.id)
      : [];

    return {
      dsAssignmentsMap: map,
      deliveryServices: deliveryServices,
      assignedDsCount,
      assignmentPerDs,
      orphanContainingServicesIds,
    };
  }

  private constructor() {}

  //region [[Private]]
  private getApiRoutingRuleDuObject(dsRuleEntity: DsRuleEntity) {
    const { id, routingRule, deliveryService } = dsRuleEntity;
    const { routingEnabled } = routingRule;
    return {
      ruleId: routingRule.ruleId,
      cdnId: dsRuleEntity.cdnId,
      deliveryServiceId: deliveryService.id,
      deliveryUnitId: id,
      routingEnabled: routingEnabled === undefined,
    };
  }

  private getApiRoutingRuleNetworkObject(dsRuleEntity: DsRuleEntity) {
    const networkRule = HierarchyUtils.findParent(dsRuleEntity, (rule) => rule.ruleType === "network");

    if (!networkRule) {
      throw new Error(`Network not defined for rule: ${dsRuleEntity.name}`);
    }

    const { routingRule, deliveryService } = dsRuleEntity;
    const { routingEnabled } = routingRule;
    return {
      ruleId: routingRule.ruleId,
      cdnId: dsRuleEntity.cdnId,
      deliveryServiceId: deliveryService.id,
      networkId: Number(networkRule?.id),
      routingEnabled: routingEnabled === undefined,
    };
  }

  private getApiAssignmentRuleObject(dsRuleEntity: DsRuleEntity) {
    const { assignmentRule, deliveryService } = dsRuleEntity;
    const { assignment, assignmentBlocked } = assignmentRule;
    return {
      ruleId: assignmentRule.ruleId,
      cdnId: dsRuleEntity.cdnId,
      enabled: true,
      deliveryService: {
        id: deliveryService.id,
        label: assignment === UNASSIGNED_VALUE ? undefined : assignment,
      },
      assignmentBlocked: !!assignmentBlocked || assignment === UNASSIGNED_VALUE,
    };
  }

  private getAssignmentValueFromRule(rule: ApiRuleAssignment) {
    const { deliveryService, assignmentBlocked } = rule;
    if (deliveryService.label) {
      return deliveryService.label;
    } else {
      return assignmentBlocked ? _.capitalize(UNASSIGNED_VALUE) : "";
    }
  }

  private createDsRule<T>(values: T, ruleResult?: ApiDsRule) {
    return {
      ...values,
      ruleId: ruleResult ? ruleResult.ruleId : "",
      isNew: !ruleResult,
    };
  }

  private createDsRuleAssignment(ruleResult?: ApiRuleAssignment) {
    return this.createDsRule(
      {
        assignment: ruleResult ? this.getAssignmentValueFromRule(ruleResult) : "",
        assignmentBlocked: ruleResult && ruleResult.assignmentBlocked,
      },
      ruleResult
    );
  }

  private createDsRuleRouting(ruleResult?: ApiRuleRouting) {
    return this.createDsRule(
      {
        routingEnabled: ruleResult?.routingEnabled ?? true,
      },
      ruleResult
    );
  }

  private createDsRulesEntity({
    id,
    name,
    cdnId,
    deliveryService,
    children,
    parent,
    invalidAlert,
    isValid,
    rules,
    ruleType,
    orphanDeliveryUnitId,
    systemId,
  }: {
    id: string;
    name: string;
    systemId?: string;
    cdnId: string;
    deliveryService: DeliveryServiceEntity;
    parent?: DsRuleEntity;
    children?: DsRuleEntity[];
    isValid: boolean;
    invalidAlert?: string;
    ruleType: RuleType;
    rules: { assignment?: ApiRuleAssignment; routing?: ApiRuleRouting };
    orphanDeliveryUnitId?: string;
  }): DsRuleEntity {
    //if no rule its a blank-rule
    return new DsRuleEntity({
      id,
      name,
      systemId,
      cdnId: cdnId,
      deliveryService,
      selection: SelectionModeEnum.NOT_SELECTED,
      selfSelection: SelectionModeEnum.NOT_SELECTED,
      parent,
      children,
      isValid,
      invalidAlert: invalidAlert ? invalidAlert : "",
      ruleType,
      assignmentRule: this.createDsRuleAssignment(rules.assignment),
      routingRule: this.createDsRuleRouting(rules.routing),
      orphanDeliveryUnitId,
    });
  }

  //endregion

  private getOrCreateNetworkRule(
    cdnId: string,
    deliveryService: DeliveryServiceEntity,
    network: NameWithId<number>,
    allRules: DsRuleEntity[],
    networkRules: DsRuleEntity[],
    assignmentRules: AssignmentsApiType,
    allDsRoutingRulesNetworkResult: RoutingNetworkApiType | undefined
  ): DsRuleEntity {
    let networkRule: DsRuleEntity | undefined = networkRules.find((rule) => rule.id === network.id.toString());
    if (!networkRule) {
      const foundAssignmentRule = assignmentRules.rules.network?.find(
        (rule) => rule?.deliveryService.id === deliveryService.id && rule.networkId === network.id
      );

      const foundRoutingRuleNetwork = allDsRoutingRulesNetworkResult?.network?.find(
        (rule) => rule.deliveryServiceId === deliveryService.id && rule.networkId === network.id
      );

      networkRule = this.createDsRulesEntity({
        id: network.id.toString(),
        name: network.name ?? "N/A",
        cdnId,
        deliveryService,
        children: [],
        isValid: true,
        ruleType: "network",
        rules: {
          assignment: foundAssignmentRule,
          routing: foundRoutingRuleNetwork,
        },
      });

      networkRules.push(networkRule);
      allRules.push(networkRule);
    }

    return networkRule;
  }

  private getOrCreateCacheGroupRule(
    cdnId: string,
    deliveryService: DeliveryServiceEntity,
    network: NameWithId<number>,
    groupEntity: CacheGroupEntity,
    dugRules: DsRuleEntity[],
    networkRule: DsRuleEntity
  ): DsRuleEntity {
    let dugRule = dugRules.find(
      (dugRule) => dugRule?.parent?.id === network?.id.toString() && dugRule.id === groupEntity.id
    );

    let ruleType: RuleType;
    if (groupEntity.type === "edge") {
      ruleType = "cache-group-edge";
    } else if (groupEntity.type === "mid") {
      ruleType = "cache-group-mid";
    } else if (groupEntity.type === "both") {
      ruleType = "cache-group-both";
    } else {
      throw new Error(`unexpected groupEntity type: ${groupEntity.type}`);
    }

    if (!dugRule) {
      dugRule = this.createDsRulesEntity({
        id: groupEntity.id,
        name: groupEntity.name,
        cdnId: cdnId,
        deliveryService,
        parent: networkRule,
        children: [],
        isValid: true,
        ruleType: ruleType,
        rules: {},
      });

      dugRules.push(dugRule);
      networkRule?.children?.push(dugRule);
    }

    return dugRule;
  }

  private async fetchRoutingRulesDu(dsAssignmentsApi: DsAssignmentsApi, cdnId: string, metadata: AjaxMetadata) {
    try {
      return await dsAssignmentsApi.getRoutingRulesDu(cdnId, metadata);
    } catch (e) {
      Notifier.warn(`Failed to fetch "Routing Rules" of Caches`);
    }
  }

  private async fetchRoutingRulesNetwork(dsAssignmentsApi: DsAssignmentsApi, cdnId: string, metadata: AjaxMetadata) {
    try {
      return await dsAssignmentsApi.getRoutingRulesNetwork(cdnId, metadata);
    } catch (e) {
      Notifier.warn(`Failed to fetch "Routing Rules" of Networks`);
    }
  }

  private createManifestRules(
    cdnId: string,
    servers: GenericServerEntity[] | undefined,
    assignmentRules: AssignmentsApiType,
    deliveryService: DeliveryServiceEntity,
    allRules: DsRuleEntity[]
  ) {
    if (servers && servers.length > 0) {
      for (const server of servers) {
        const foundRule =
          assignmentRules.rules.manifestRouter &&
          assignmentRules.rules.manifestRouter.find((mrRule) => mrRule.manifestRouterId === server.systemId);
        const rule = this.createDsRulesEntity({
          id: server.systemId,
          name: server.systemId,
          systemId: server.systemId,
          cdnId,
          deliveryService,
          parent: undefined,
          children: [],
          isValid: true,
          ruleType: "manifest-router",
          rules: {
            assignment: foundRule,
          },
        });

        allRules.push(rule);
      }
    }
  }

  private validateMissingDeliveryAgreementLinks(
    rule: DsRuleEntity,
    deliveryAgreementsRaw: DeliveryAgreementApiEntity[]
  ) {
    const ruleNetworkDetails = rule.networkDetails;
    const ruleDsMetadata = rule.deliveryService.dsMetadata;

    if (rule.assignmentRule.assignment && ruleNetworkDetails && ruleDsMetadata) {
      const deliveryAgreement = deliveryAgreementsRaw.find(
        (deliveryAgreement) =>
          deliveryAgreement.dsMetadataId === ruleDsMetadata.id && deliveryAgreement.networkId === ruleNetworkDetails.id
      );

      if (!deliveryAgreement) {
        const newMissingLink = new MissingAgreementLinkEntity({
          dsMetadataId: ruleDsMetadata.id,
          dsMetadataName: ruleDsMetadata.name,
          networkId: ruleNetworkDetails.id,
          networkName: ruleNetworkDetails.name ?? "N/A",
        });

        this.addNewMissingLink(rule.deliveryService.missingAgreementLinks, newMissingLink);
        this.addNewMissingLink(ruleDsMetadata.missingAgreementLinks, newMissingLink);

        rule.missingAgreementLink = newMissingLink;
      }
    }

    if (rule.children) {
      rule.children.forEach((childRule) =>
        this.validateMissingDeliveryAgreementLinks(childRule, deliveryAgreementsRaw)
      );
    }
  }

  private addNewMissingLink(missingLinks: MissingAgreementLinkEntity[], newMissingLink: MissingAgreementLinkEntity) {
    const existingMissingLink = missingLinks.find((missingLink) => _.isEqual(missingLink, newMissingLink));

    if (!existingMissingLink) {
      missingLinks.push(newMissingLink);
    }
  }

  filterRulesByDs<T extends ApiRuleAssignment>(rules: T[], deliveryService: DeliveryServiceEntity): T[] {
    return rules.filter((rule) => rule.deliveryService.id === deliveryService.id);
  }

  provideDsRulesEntity = (
    cdnId: string,
    allDsAssignmentResult: AssignmentsApiType,
    allDsRoutingRulesDuResult: RoutingDuApiType | undefined,
    allDsRoutingRulesNetworkResult: RoutingNetworkApiType | undefined,
    deliveryService: DeliveryServiceEntity,
    caches: CacheEntity[],
    cacheGroups: CacheGroupEntity[],
    networks: NameWithId<number>[],
    manifestRouters: GenericServerEntity[] | undefined
  ): DsRuleEntity[] => {
    const dsAssignmentResult = _.cloneDeep(allDsAssignmentResult);
    dsAssignmentResult.rules.deliveryUnit = this.filterRulesByDs(
      dsAssignmentResult.rules.deliveryUnit,
      deliveryService
    );
    dsAssignmentResult.rules.manifestRouter = this.filterRulesByDs(
      dsAssignmentResult.rules.manifestRouter,
      deliveryService
    );
    dsAssignmentResult.rules.network = this.filterRulesByDs(dsAssignmentResult.rules.network, deliveryService);

    const allRules: DsRuleEntity[] = [];

    const networkRules: DsRuleEntity[] = [];
    const dugRules: DsRuleEntity[] = [];

    const orphanAssignments = dsAssignmentResult.rules.deliveryUnit.filter((assignmentRule) => {
      return !caches.some((du) => assignmentRule.deliveryUnitId === du.id);
    });
    orphanAssignments.forEach((assignmentRule) => {
      const duRule = this.createDsRulesEntity({
        id: assignmentRule.ruleId,
        name: "N/A",
        cdnId,
        deliveryService,
        children: [],
        isValid: false,
        invalidAlert: "Orphan Assignment (no DU found)",
        ruleType: "cache",
        rules: {
          assignment: assignmentRule,
        },
        orphanDeliveryUnitId: assignmentRule.deliveryUnitId,
      });
      allRules.push(duRule);
    });

    caches.forEach((cache) => {
      const foundAssignmentRule = dsAssignmentResult.rules.deliveryUnit.find(
        (rule) => rule.deliveryUnitId === cache.id
      );

      const foundRoutingRuleDu = allDsRoutingRulesDuResult?.deliveryUnit?.find(
        (rule) => rule.deliveryServiceId === deliveryService.id && rule.deliveryUnitId === cache.id
      );

      let networkRule: DsRuleEntity | undefined;
      let dugRule: DsRuleEntity | undefined;

      const group = cacheGroups.find((group) => group.id === cache.group?.id);
      if (cache.network && group) {
        networkRule = this.getOrCreateNetworkRule(
          cdnId,
          deliveryService,
          cache.network,
          allRules,
          networkRules,
          dsAssignmentResult,
          allDsRoutingRulesNetworkResult
        );
        dugRule = this.getOrCreateCacheGroupRule(cdnId, deliveryService, cache.network, group, dugRules, networkRule);
      }
      const duRuleParent = dugRule ?? networkRule;

      const duRule = this.createDsRulesEntity({
        id: cache.id,
        name: cache.name,
        systemId: cache.systemId,
        cdnId: cdnId,
        deliveryService,
        parent: duRuleParent,
        children: [],
        isValid: !!networkRule,
        invalidAlert: "No Network Assignment Rule",
        ruleType: "cache",
        rules: {
          assignment: foundAssignmentRule,
          routing: foundRoutingRuleDu,
        },
      });
      if (duRuleParent) {
        duRuleParent?.children?.push(duRule);
      } else {
        allRules.push(duRule);
      }
    });
    this.createManifestRules(cdnId, manifestRouters, dsAssignmentResult, deliveryService, allRules);

    return allRules;
  };

  updateAssignmentRule = async (dsRuleEntity: DsRuleEntity) => {
    if (dsRuleEntity.ruleType === "cache") {
      const assignmentRule = {
        ...this.getApiAssignmentRuleObject(dsRuleEntity),
        deliveryUnitId: dsRuleEntity.id,
      };

      if (!dsRuleEntity.assignmentRule.ruleId) {
        await DsAssignmentsApi.instance.createAssignmentRuleDu(assignmentRule);
      } else {
        await DsAssignmentsApi.instance.updateAssignmentRuleDu(assignmentRule);
      }
    } else if (dsRuleEntity.ruleType === "manifest-router") {
      const ruleObject = {
        ...this.getApiAssignmentRuleObject(dsRuleEntity),
        manifestRouterId: dsRuleEntity.id,
      };

      if (!dsRuleEntity.assignmentRule.ruleId) {
        await DsAssignmentsApi.instance.createAssignmentRuleMr(ruleObject);
      } else {
        await DsAssignmentsApi.instance.updateAssignmentRuleMr(ruleObject);
      }
    } else if (dsRuleEntity.ruleType === "network") {
      const ruleObject = {
        ...this.getApiAssignmentRuleObject(dsRuleEntity),
        networkId: Number(dsRuleEntity.id),
      };

      if (!dsRuleEntity.assignmentRule.ruleId) {
        await DsAssignmentsApi.instance.createAssignmentRuleNet(ruleObject);
      } else {
        await DsAssignmentsApi.instance.updateAssignmentRuleNet(ruleObject);
      }
    } else {
      if (!dsRuleEntity.assignmentRule.ruleId) {
        await DsAssignmentsApi.instance.createAssignmentRuleCdn(this.getApiAssignmentRuleObject(dsRuleEntity));
      } else {
        await DsAssignmentsApi.instance.updateAssignmentRuleCdn(this.getApiAssignmentRuleObject(dsRuleEntity));
      }
    }
  };

  updateRoutingRule = async (dsRuleEntity: DsRuleEntity) => {
    if (dsRuleEntity.ruleType === "cache") {
      const routingRule = this.getApiRoutingRuleDuObject(dsRuleEntity);

      if (!dsRuleEntity.routingRule.ruleId) {
        await DsAssignmentsApi.instance.createRoutingRuleDu(routingRule);
      } else {
        await DsAssignmentsApi.instance.updateRoutingRuleDu(routingRule);
      }
    } else if (dsRuleEntity.ruleType === "network") {
      const routingRule = this.getApiRoutingRuleNetworkObject(dsRuleEntity);

      if (!dsRuleEntity.routingRule.ruleId) {
        await DsAssignmentsApi.instance.createRoutingRuleNetwork(routingRule);
      } else {
        await DsAssignmentsApi.instance.updateRoutingRuleNetwork(routingRule);
      }
    }
  };

  deleteRoutingRule = async (dsRuleEntity: DsRuleEntity) => {
    if (dsRuleEntity.ruleType === "cache") {
      await DsAssignmentsApi.instance.deleteRoutingRuleDu(dsRuleEntity.routingRule.ruleId);
    } else if (dsRuleEntity.ruleType === "network") {
      await DsAssignmentsApi.instance.deleteRoutingRuleNetwork(dsRuleEntity.routingRule.ruleId);
    }
  };

  deleteAssignmentRule = async (dsRuleEntity: DsRuleEntity) => {
    let type: ApiEntityRuleType;
    if (dsRuleEntity.ruleType === "cache") {
      type = "delivery-unit";
    } else if (dsRuleEntity.ruleType === "network") {
      type = "network";
    } else if (dsRuleEntity.ruleType === "cdn") {
      type = "cdn";
    } else if (dsRuleEntity.ruleType === "manifest-router") {
      type = "manifest-router";
    } else {
      throw new Error(`unsupported type: ` + dsRuleEntity);
    }

    await DsAssignmentsApi.instance.deleteAssignmentRule(type, dsRuleEntity.assignmentRule.ruleId);
  };

  private countDsAssignmentsRecursively(dsRule: DsRuleEntity): number {
    const ruleAssignmentCount = !!dsRule?.assignmentRule.assignment ? 1 : 0;

    if (dsRule?.children?.length === 0) {
      return ruleAssignmentCount;
    }

    let childrenAssignmentCount: number = 0;
    dsRule?.children?.forEach((rule) => {
      const assignmentCount = this.countDsAssignmentsRecursively(rule);
      childrenAssignmentCount += assignmentCount;
    });

    return ruleAssignmentCount + childrenAssignmentCount;
  }

  //region [[ Singleton ]]
  private static _instance: DsAssignmentsProvider | undefined;
  static get instance(): DsAssignmentsProvider {
    if (!this._instance) {
      this._instance = new DsAssignmentsProvider();
    }

    return this._instance;
  }
  //endregion
}

interface DsAssignmentsProviderResult {
  deliveryServices: DeliveryServiceEntity[];
  assignedDsCount: number;
  dsAssignmentsMap: Map<string, DsRuleEntity[]>;
  assignmentPerDs: { [dsId: string]: number };
  orphanContainingServicesIds: string[];
}

async function fetchManifestRouters(
  cdnId: string,
  metadata: AjaxMetadata,
  serversProviderOld: ServersProviderOld
): Promise<GenericServerEntity[]> {
  const flagMoreConfigurations = ProjectUrlStore.getInstance().getParamExists(
    ProjectUrlParams.tempFlag_serversTabMoreConfigurations
  );

  if (flagMoreConfigurations) {
    return await ServersProvider.instance.provide(cdnId, metadata, ServerType.HTTP_ROUTER);
  } else {
    const servers = await serversProviderOld.provide(cdnId);
    return servers.filter((server) => server.type === ServerType.MANIFEST_ROUTER);
  }
}
