import * as _ from "lodash";
import { loggerCreator } from "@qwilt/common/utils/logger";
import { AjaxMetadata } from "@qwilt/common/utils/ajax";
import { DiffMetadataEntity } from "../_domain/diffMetadataEntity";
import { DiffRequestEntity } from "../_domain/diffRequestEntity";
import { ProvisionFlowsApi } from "@qwilt/common/backend/provisionFlows";
import { Notifier } from "@qwilt/common/utils/notifications/notifier";
import { DiffSectionDefinition } from "../_domain/diffSection";
import { StepOutputApiResult } from "@qwilt/common/backend/provisionFlows/_types/provisionFlowsTypes";
import { Utils } from "@qwilt/common/utils/utils";
import { UnknownObject } from "@qwilt/common/utils/typescriptUtils";
import { ActiveWorkflowProvider } from "../../_providers/activeWorkflowProviderProvider";
import { IdReplacer } from "../../contextDiff/_utils/idReplacer";

const moduleLogger = loggerCreator("__filename");

const sectionsDefinitions: DiffSectionDefinition[] = [
  { name: "certificates", identifierGetter: (obj) => obj["certificateId"] },
  { name: "deliveryUnits", identifierGetter: (obj) => obj["deliveryUnitId"] },
  { name: "dnsManagers", identifierGetter: (obj) => obj["systemId"] },
  { name: "dnsRouters", identifierGetter: (obj) => obj["systemId"] },
  { name: "dnsRoutingSegments", identifierGetter: (obj) => obj["dnsRoutingSegmentId"] },
  {
    name: "dsDerivations",
    identifierGetter: (obj) => {
      const derivationId = obj["derivationId"];
      if (derivationId) {
        // eslint-disable-next-line unused-imports/no-unused-vars
        const [dsId, revisionId, ...rest] = derivationId.split("/");
        const label: string = ((obj["debug"] as unknown) as Record<string, string>)["label"];
        return [dsId, label, ...rest].join("/");
      }
    },
  },
  { name: "duGroups", identifierGetter: (obj) => obj["duGroupId"] },
  { name: "healthCollectors", identifierGetter: (obj) => obj["systemId"] },
  { name: "httpRouterGroups", identifierGetter: (obj) => obj["httpRouterGroupId"] },
  { name: "httpRouters", identifierGetter: (obj) => obj["systemId"] },
  { name: "monitoringSegments", identifierGetter: (obj) => obj["monitoringSegmentId"] },
  { name: "networks", identifierGetter: (obj) => obj["networkId"] },
  { name: "routingRules", identifierGetter: (obj) => obj["ruleId"] },
  { name: "serverAssignments", identifierGetter: (obj) => `${obj["targetId"]}_${obj["dsId"]}` },
  { name: "staticDnsEntries", identifierGetter: (obj) => obj["entityId"] },
  { name: "trafficMonitors", identifierGetter: (obj) => obj["systemId"] },
  { name: "trafficRoutersParams", identifierGetter: (obj) => obj["id"] },
];

export class DiffWorkflowsProvider {
  private constructor() {}

  provide = async (diffRequest: DiffRequestEntity, metadata: AjaxMetadata): Promise<DiffMetadataEntity> => {
    const rightWorkflow = diffRequest.rightWorkflow;
    let leftWorkflow = diffRequest.leftWorkflow;
    if (!leftWorkflow) {
      // if left workflow isn't provided, use the currently active now.
      leftWorkflow = await ActiveWorkflowProvider.instance.provide(diffRequest.cdnId, metadata);
    }

    const [leftOutputResult, rightOutputResult] = await Promise.all([
      leftWorkflow
        ? ProvisionFlowsApi.instance.listStepOutput(diffRequest.cdnId, leftWorkflow.id, diffRequest.stepId, metadata)
        : undefined,
      ProvisionFlowsApi.instance.listStepOutput(diffRequest.cdnId, rightWorkflow.id, diffRequest.stepId, metadata),
    ]);

    const sections = this.getSections(leftOutputResult, rightOutputResult);

    return new DiffMetadataEntity({
      stepId: diffRequest.stepId,
      left: leftWorkflow,
      right: rightWorkflow,
      sections: sections,
    });
  };

  private getSections(leftOutputResult: StepOutputApiResult | undefined, rightOutputResult: StepOutputApiResult) {
    const leftObject: UnknownObject = leftOutputResult
      ? this.replaceIdsWithNames(leftOutputResult.snapshotRepresentation.output)
      : {};
    const rightObject: UnknownObject = this.replaceIdsWithNames(rightOutputResult.snapshotRepresentation.output);
    const allSections = _.orderBy(Object.keys(rightObject));

    return allSections
      .map((sectionName) => {
        try {
          let sectionDefinition: DiffSectionDefinition | undefined = sectionsDefinitions.find(
            (sectionDefinition) => sectionDefinition.name === sectionName
          );
          if (!sectionDefinition) {
            sectionDefinition = { name: sectionName, identifierGetter: () => undefined };
          }

          return DiffMetadataEntity.createDiffSection(
            leftObject,
            rightObject,
            sectionName,
            sectionDefinition.identifierGetter
          );
        } catch (e) {
          Notifier.warn("Failed to create diff section: " + sectionName);
        }
      })
      .filter(Utils.isTruthy);
  }

  replaceIdsWithNames(jsonString: string): UnknownObject {
    let modifiedJson: UnknownObject = JSON.parse(jsonString);

    try {
      modifiedJson = IdReplacer.replaceIds(modifiedJson, ["deliveryUnits"], "deliveryUnitId", "name");
      modifiedJson = this.replaceServerAssignmentRevision(modifiedJson);
    } catch (e) {
      Notifier.error("Failed to replace server IDs", e);
    }

    return modifiedJson;
  }

  replaceServerAssignmentRevision(modifiedJson: UnknownObject): UnknownObject {
    // We're replacing in "serverAssignments" section, the id of the DsRevision with the label in debug.
    // This is done since we don't really care about a revision change in the assignment.
    // "serverAssignments": [
    //   {
    //     "debug": {
    //       "label": "GA",
    //     },
    //     "dsDerivationIds": [
    //       {
    //         "id": "5e135a527d07840001ad6eff/6041921a59305700018bb140/deliveryUnit/default",
    //         "type": "ngds"
    //       }
    //     ],
    //     "revisionId": "6041921a59305700018bb140",
    //   },
    // ],

    try {
      modifiedJson["serverAssignments"] = modifiedJson["serverAssignments"].map((serverAssignment: UnknownObject) => {
        const label = serverAssignment["debug"]["label"];

        return {
          ...serverAssignment,
          revisionId: label,
          dsDerivationIds: serverAssignment.dsDerivationIds.map((dsDerivationId: UnknownObject) => {
            const id = dsDerivationId.id;
            const [dsId, , ...rest] = id.split("/");

            return {
              ...dsDerivationId,
              id: [dsId, label, ...rest].join("/"),
            };
          }),
        };
      });
    } catch (e) {
      Notifier.error("Failed to replace server assignment IDs", e);
    }

    return modifiedJson;
  }

  //region [[ Singleton ]]
  private static _instance: DiffWorkflowsProvider | undefined;
  static get instance(): DiffWorkflowsProvider {
    if (!this._instance) {
      this._instance = new DiffWorkflowsProvider();
    }

    return this._instance;
  }
  //endregion
}
