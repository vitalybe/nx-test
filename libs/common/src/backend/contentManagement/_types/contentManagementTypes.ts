export interface PurgeRuleInvalidationApi {
  type: "INVALIDATION";
  expirationTimeMilli: number;
  invalidationRule: {
    invalidationMethod: "REGEX";
    regexInvalidationMethod: {
      regex: string;
    };
  };
}

export interface PurgeRuleDeletionFullUrlApi {
  deletionMethod: "FULL_URL";
  fullUrlDeletionMethod: {
    fullUrl: string;
  };
}

export interface PurgeRuleDeletionPrefixApi {
  deletionMethod: "PREFIX";
  prefixDeletionMethod: {
    prefix: string;
  };
}

export interface PurgeRuleDeletionApi {
  type: "DELETION";
  expirationTimeMilli: number;
  deletionRule: PurgeRuleDeletionFullUrlApi | PurgeRuleDeletionPrefixApi;
}

export interface PurgeRuleApi {
  ruleId: string;
  ownerOrgId: string;
  creationTimeMilli: number;
  dsId: string;
  rule: PurgeRuleDeletionApi | PurgeRuleInvalidationApi;
}

export type PurgeRuleApiEdit = Omit<PurgeRuleApi, "creationTimeMilli" | "ownerOrgId" | "ruleId">;
