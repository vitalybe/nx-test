import * as React from "react";
import styled from "styled-components";
import { loggerCreator } from "common/utils/logger";
import { CacheGroupIcon } from "common/components/configuration/configurationIcons";
import { useSelectedCdn } from "src/_stores/selectedCdnStore";
import { CacheGroupsProvider } from "src/_providers/cacheGroupsProvider";
import { TabSelector } from "common/components/configuration/tabSelector/TabSelector";
import { DateTime } from "luxon";

const moduleLogger = loggerCreator(__filename);

//region [[ Styles ]]

const CacheGroupIconStyled = styled(CacheGroupIcon)`
  margin-right: 3px;
  height: 1rem;
  width: 1rem;
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

//endregion [[ Styles ]]

//region [[ Props ]]

export interface Props {
  className?: string;
}

//endregion [[ Props ]]

export const CacheGroupGridTabSelector = (props: Props) => {
  const cdn = useSelectedCdn();
  const prepareQueryResult = CacheGroupsProvider.instance.prepareQuery(cdn.id);
  const cacheGroupsQuery = prepareQueryResult.useQuery();

  return (
    <TabSelector
      title={"Cache Groups"}
      isLoading={cacheGroupsQuery.isFetching}
      onRefresh={() => prepareQueryResult.invalidateWithChildrenAndParents()}
      lastLoadDate={DateTime.fromMillis(cacheGroupsQuery.dataUpdatedAt)}
      subtitle={
        <InfoRow>
          <CacheGroupIconStyled />
          {cacheGroupsQuery.data?.length}
        </InfoRow>
      }
      className={props.className}
    />
  );
};
