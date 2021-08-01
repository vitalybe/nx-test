import * as React from "react";
import styled from "styled-components";
import { loggerCreator } from "@qwilt/common/utils/logger";
import { QueryDataContainer } from "@qwilt/common/components/queryDataContainer/QueryDataContainer";
import { PrepareQueryResult } from "@qwilt/common/utils/reactQueryUtils/prepareQueryResult";
import { CdnEntity } from "../../../../_domain/cdnEntity";
import { MonitorSegmentsEditor } from "./MonitorSegmentsEditor";
import { ProjectUrlStore } from "../../../../_stores/projectUrlStore";
import { ProjectUrlParams } from "../../../../_stores/projectUrlParams";
import { HealthCollectorsProvider } from "../../tabMonitorsAndRouters/subTabs/healthCollectorsTab/_providers/healthCollectorsProvider";
import { ServersProvider } from "../../tabMonitorsAndRouters/_providers/oldServersProvider";
import { ServerType } from "@qwilt/common/backend/trafficRoutersMonitors/_types/trafficRoutersMonitorsTypes";
import { MonitorSegmentEntity } from "../_domain/MonitorSegmentEntity";

const moduleLogger = loggerCreator("__filename");

//region [[ Styles ]]

const QueryDataContainerStyled = styled(QueryDataContainer)`
  height: 100%;
` as typeof QueryDataContainer;

//endregion [[ Styles ]]

//region [[ Props ]]

export interface Props {
  cdn: CdnEntity;

  editedItem: MonitorSegmentEntity | undefined;
  onClose: () => void;

  className?: string;
}

//endregion [[ Props ]]

export const MonitorSegmentsEditorContainer = (props: Props) => {
  const monitorSegmentsEditorQuery = new PrepareQueryResult({
    name: "MonitorSegmentsEditorContainer",
    params: [props.cdn.id],
    provide: async () => {
      return await fetchHealthCollectorSystemIds(props.cdn.name);
    },
  }).useQuery();

  return (
    <QueryDataContainerStyled className={props.className} queryMetadata={monitorSegmentsEditorQuery}>
      {(allHealthCollectorIds) => <MonitorSegmentsEditor {...props} allHealthCollectorIds={allHealthCollectorIds} />}
    </QueryDataContainerStyled>
  );
};

//region [Utils]
async function fetchHealthCollectorSystemIds(name: string): Promise<string[]> {
  const flagMoreConfigurations = ProjectUrlStore.getInstance().getParamExists(
    ProjectUrlParams.tempFlag_serversTabMoreConfigurations
  );

  let systemIds: string[];

  if (flagMoreConfigurations) {
    const healthCollectors = await HealthCollectorsProvider.instance.provide(name);
    systemIds = healthCollectors.map((healthCollector) => healthCollector.systemId) ?? [];
  } else {
    const servers = await ServersProvider.instance.provide(name);
    systemIds =
      servers
        .filter((server) => server.type === ServerType.HEALTH_COLLECTOR)
        .map((healthCollector) => healthCollector.systemId) ?? [];
  }

  return systemIds;
}
//endregion
