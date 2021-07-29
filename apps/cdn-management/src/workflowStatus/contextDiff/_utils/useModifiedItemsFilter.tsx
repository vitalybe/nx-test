import { loggerCreator } from "common/utils/logger";
import { useMemo } from "react";
import { ContextDiffBaseEntity } from "src/workflowStatus/contextDiff/_domain/contextDiffDomainShared";

const moduleLogger = loggerCreator(__filename);

export function useModifiedItemsFilter<T extends ContextDiffBaseEntity>(items: T[], isShowUnmodified: boolean): T[] {
  return useMemo(() => {
    const modifiedItems = items.filter((item) => item.hasModifications);
    const unmodifiedItems = isShowUnmodified ? items.filter((item) => !item.hasModifications) : [];

    return modifiedItems.concat(unmodifiedItems);
  }, [isShowUnmodified, items]);
}
