import { loggerCreator } from "@qwilt/common/utils/logger";
import { mockUtils } from "@qwilt/common/utils/mockUtils";
import { DeliveryServiceEntity } from "../../../../_domain/deliveryServiceEntity";
import { SelectionModeEnum } from "@qwilt/common/utils/hierarchyUtils";
import { MissingAgreementLinkEntity } from "../../../../_domain/missingAgreementLinkEntity";
import { NameWithId } from "@qwilt/common/domain/nameWithId";
import { Notifier } from "@qwilt/common/utils/notifications/notifier";

// noinspection JSUnusedLocalSymbols
const moduleLogger = loggerCreator("__filename");

interface AssignmentRule {
  ruleId: string;
  assignmentBlocked: boolean | undefined;
  assignment: string | undefined;
}
//strings instead of booleans because of react-select bug with boolean values in dropdown
interface RoutingRule {
  ruleId: string;
  routingEnabled: boolean;
}

export type RuleType =
  | "cdn"
  | "network"
  | "manifest-router"
  | "cache"
  | "cache-group-edge"
  | "cache-group-mid"
  | "cache-group-both";

interface DsRuleEntityParams {
  deliveryService: DeliveryServiceEntity;
  cdnId: string;

  children?: DsRuleEntity[];
  parent?: DsRuleEntity;

  id: string;
  name: string;
  systemId?: string;
  selection: SelectionModeEnum;
  // selfSelection is used by networks: network has a self selection that doesn't get affected by its children
  selfSelection: SelectionModeEnum;
  ruleType: RuleType;
  isValid: boolean | undefined;
  invalidAlert: string | undefined;
  routingRule: RoutingRule;
  assignmentRule: AssignmentRule;
  orphanDeliveryUnitId: string | undefined; // indicates orphan assignment of DU
  missingAgreementLink?: MissingAgreementLinkEntity;
}

export class DsRuleEntity {
  constructor(data: DsRuleEntityParams) {
    Object.assign(this, data);
  }

  get isInCacheGroupMid(): boolean {
    return this.ruleType === "cache-group-mid" || !!this.parent?.isInCacheGroupMid;
  }
  get hasChildren() {
    return this.children && this.children.length > 0;
  }

  get isNotCacheGroup() {
    return (
      this.ruleType !== "cache-group-edge" &&
      this.ruleType !== "cache-group-mid" &&
      this.ruleType !== "cache-group-both"
    );
  }

  get isSelected() {
    return this.isNotCacheGroup && this.selectionMode === SelectionModeEnum.SELECTED;
  }

  get selectionMode() {
    if (this.ruleType === "network") {
      return this.selfSelection;
    } else {
      return this.selection;
    }
  }

  get networkDetails(): undefined | NameWithId<number> {
    let result: undefined | NameWithId<number>;

    if (this.ruleType === "network") {
      try {
        const networkId = parseInt(this.id);
        result = new NameWithId({ id: networkId, name: this.name });
      } catch (e) {
        Notifier.warn("Network ID is expected to be a number: " + this.id);
      }
    } else if (this.parent) {
      result = this.parent.networkDetails;
    } else {
      result = undefined;
    }

    return result;
  }

  // Mock
  static createMock(overrides?: Partial<DsRuleEntityParams>, id: number = mockUtils.sequentialId()) {
    const cdnId = "cdn_100";
    const deliveryService = new DeliveryServiceEntity({
      id: "5dc81825791b35000113d234",
      name: "Vitaly-test",
      description: "a2",
      isActive: false,
      revisions: [{ id: "mockId", labels: ["Test Label"], creationTimeFormatted: "10-10-2019" }],
      updatedRevisionsCreationTime: true,
      missingAgreementLinks: [],
    });

    return new DsRuleEntity({
      id: id.toString(),
      name: "network_" + id.toString(),
      cdnId: cdnId,
      deliveryService: DeliveryServiceEntity.createMock(),
      selection: SelectionModeEnum.NOT_SELECTED,
      selfSelection: SelectionModeEnum.NOT_SELECTED,
      children: [
        new DsRuleEntity({
          id: "84eea49e-1d13-4030-9f99-6e4eb08add46",
          name: "Cg-edge-10086-rome-interloaddddddd",
          selection: SelectionModeEnum.NOT_SELECTED,
          selfSelection: SelectionModeEnum.SELECTED,
          children: [
            new DsRuleEntity({
              id: "du-1",
              name: "3T0DF5J-du",
              systemId: "3T0DF5J",
              selection: SelectionModeEnum.NOT_SELECTED,
              selfSelection: SelectionModeEnum.NOT_SELECTED,
              children: [],
              isValid: true,
              invalidAlert: "No Network Assignment Rule",
              ruleType: "cache",
              assignmentRule: { assignment: "Test Label", assignmentBlocked: false, ruleId: "2" },
              routingRule: { routingEnabled: true, ruleId: "" },
              cdnId: cdnId,
              deliveryService: deliveryService,
              orphanDeliveryUnitId: undefined,
            }),
            new DsRuleEntity({
              id: "du-4",
              name: "4683ZX1-du",
              systemId: "4683ZX1",
              selection: SelectionModeEnum.NOT_SELECTED,
              selfSelection: SelectionModeEnum.NOT_SELECTED,
              children: [],
              isValid: true,
              invalidAlert: "No Network Assignment Rule",
              ruleType: "cache",
              assignmentRule: { assignment: "Test Label", assignmentBlocked: false, ruleId: "5" },
              routingRule: { routingEnabled: true, ruleId: "" },
              cdnId: cdnId,
              deliveryService: deliveryService,
              orphanDeliveryUnitId: undefined,
            }),
            new DsRuleEntity({
              id: "du-3",
              name: "testQn008-du",
              systemId: "testQn008",
              selection: SelectionModeEnum.NOT_SELECTED,
              selfSelection: SelectionModeEnum.NOT_SELECTED,
              children: [],
              isValid: true,
              invalidAlert: "No Network Assignment Rule",
              ruleType: "cache",
              assignmentRule: { assignment: "Test Label", assignmentBlocked: false, ruleId: "4" },
              routingRule: { routingEnabled: true, ruleId: "" },
              cdnId: cdnId,
              deliveryService: deliveryService,
              orphanDeliveryUnitId: undefined,
            }),
          ],
          isValid: true,
          invalidAlert: "",
          ruleType: "cache-group-edge",
          assignmentRule: { assignment: "", ruleId: "", assignmentBlocked: false },
          routingRule: { routingEnabled: true, ruleId: "" },
          cdnId: cdnId,
          deliveryService: deliveryService,
          orphanDeliveryUnitId: undefined,
          systemId: "blabla",
          missingAgreementLink: undefined,
          parent: undefined,
        }),
      ],
      isValid: true,
      invalidAlert: "",
      ruleType: "network",
      assignmentRule: { assignment: "", ruleId: "", assignmentBlocked: false },
      routingRule: { routingEnabled: true, ruleId: "" },
      missingAgreementLink: undefined,
      parent: undefined,
      systemId: "alala",
      orphanDeliveryUnitId: undefined,
      ...overrides,
    });
  }
}

// utility - merges parameters as class members
export interface DsRuleEntity extends DsRuleEntityParams {}
