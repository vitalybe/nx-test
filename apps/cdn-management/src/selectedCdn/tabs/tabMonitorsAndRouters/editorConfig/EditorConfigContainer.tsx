import * as React from "react";
import styled from "styled-components";
import { loggerCreator } from "common/utils/logger";
import { QueryDataContainer } from "common/components/queryDataContainer/QueryDataContainer";
import { CdnEntity } from "src/_domain/cdnEntity";
import { EditorConfig } from "src/selectedCdn/tabs/tabMonitorsAndRouters/editorConfig/EditorConfig";
import { PrepareQueryResult } from "common/utils/reactQueryUtils/prepareQueryResult";
import { TrafficRoutersMonitorsApi } from "common/backend/trafficRoutersMonitors";

const moduleLogger = loggerCreator(__filename);

//region [[ Styles ]]

const QueryDataContainerStyled = styled(QueryDataContainer)`
  height: 100%;
` as typeof QueryDataContainer;

//endregion [[ Styles ]]

//region [[ Props ]]

export interface Props {
  cdn: CdnEntity;
  mode: "routers" | "monitors";

  onClose: () => void;

  className?: string;
}

//endregion [[ Props ]]

export const EditorConfigContainer = (props: Props) => {
  const editorConfigQuery = new PrepareQueryResult({
    name: EditorConfigContainer.queryName,
    provide: async () => {
      return await TrafficRoutersMonitorsApi.instance.getConfig(props.mode, props.cdn.name);
    },
  }).useQuery();

  return (
    <QueryDataContainerStyled className={props.className} queryMetadata={editorConfigQuery}>
      {(config: object) => <EditorConfig {...props} config={config} />}
    </QueryDataContainerStyled>
  );
};

EditorConfigContainer.queryName = "EditorConfigContainer";
