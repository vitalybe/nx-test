interface SelectionFullParams {
  selectionType: "Full";
}

interface SelectionByPercent {
  selectionType: "ByPercentage";
  byPercentageParams: {
    percent: number;
  };
}

interface SelectionSelectiveParams {
  selectionType: "Selective";
  selectionRules: Array<{
    firstXIps?: number;
    footprintElementId: string;
  }>;
}

interface BaseType {
  serviceName: string;
  ispId: string;
  enabled: boolean;
}

export type DelegationSelectionApiEditType = BaseType &
  (SelectionFullParams | SelectionByPercent | SelectionSelectiveParams);

export type DelegationSelectionApiType = { id: string } & DelegationSelectionApiEditType;

export interface DelegationSelectionsApiResult {
  rules: Record<string, DelegationSelectionApiType>;
}
