import * as React from "react";
import styled from "styled-components";
import { loggerCreator } from "@qwilt/common/utils/logger";
import { QueryDataContainer } from "@qwilt/common/components/queryDataContainer/QueryDataContainer";
import { PrepareQueryResult } from "@qwilt/common/utils/reactQueryUtils/prepareQueryResult";
import { EditorCacheGroup } from "./EditorCacheGroup";
import { CacheGroupsProvider } from "../../../../_providers/cacheGroupsProvider";
import { CacheGroupEntity } from "../../../../_domain/cacheGroupEntity";
import { NetworksProvider } from "../../../../_providers/networksProvider";
import { CdnEntity } from "../../../../_domain/cdnEntity";
import { CachesProvider } from "../../../../_providers/cachesProvider";

const moduleLogger = loggerCreator("__filename");

//region [[ Styles ]]

const QueryDataContainerStyled = styled(QueryDataContainer)`
  height: 100%;
` as typeof QueryDataContainer;

//endregion [[ Styles ]]

//region [[ Props ]]

export interface Props {
  cdn: CdnEntity;
  editedEntity: CacheGroupEntity | undefined;
  onClose: () => void;

  className?: string;
}

//endregion [[ Props ]]

export const EditorCacheGroupContainer = (props: Props) => {
  const editorCacheGroupQuery = new PrepareQueryResult({
    name: "EditorCacheGroupContainer",
    params: [props.cdn.id],
    provide: async (key) => {
      const cacheGroups = await CacheGroupsProvider.instance.prepareQuery(props.cdn.id).fetchQueryAsDependency(key);
      const caches = await CachesProvider.instance.prepareQuery(props.cdn.id).fetchQueryAsDependency(key);
      const networks = await NetworksProvider.instance.prepareQuery().fetchQueryAsDependency(key);

      return {
        cacheGroups,
        networks,
        caches,
      };
    },
  }).useQuery();

  return (
    <QueryDataContainerStyled className={props.className} queryMetadata={editorCacheGroupQuery}>
      {(result) => (
        <EditorCacheGroup
          editedEntity={props.editedEntity}
          allCacheGroups={result.cacheGroups}
          allNetworks={result.networks}
          cachesInGroupAmount={result.caches.filter((cache) => cache.group?.id === props.editedEntity?.id).length}
          cdnId={props.cdn.id}
          onClose={props.onClose}
        />
      )}
    </QueryDataContainerStyled>
  );
};
