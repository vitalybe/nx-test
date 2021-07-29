import * as React from "react";
import styled from "styled-components";
import { loggerCreator } from "common/utils/logger";
import { QueryDataContainer } from "common/components/queryDataContainer/QueryDataContainer";
import { PrepareQueryResult } from "common/utils/reactQueryUtils/prepareQueryResult";
import { useSelectedCdn } from "src/_stores/selectedCdnStore";
import { EditorCache } from "src/selectedCdn/tabs/tabCaches/editorCache/EditorCache";
import { CacheEntity } from "src/_domain/cacheEntity";
import { CacheGroupsProvider } from "src/_providers/cacheGroupsProvider";
import { MonitorSegmentProvider } from "src/selectedCdn/tabs/tabMonitorSegments/_providers/MonitorSegmentProvider";

const moduleLogger = loggerCreator(__filename);

//region [[ Styles ]]

const QueryDataContainerStyled = styled(QueryDataContainer)`
  height: 100%;
` as typeof QueryDataContainer;

//endregion [[ Styles ]]

//region [[ Props ]]

export interface Props {
  cache: CacheEntity;

  isEdit: boolean;
  isView?: boolean;

  onClose: () => void;

  className?: string;
}

//endregion [[ Props ]]

export const EditorCacheContainer = (props: Props) => {
  const cdn = useSelectedCdn();
  const editorCacheQuery = new PrepareQueryResult({
    name: "EditorCacheContainer",
    params: [cdn.id],
    provide: async (key) => {
      return {
        cacheGroups: await CacheGroupsProvider.instance.prepareQuery(cdn.id).fetchQueryAsDependency(key),
        monitorSegments: await MonitorSegmentProvider.instance.prepareQuery(cdn.id).fetchQueryAsDependency(key),
      };
    },
  }).useQuery();

  return (
    <QueryDataContainerStyled className={props.className} queryMetadata={editorCacheQuery}>
      {(result) => <EditorCache {...props} cacheGroups={result.cacheGroups} monitorSegments={result.monitorSegments} />}
    </QueryDataContainerStyled>
  );
};
