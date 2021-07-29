import * as React from "react";
import styled from "styled-components";
import { loggerCreator } from "common/utils/logger";
import { QueryDataContainer } from "common/components/queryDataContainer/QueryDataContainer";
import { TabCaches } from "src/selectedCdn/tabs/tabCaches/TabCaches";
import { useSelectedCdn } from "src/_stores/selectedCdnStore";
import { TabCachesProvider } from "src/selectedCdn/tabs/tabCaches/_providers/tabCachesProvider";

const moduleLogger = loggerCreator(__filename);

//region [[ Styles ]]

const QueryDataContainerStyled = styled(QueryDataContainer)`
  height: 100%;
` as typeof QueryDataContainer;

//endregion [[ Styles ]]

//region [[ Props ]]

export interface Props {
  className?: string;
}

//endregion [[ Props ]]

export const TabCachesContainer = (props: Props) => {
  const cdn = useSelectedCdn();
  const query = TabCachesProvider.instance.prepareQuery(cdn.id).useQuery();

  return (
    <QueryDataContainerStyled className={props.className} queryMetadata={query}>
      {(result) => (
        <TabCaches
          networks={result.networks}
          caches={result.caches}
          availableQns={result.availableQns}
          cacheGroups={result.cacheGroups}
        />
      )}
    </QueryDataContainerStyled>
  );
};
