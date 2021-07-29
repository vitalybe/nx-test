export interface RouterSelectionRuleApiEditType {
  delegationLocationTargetId: string;
  // mutually exclusive
  asn: number | null;
  ispId: string | null;
  footprintElementId: string | null;
}

interface RouterSelectionRuleApiType extends RouterSelectionRuleApiEditType {
  id: string;
}

export interface RouterSelectionRulesApiResult {
  rules: Record<string, RouterSelectionRuleApiType>;
}
