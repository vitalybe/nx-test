export type ApiEntityRuleType = "cdn" | "network" | "delivery-unit" | "manifest-router";

interface DsApiType {
  id: string;
  label?: string;
}

export interface DeliveryUnitRuleApiType {
  deliveryUnitId: string;
}

export interface ManifestRouterRuleApiType {
  manifestRouterId: string;
}

export interface NetworkRuleApiType {
  networkId: number;
}

export interface ApiRuleRouting extends ApiDsRule {
  routingEnabled: boolean;
  deliveryServiceId: string;
}

export interface ApiRuleAssignment extends ApiDsRule {
  assignmentBlocked?: boolean;
  enabled?: boolean;
  deliveryService: DsApiType;
}

export interface ApiDsRule {
  ruleId: string;
  cdnId: string;
}

export interface AssignmentsApiType {
  rules: {
    network: (NetworkRuleApiType & ApiRuleAssignment)[];
    deliveryUnit: (DeliveryUnitRuleApiType & ApiRuleAssignment)[];
    manifestRouter: (ManifestRouterRuleApiType & ApiRuleAssignment)[];
  };
}

export interface RoutingDuApiType {
  deliveryUnit: (DeliveryUnitRuleApiType & ApiRuleRouting)[];
}

export interface RoutingNetworkApiType {
  network: (NetworkRuleApiType & ApiRuleRouting)[];
}
