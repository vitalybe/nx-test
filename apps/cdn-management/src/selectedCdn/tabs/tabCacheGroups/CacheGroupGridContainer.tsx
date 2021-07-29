import * as React from "react";
import styled from "styled-components";
import { loggerCreator } from "common/utils/logger";
import { CacheGroupsProvider } from "src/_providers/cacheGroupsProvider";
import { QueryDataContainer } from "common/components/queryDataContainer/QueryDataContainer";
import { CacheGroupGrid } from "src/selectedCdn/tabs/tabCacheGroups/CacheGroupGrid";
import { useSelectedCdn } from "src/_stores/selectedCdnStore";
import { UseQueryResult } from "react-query/types/react/types";
import { CacheGroupEntity } from "src/_domain/cacheGroupEntity";

const moduleLogger = loggerCreator(__filename);

//region [[ Styles ]]

const CacheGroupGridContainerView = styled(QueryDataContainer)`
  height: 100%;
` as typeof QueryDataContainer;

//endregion [[ Styles ]]

//region [[ Props ]]

export interface Props {
  className?: string;
}

//endregion [[ Props ]]

export const CacheGroupGridContainer = (props: Props) => {
  const cdn = useSelectedCdn();
  const cacheGroupsQuery: UseQueryResult<CacheGroupEntity[]> = CacheGroupsProvider.instance
    .prepareQuery(cdn.id)
    .useQuery();

  return (
    <CacheGroupGridContainerView
      className={props.className}
      queryMetadata={cacheGroupsQuery}
      key={cacheGroupsQuery.dataUpdatedAt}>
      {(cacheGroups) => <CacheGroupGrid cacheGroups={cacheGroups} />}
    </CacheGroupGridContainerView>
  );
};
