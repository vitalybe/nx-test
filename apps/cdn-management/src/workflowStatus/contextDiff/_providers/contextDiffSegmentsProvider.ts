import { ProvisionFlowsApi, ProvisionFlowsStepsEnum } from "@qwilt/common/backend/provisionFlows";
import { DeploymentEntitiesProvider } from "@qwilt/common/providers/deploymentEntitiesProvider";
import { AjaxMetadata } from "@qwilt/common/utils/ajax";
import { loggerCreator } from "@qwilt/common/utils/logger";
import { Notifier } from "@qwilt/common/utils/notifications/notifier";
import { UnknownObject } from "@qwilt/common/utils/typescriptUtils";
import { Utils } from "@qwilt/common/utils/utils";
import * as _ from "lodash";
import { ContextDiffItemEntity } from "../_domain/contextDiffItemEntity";
import { ContextDiffListEntity } from "../_domain/contextDiffListEntity";
import { ContextDiffSegmentEntity } from "../_domain/contextDiffSegmentEntity";
import { ContextDiffEntityTypeEnum } from "../_domain/contextEntityType";
import { IdReplacer } from "../_utils/idReplacer";
import { JsonDiffEntity } from "../../_domain/jsonDiffEntity";
import { WorkflowEntity, WorkflowStateEnum } from "../../_domain/workflowEntity";
import { ActiveWorkflowProvider } from "../../_providers/activeWorkflowProviderProvider";
import { DeliveryServicesProvider } from "../../../_providers/deliveryServicesProvider";

const moduleLogger = loggerCreator("__filename");

interface ContextDiffSegmentsProviderResult {
  left: WorkflowEntity | undefined;
  right: WorkflowEntity;

  segments: ContextDiffSegmentEntity[];
}

export class ContextDiffSegmentsProvider {
  private constructor() {}

  private async getStepOutput(
    cdnId: string,
    workflowId: string,
    stepId: string,
    provisionFlowsApi: ProvisionFlowsApi,
    metadata: AjaxMetadata
  ): Promise<UnknownObject> {
    const outputResult = await provisionFlowsApi.listStepOutput(cdnId, workflowId, stepId, metadata);

    const output = JSON.parse(outputResult["representationContext"].output) ?? {};
    return output;
  }

  provide = async (
    cdnId: string,
    left: WorkflowEntity | undefined,
    right: WorkflowEntity,
    metadata: AjaxMetadata,
    provisionFlowsApi = ProvisionFlowsApi.instance,
    deploymentEntitiesProvider = DeploymentEntitiesProvider.instance,
    deliveryServicesProvider = DeliveryServicesProvider.instance
  ): Promise<ContextDiffSegmentsProviderResult> => {
    const rightWorkflowId = right.id;

    let usedLeftWorkflow = left;
    if (!usedLeftWorkflow) {
      usedLeftWorkflow = await ActiveWorkflowProvider.instance.provide(cdnId, metadata);
    }

    // if the step is being previewed (in progress and is still in progress) show the diff between ALL the current data.
    // but if the preview if for past workflows (from history grid) show just the segments chosen by user
    const rightWorkflowStepId =
      right.state === WorkflowStateEnum.IN_PROGRESS
        ? ProvisionFlowsStepsEnum.PREVIEW_OUTPUT_ALL
        : ProvisionFlowsStepsEnum.PREVIEW_OUTPUT_APPLIED;

    const [leftOutput, rightOutput] = await Promise.all([
      usedLeftWorkflow?.id
        ? this.getStepOutput(
            cdnId,
            usedLeftWorkflow?.id,
            ProvisionFlowsStepsEnum.PREVIEW_OUTPUT_APPLIED,
            provisionFlowsApi,
            metadata
          )
        : {},
      this.getStepOutput(cdnId, rightWorkflowId, rightWorkflowStepId, provisionFlowsApi, metadata),
    ]);

    const networkEntities = await deploymentEntitiesProvider.provideNetworks(new AjaxMetadata());
    const dsEntities = await deliveryServicesProvider.provide(new AjaxMetadata());
    const entitiesNameById: EntitiesNameById = {
      networks: Object.fromEntries(networkEntities.map((entity) => [entity.id, entity.name])),
      deliveryServices: Object.fromEntries(dsEntities.map((entity) => [entity.id, entity.name])),
    };

    return {
      left: usedLeftWorkflow,
      right: right,
      segments: await this.createSegmentList(
        this.replaceIds(leftOutput),
        this.replaceIds(rightOutput),
        entitiesNameById
      ),
    };
  };

  private replaceIds(data: UnknownObject) {
    let modifiedData = IdReplacer.replaceIds(data, ["context", SEGMENT_CDN, SEGMENT_CDN_LIST_DETAILS], "cdnId", "name");

    modifiedData = IdReplacer.replaceIds(
      modifiedData,
      ["context", SEGMENT_NETWORK, SEGMENT_NETWORK_LIST_CACHES, "deliveryUnits"],
      "deliveryUnitId",
      "name"
    );

    modifiedData = IdReplacer.replaceIds(
      modifiedData,
      ["context", SEGMENT_DS, SEGMENT_DS_LIST_DETAILS],
      "dsId",
      "name"
    );

    return modifiedData;
  }

  private createSegmentList(
    leftOutput: UnknownObject,
    rightOutput: UnknownObject,
    entitiesNameById: EntitiesNameById
  ): ContextDiffSegmentEntity[] {
    const leftContext = leftOutput["context"] ?? {};
    const rightContext = rightOutput["context"] ?? {};
    const segmentKeys = _.union(Object.keys(leftContext), Object.keys(rightContext ?? {}));

    const segments = segmentKeys
      .map((segmentKey) => {
        try {
          const leftSegment = leftContext[segmentKey];
          const rightSegment = rightContext[segmentKey];

          let segment: ContextDiffSegmentEntity;
          const matcher = segmentMatchers.find((matcher) => {
            try {
              return matcher.keyMatcher(segmentKey);
            } catch (e) {
              return false;
            }
          });
          if (matcher) {
            const children = this.createListOfLists(
              segmentKey,
              leftSegment ?? {},
              rightSegment ?? {},
              matcher.listMatchers
            );
            const changeCount = _.sumBy(
              children,
              (child) => child.addedCount + child.modifiedCount + child.removedCount
            );

            const name =
              this.getSegmentName(segmentKey, leftSegment, matcher.nameExtractor, entitiesNameById) ??
              this.getSegmentName(segmentKey, rightSegment, matcher.nameExtractor, entitiesNameById) ??
              segmentKey;

            segment = new ContextDiffSegmentEntity({
              id: segmentKey,
              name: name,
              changeCount: changeCount,
              type: matcher.type,
              content: { kind: "known", children: children },
            });
          } else {
            const children = this.createListItems(
              segmentKey,
              ContextDiffEntityTypeEnum.UNKNOWN,
              leftSegment,
              rightSegment,
              (root) => [
                {
                  id: segmentKey,
                  name: segmentKey,
                  content: root,
                },
              ]
            );
            segment = new ContextDiffSegmentEntity({
              id: segmentKey,
              name: segmentKey,
              changeCount: children[0].diff.changesAmount,
              type: ContextDiffEntityTypeEnum.UNKNOWN,
              content: { kind: "unknown", children: children },
            });
          }

          return segment;
        } catch (e) {
          Notifier.error(`Failed to process segment: ${segmentKey}`, e);
        }
      })
      .filter(Utils.isTruthy);

    return segments;
  }

  private getSegmentName(
    segmentKey: string,
    segment: UnknownObject,
    extractor: (segmentKey: string, root: UnknownObject, entitiesNameById: EntitiesNameById) => string | undefined,
    entitiesNameById: EntitiesNameById
  ): string | undefined {
    try {
      return extractor(segmentKey, segment, entitiesNameById);
    } catch (e) {
      return undefined;
    }
  }

  private createListOfLists(
    segmentId: string,
    leftSegment: UnknownObject,
    rightSegment: UnknownObject,
    listMatchers: ListMatcher[]
  ): ContextDiffListEntity[] {
    const listKeys = _.union(Object.keys(leftSegment), Object.keys(rightSegment));

    const listEntities = listKeys
      .map((listKey) => {
        try {
          let list: ContextDiffListEntity;

          const matcher = listMatchers.find((matcher) => {
            try {
              return matcher.keyMatcher(listKey);
            } catch (e) {
              return false;
            }
          });

          if (matcher) {
            const listId = listKey;

            const children = this.createListItems(
              listId,
              matcher.type,
              leftSegment[listKey],
              rightSegment[listKey],
              (root) => matcher.itemsExtractor(listId, root)
            );
            const diffCounts = this.getListItemsDiffCounts(children);

            list = new ContextDiffListEntity({
              id: listId,
              name: matcher.name,
              type: matcher.type,
              content: { kind: "known", children: children },
              addedCount: diffCounts.addedCount,
              removedCount: diffCounts.removedCount,
              modifiedCount: diffCounts.modifiedCount,
            });
          } else {
            const children = this.createListItems(
              segmentId,
              ContextDiffEntityTypeEnum.UNKNOWN,
              leftSegment[listKey],
              rightSegment[listKey],
              (root) => [
                {
                  id: listKey,
                  name: listKey,
                  content: root,
                },
              ]
            );
            list = new ContextDiffListEntity({
              id: listKey,
              name: listKey,
              modifiedCount: children[0].diff.changesAmount,
              addedCount: 0,
              removedCount: 0,
              type: ContextDiffEntityTypeEnum.UNKNOWN,
              content: { kind: "unknown", children: children },
            });
          }

          return list;
        } catch (e) {
          Notifier.error(`Failed to process list of items: ${listKey}`, e);
        }
      })
      .filter(Utils.isTruthy);

    return listEntities;
  }

  private getListItemsDiffCounts(children: ContextDiffItemEntity[]) {
    return children
      .map((child) => {
        let modifiedCount = 0,
          addedCount = 0,
          removedCount = 0;

        if (child.isAdded) {
          addedCount = 1;
        } else if (child.isRemoved) {
          removedCount = 1;
        } else if (child.isModified) {
          modifiedCount = 1;
        }

        return { modifiedCount, addedCount, removedCount };
      })
      .reduce(
        (previousValue, currentValue) => ({
          modifiedCount: previousValue.modifiedCount + currentValue.modifiedCount,
          addedCount: previousValue.addedCount + currentValue.addedCount,
          removedCount: previousValue.removedCount + currentValue.removedCount,
        }),
        {
          modifiedCount: 0,
          addedCount: 0,
          removedCount: 0,
        }
      );
  }

  private createContextDiffItemEntity(
    type: ContextDiffEntityTypeEnum,
    existingItem: RawItem,
    left: RawItem | undefined,
    right: RawItem | undefined
  ) {
    try {
      return new ContextDiffItemEntity({
        id: existingItem.id,
        name: existingItem.name,
        type: type,
        diff: new JsonDiffEntity({ left: left?.content, right: right?.content, idGetter: undefined }),
      });
    } catch (e) {
      Notifier.error(`Failed to process item: ${existingItem}`, e);
    }
  }

  private createListItems(
    parentId: string,
    type: ContextDiffEntityTypeEnum,
    leftRoot: UnknownObject,
    rightRoot: UnknownObject,
    itemsGetter: (root: UnknownObject) => RawItem[]
  ): ContextDiffItemEntity[] {
    const leftItems = leftRoot ? itemsGetter(leftRoot) : [];
    const rightItems = rightRoot ? itemsGetter(rightRoot) : [];

    const matchingItems = _.intersectionBy(leftItems, rightItems, (item) => item.id).map((leftItem) => {
      const rightItem = rightItems.find((item) => item.id === leftItem.id);
      return this.createContextDiffItemEntity(type, leftItem, leftItem, rightItem);
    });

    const newItems = _.differenceBy(leftItems, rightItems, (item) => item.id).map((leftItem) =>
      this.createContextDiffItemEntity(type, leftItem, leftItem, undefined)
    );

    const removedItems = _.differenceBy(rightItems, leftItems, (item) => item.id).map((rightItem) =>
      this.createContextDiffItemEntity(type, rightItem, undefined, rightItem)
    );

    return [...matchingItems, ...newItems, ...removedItems].filter(Utils.isTruthy);
  }

  //region [[ Singleton ]]
  private static _instance: ContextDiffSegmentsProvider | undefined;
  static get instance(): ContextDiffSegmentsProvider {
    if (!this._instance) {
      this._instance = new ContextDiffSegmentsProvider();
    }

    return this._instance;
  }
  //endregion
}

interface EntitiesNameById {
  deliveryServices: Record<string, string>;
  networks: Record<string, string>;
}

interface RawItem {
  id: string;
  name: string;
  content: UnknownObject;
}

interface ListMatcher {
  type: ContextDiffEntityTypeEnum;
  keyMatcher: (key: string) => boolean;
  name: string;
  itemsExtractor: (parentId: string, root: UnknownObject) => RawItem[];
}

interface SegmentMatcher {
  type: ContextDiffEntityTypeEnum;
  keyMatcher: (key: string) => boolean;
  nameExtractor: (segmentKey: string, root: UnknownObject, entitiesNameById: EntitiesNameById) => string | undefined;

  listMatchers: ListMatcher[];
}

export enum ListNameEnum {
  CDN_DETAILS = "CDN Details",
  DS_DETAILS = "DS Details",
  DS_REVISION_LABEL = "DS Labels Mappings",
  DS_REVISION = "Assigned DS Revision",
  DS_ASSIGNMENT_NETWORK = "Network DS Assignments",
  DS_ASSIGNMENT_CACHE = "Cache DS Assignments",
  DELEGATION_STATIC_DNS_RECORDS = "Static DNS Records",

  ROUTING_AND_MONITORING = "Routing and Monitoring",
  ROUTING_DNS_ROUTING_SEGMENTS = "DNS Routing Segments",
  ROUTING_ROUTER_GROUPS = "Router Groups",
  ROUTING_MONITORING_SEGMENTS = "Monitoring Segments",
  ROUTING_DNS_ROUTERS = "DNS Routers",
  ROUTING_HEALTH_COLLECTORS = "Health Collectors",
  ROUTING_HTTP_ROUTERS = "HTTP Routers",
  ROUTING_MANIFEST_ROUTERS_ASSIGNMENTS = "Manifest Router Assignments",
}

const SEGMENT_CDN = /^CDN$/;
const SEGMENT_CDN_LIST_DETAILS = /cdns.*.cqloud.com\/api\/1\/cdns\/[\w-]+$/;
const SEGMENT_NETWORK = /^NETWORK\/\d+$/;
const SEGMENT_NETWORK_LIST_DETAILS = /qn-deployment.*cqloud.com\/api\/2\/entities\?.+types=network/;
const SEGMENT_NETWORK_LIST_CACHE_GROUPS = /cdns.*cqloud.com\/api\/1\/cdns\/[\w-]+\/delivery-unit-groups\?/;
const SEGMENT_NETWORK_LIST_CACHES = /cdns.*cqloud.com\/api\/1\/cdns\/[\w-]+\/delivery-units\?/;
const SEGMENT_NETWORK_LIST_QN_INFRA = /infrastructure.*cqloud.com\/api\/1\/cdn\/caches\?/;
const SEGMENT_DS = /^DS\/\w+$/;
const SEGMENT_DS_LIST_DETAILS = /delivery-services.*.cqloud.com\/api\/4\/delivery-services\/[\w-]+(\?|$)/;
const SEGMENT_DS_ASSIGNMENT = /^DS-ASSIGNMENTS\/\d+$/;
const SEGMENT_DS_ASSIGNMENT_CACHE = /ds-assignments.*.cqloud.com\/api\/3\/ds-assignments\/rules\/delivery-unit/;
const SEGMENT_DS_ASSIGNMENT_NETWORK = /ds-assignments.*.cqloud.com\/api\/3\/ds-assignments\/rules\/network/;
const SEGMENT_DS_ASSIGNMENT_MANIFEST_ROUTER = /ds-assignments.*.cqloud.com\/api\/3\/ds-assignments\/rules\/manifest-router/;
const SEGMENT_DELEGATION = /^DELEGATION$/;
const SEGMENT_DELEGATION_RECORDS = /static-dns.*.cqloud.com\/api\/1\/records/;
const SEGMENT_ROUTING_AND_MONITORING = /^ROUTING-AND-MONITORING$/;
const SEGMENT_ROUTING_AND_MONITORING_DNS_ROUTING_SEGMENTS = /cdns.*cqloud.com\/api\/1\/cdns\/[\w-]+\/dns-routing-segments/;
const SEGMENT_ROUTING_AND_MONITORING_ROUTER_GROUPS = /cdns.*cqloud.com\/api\/1\/cdns\/[\w-]+\/http-router-groups/;
const SEGMENT_ROUTING_AND_MONITORING_MONITORING_SEGMENTS = /cdns.*cqloud.com\/api\/1\/cdns\/[\w-]+\/monitoring-segments/;
const SEGMENT_ROUTING_AND_MONITORING_MANIFEST_ROUTER = /ds-assignments.*.cqloud.com\/api\/3\/ds-assignments\/rules\/manifest-router/;
const SEGMENT_ROUTING_AND_MONITORING_DNS_ROUTERS = /traffic-routers-monitors.*.cqloud.com\/api\/[\d\.]+\/cdns\/[\w-]+\/dns-routers/;
const SEGMENT_ROUTING_AND_MONITORING_HEALTH_COLLECTORS = /traffic-routers-monitors.*.cqloud.com\/api\/[\d\.]+\/cdns\/[\w-]+\/health-collectors/;
const SEGMENT_ROUTING_AND_MONITORING_HTTP_ROUTERS = /traffic-routers-monitors.*.cqloud.com\/api\/[\d\.]+\/cdns\/[\w-]+\/http-router/;

const segmentMatchers: SegmentMatcher[] = [
  {
    type: ContextDiffEntityTypeEnum.CDN,
    keyMatcher: (key) => !!key.match(SEGMENT_CDN),
    nameExtractor: () => "CDN details",
    listMatchers: [
      {
        type: ContextDiffEntityTypeEnum.CDN,
        name: ListNameEnum.CDN_DETAILS,
        keyMatcher: (key) => !!key.match(SEGMENT_CDN_LIST_DETAILS),
        itemsExtractor: (parentId, root) => [{ id: root["cdnId"], name: root["name"], content: root }],
      },
    ],
  },
  {
    type: ContextDiffEntityTypeEnum.NETWORK,
    keyMatcher: (key) => !key.endsWith("/0") && !!key.match(SEGMENT_NETWORK),
    nameExtractor: (segmentKey: string, root, entitiesNameById) => {
      const key = segmentKey.match(/\/(\d+)$/)?.[1];

      let name = "N/A";
      if (key) {
        name = entitiesNameById.networks[key] ?? name;
      }

      return "Network - " + name;
    },
    listMatchers: [
      {
        type: ContextDiffEntityTypeEnum.CACHE_GROUP,
        name: "Cache Groups",
        keyMatcher: (key) => !!key.match(SEGMENT_NETWORK_LIST_CACHE_GROUPS),
        itemsExtractor: (parentId, root) =>
          root["duGroups"].map((item: UnknownObject) => ({
            id: item["duGroupId"],
            name: item["name"],
            content: item,
          })),
      },
      {
        type: ContextDiffEntityTypeEnum.CACHE,
        name: "Caches",
        keyMatcher: (key) => !!key.match(SEGMENT_NETWORK_LIST_CACHES),
        itemsExtractor: (parentId, root) =>
          root["deliveryUnits"].map((item: UnknownObject) => ({
            id: item["deliveryUnitId"],
            name: item["name"],
            content: item,
          })),
      },
      {
        type: ContextDiffEntityTypeEnum.QN_INFRA,
        name: "QNs",
        keyMatcher: (key) => !!key.match(SEGMENT_NETWORK_LIST_QN_INFRA),
        itemsExtractor: (parentId, root) =>
          root["caches"].map((item: UnknownObject) => ({
            id: item["systemId"],
            name: item["systemId"],
            content: item,
          })),
      },
      {
        type: ContextDiffEntityTypeEnum.NETWORK,
        name: "Network Details",
        keyMatcher: (key) => !!key.match(SEGMENT_NETWORK_LIST_DETAILS),
        itemsExtractor: (parentId, root) =>
          root["entities"].map((item: UnknownObject) => ({
            id: item["id"],
            name: item["name"],
            content: item,
          })),
      },
    ],
  },
  {
    type: ContextDiffEntityTypeEnum.DS,
    keyMatcher: (key) => !!key.match(SEGMENT_DS),
    nameExtractor: (segmentKey, root, entitiesNameById) => {
      const key = segmentKey.match(/\/([\d\w]+)$/)?.[1];

      let name = "N/A";
      if (key) {
        name = entitiesNameById.deliveryServices[key] ?? name;
      }

      return "DS - " + name;
    },
    listMatchers: [
      {
        type: ContextDiffEntityTypeEnum.DS,
        name: ListNameEnum.DS_DETAILS,
        keyMatcher: (key) => !!key.match(SEGMENT_DS_LIST_DETAILS),
        itemsExtractor: (parentId, root) => [{ id: root["dsId"], name: root["name"], content: root }],
      },
      {
        type: ContextDiffEntityTypeEnum.DS_REVISION_LABEL,
        name: ListNameEnum.DS_REVISION_LABEL,
        keyMatcher: (key) =>
          !!key.match(/delivery-services.*.cqloud.com\/api\/4\/delivery-services\/[\w-]+\/label-mapping$/),
        itemsExtractor: (parentId, root) =>
          Object.keys(root).map((name: string) => ({
            id: name + "_" + root[name],
            name: name,
            content: { [name]: root[name] },
          })),
      },
      {
        type: ContextDiffEntityTypeEnum.DS_REVISION,
        name: ListNameEnum.DS_REVISION,
        keyMatcher: (key) =>
          !!key.match(/delivery-services.*.cqloud.com\/api\/4\/delivery-services\/[\w-]+\/revisions\/[\w-]+$/),
        itemsExtractor: (parentId, root) => [{ id: root["dsId"], name: root["creationTimeFormatted"], content: root }],
      },
    ],
  },
  {
    type: ContextDiffEntityTypeEnum.DS_ASSIGNMENT,
    keyMatcher: (key) => !!key.match(SEGMENT_DS_ASSIGNMENT),
    nameExtractor: (segmentKey: string, root, entitiesNameById) => {
      const key = segmentKey.match(/\/(\d+)$/)?.[1];

      let name = "N/A";
      if (key) {
        name = entitiesNameById.networks[key] ?? name;
      }

      return "DS Assignments - " + name;
    },
    listMatchers: [
      {
        type: ContextDiffEntityTypeEnum.DS_ASSIGNMENT_CACHE,
        name: ListNameEnum.DS_ASSIGNMENT_CACHE,
        keyMatcher: (key) => !!key.match(SEGMENT_DS_ASSIGNMENT_CACHE),
        itemsExtractor: (parentId, root) =>
          root["deliveryUnit"].map(
            (item: UnknownObject) =>
              ({
                id: item["ruleId"],
                name: `Cache ${item["deliveryUnitId"]} - Label: ${item["deliveryService"]["label"]} For DS: ${item["deliveryService"]["id"]}`,
                content: item,
              } as RawItem)
          ),
      },
      {
        type: ContextDiffEntityTypeEnum.DS_ASSIGNMENT_NETWORK,
        name: ListNameEnum.DS_ASSIGNMENT_NETWORK,
        keyMatcher: (key) => !!key.match(SEGMENT_DS_ASSIGNMENT_NETWORK),
        itemsExtractor: (parentId, root) =>
          root["network"].map(
            (item: UnknownObject) =>
              ({
                id: item["ruleId"],
                name: `Network - Label: ${item["deliveryService"]["label"]} For DS: ${item["deliveryService"]["id"]}`,
                content: item,
              } as RawItem)
          ),
      },
      {
        type: ContextDiffEntityTypeEnum.ROUTING_MANIFEST_ROUTERS_ASSIGNMENTS,
        name: ListNameEnum.ROUTING_MANIFEST_ROUTERS_ASSIGNMENTS,
        keyMatcher: (key) => !!key.match(SEGMENT_DS_ASSIGNMENT_MANIFEST_ROUTER),
        itemsExtractor: (parentId, root) =>
          root["manifestRouter"].map(
            (item: UnknownObject) =>
              ({
                id: item["ruleId"],
                name: item["manifestRouterId"],
                content: item,
              } as RawItem)
          ),
      },
    ],
  },
  {
    type: ContextDiffEntityTypeEnum.DELEGATION,
    keyMatcher: (key) => !!key.match(SEGMENT_DELEGATION),
    nameExtractor: () => {
      return "Delegation";
    },
    listMatchers: [
      {
        type: ContextDiffEntityTypeEnum.DELEGATION_STATIC_DNS_RECORD,
        name: ListNameEnum.DELEGATION_STATIC_DNS_RECORDS,
        keyMatcher: (key) => !!key.match(SEGMENT_DELEGATION_RECORDS),
        itemsExtractor: (parentId, root) =>
          root["staticDnsResponseList"].map(
            (item: UnknownObject) =>
              ({
                id: item["dnsRecordId"],
                name: `DS: ${item["deliveryServiceId"]} - Name: ${item["name"]}`,
                content: item,
              } as RawItem)
          ),
      },
    ],
  },
  {
    type: ContextDiffEntityTypeEnum.ROUTING_AND_MONITORING,
    keyMatcher: (key) => !!key.match(SEGMENT_ROUTING_AND_MONITORING),
    nameExtractor: () => {
      return ListNameEnum.ROUTING_AND_MONITORING;
    },
    listMatchers: [
      {
        type: ContextDiffEntityTypeEnum.ROUTING_DNS_ROUTING_SEGMENTS,
        name: ListNameEnum.ROUTING_DNS_ROUTING_SEGMENTS,
        keyMatcher: (key) => !!key.match(SEGMENT_ROUTING_AND_MONITORING_DNS_ROUTING_SEGMENTS),
        itemsExtractor: (parentId, root) =>
          root["dnsRoutingSegments"].map(
            (item: UnknownObject) =>
              ({
                id: item["dnsRoutingSegmentId"],
                name: item["dnsRoutingSegmentId"],
                content: item,
              } as RawItem)
          ),
      },
      {
        type: ContextDiffEntityTypeEnum.ROUTING_ROUTER_GROUPS,
        name: ListNameEnum.ROUTING_ROUTER_GROUPS,
        keyMatcher: (key) => !!key.match(SEGMENT_ROUTING_AND_MONITORING_ROUTER_GROUPS),
        itemsExtractor: (parentId, root) =>
          root["httpRouterGroups"].map(
            (item: UnknownObject) =>
              ({
                id: item["httpRouterGroupId"],
                name: item["httpRouterGroupName"],
                content: item,
              } as RawItem)
          ),
      },
      {
        type: ContextDiffEntityTypeEnum.ROUTING_MONITORING_SEGMENTS,
        name: ListNameEnum.ROUTING_MONITORING_SEGMENTS,
        keyMatcher: (key) => !!key.match(SEGMENT_ROUTING_AND_MONITORING_MONITORING_SEGMENTS),
        itemsExtractor: (parentId, root) =>
          root["monitoringSegments"].map(
            (item: UnknownObject) =>
              ({
                id: item["monitoringSegmentId"],
                name: item["monitoringSegmentId"],
                content: item,
              } as RawItem)
          ),
      },
      {
        type: ContextDiffEntityTypeEnum.ROUTING_MANIFEST_ROUTERS_ASSIGNMENTS,
        name: ListNameEnum.ROUTING_MANIFEST_ROUTERS_ASSIGNMENTS,
        keyMatcher: (key) => !!key.match(SEGMENT_ROUTING_AND_MONITORING_MANIFEST_ROUTER),
        itemsExtractor: (parentId, root) =>
          root["manifestRouter"].map((item: UnknownObject) => {
            const routerId = item["manifestRouterId"];
            const dsId = item["deliveryService"]["id"];
            const name = `${routerId} - ${dsId}`;
            return {
              // NOTE: name is used on purpose as id so even if rule changes, we'll show it a single item
              // that allows us to show item whose label changed (which always creates a new rule) as a modified item
              // and not as "deleted" and "added" item
              id: name,
              name: name,
              content: item,
            } as RawItem;
          }),
      },
      {
        type: ContextDiffEntityTypeEnum.ROUTING_DNS_ROUTERS,
        name: ListNameEnum.ROUTING_DNS_ROUTERS,
        keyMatcher: (key) => !!key.match(SEGMENT_ROUTING_AND_MONITORING_DNS_ROUTERS),
        itemsExtractor: (parentId, root) =>
          root["dnsRouters"].map(
            (item: UnknownObject) =>
              ({
                id: item["systemId"],
                name: item["systemId"],
                content: item,
              } as RawItem)
          ),
      },
      {
        type: ContextDiffEntityTypeEnum.ROUTING_HEALTH_COLLECTORS,
        name: ListNameEnum.ROUTING_HEALTH_COLLECTORS,
        keyMatcher: (key) => !!key.match(SEGMENT_ROUTING_AND_MONITORING_HEALTH_COLLECTORS),
        itemsExtractor: (parentId, root) =>
          root["healthCollectors"].map(
            (item: UnknownObject) =>
              ({
                id: item["systemId"],
                name: item["systemId"],
                content: item,
              } as RawItem)
          ),
      },
      {
        type: ContextDiffEntityTypeEnum.ROUTING_HTTP_ROUTERS,
        name: ListNameEnum.ROUTING_HTTP_ROUTERS,
        keyMatcher: (key) => !!key.match(SEGMENT_ROUTING_AND_MONITORING_HTTP_ROUTERS),
        itemsExtractor: (parentId, root) =>
          root["httpRouters"].map(
            (item: UnknownObject) =>
              ({
                id: item["systemId"],
                name: item["systemId"],
                content: item,
              } as RawItem)
          ),
      },
    ],
  },
];
