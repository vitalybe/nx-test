import { HealthProviderEntity } from "./subTabs/healthProvidersTab/_domain/healthProviderEntity";

import * as React from "react";
import styled from "styled-components";
import { loggerCreator } from "@qwilt/common/utils/logger";
import { useSelectedCdn } from "../../../_stores/selectedCdnStore";
import { TabSelector } from "@qwilt/common/components/configuration/tabSelector/TabSelector";
import { DateTime } from "luxon";
import { TextTooltip } from "@qwilt/common/components/textTooltip/TextTooltip";
import { HttpRouterGroupsProvider } from "./subTabs/httpRouterGroupsTab/_providers/httpRouterGroupsProvider";
import { PrepareQueryResult } from "@qwilt/common/utils/reactQueryUtils/prepareQueryResult";
import { ServerTypeIcon } from "./_parts/ServerTypeIcon";
import { ServerType } from "@qwilt/common/backend/trafficRoutersMonitors/_types/trafficRoutersMonitorsTypes";
import { MonitorsProvider } from "./subTabs/monitorsTab/_providers/monitorsProvider";
import { DnsRoutersProvider } from "./subTabs/dnsRoutersTab/_providers/dnsRoutersProvider";
import { HttpRoutersProvider } from "./subTabs/httpRoutersTab/_providers/httpRoutersProvider";
import { HealthCollectorsProvider } from "./subTabs/healthCollectorsTab/_providers/healthCollectorsProvider";
import { HealthProvidersProvider } from "./subTabs/healthProvidersTab/_providers/healthProvidersProvider";
import { ProjectUrlStore } from "../../../_stores/projectUrlStore";
import { ProjectUrlParams } from "../../../_stores/projectUrlParams";
import { enumValues } from "@qwilt/common/utils/typescriptUtils";
import { ServerMetadata } from "../../../_domain/serverMetadata";

const moduleLogger = loggerCreator("__filename");

//region [[ Styles ]]

const InfoRow = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.7rem;
`;

const InfoGroup = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const TextTooltipStyled = styled(TextTooltip).attrs({ placement: "bottom", delay: 500 })``;
//endregion [[ Styles ]]

const ServerTypeIconStyled = styled(ServerTypeIcon)`
  margin-right: 3px;
  height: 1rem;
  width: 1rem;
`;

//region [[ Props ]]

export interface Props {
  className?: string;
}

//endregion [[ Props ]]

export const TabMonitorsAndRoutersSelector = (props: Props) => {
  const cdn = useSelectedCdn();

  function getSettledPromiseValue<T>(promiseResult: PromiseFulfilledResult<T> | PromiseRejectedResult): T | undefined {
    return promiseResult.status === "fulfilled" ? promiseResult.value : undefined;
  }

  const prepareQueryResult = new PrepareQueryResult<Record<ServerType, unknown[] | undefined>>({
    name: "TabMonitorsAndRoutersSelector",
    params: [cdn.id],
    provide: async (key) => {
      const flagHealthProviders = ProjectUrlStore.getInstance().getParamExists(
        ProjectUrlParams.tempFlag_healthProviders
      );
      const [monitors, dnsRouters, httpRouterGroups, httpRouters, healthCollectors] = await Promise.allSettled([
        MonitorsProvider.instance.prepareQuery(cdn.name).fetchQueryAsDependency(key),
        DnsRoutersProvider.instance.prepareQuery(cdn.name).fetchQueryAsDependency(key),
        HttpRouterGroupsProvider.instance.prepareQuery(cdn.id).fetchQueryAsDependency(key),
        HttpRoutersProvider.instance.prepareQuery(cdn.name).fetchQueryAsDependency(key),
        HealthCollectorsProvider.instance.prepareQuery(cdn.name).fetchQueryAsDependency(key),
      ]);

      let healthProviders: HealthProviderEntity[] | undefined;
      if (flagHealthProviders) {
        healthProviders = await HealthProvidersProvider.instance.prepareQuery(cdn.id).fetchQueryAsDependency(key);
      }

      return {
        [ServerType.MONITOR]: getSettledPromiseValue(monitors),
        [ServerType.DNS_ROUTER]: getSettledPromiseValue(dnsRouters),
        [ServerType.HTTP_ROUTER_GROUP]: getSettledPromiseValue(httpRouterGroups),
        [ServerType.HTTP_ROUTER]: getSettledPromiseValue(httpRouters),
        [ServerType.HEALTH_COLLECTOR]: getSettledPromiseValue(healthCollectors),
        [ServerType.HEALTH_PROVIDER]: healthProviders,
        [ServerType.MANIFEST_ROUTER]: undefined,
      };
    },
  });

  const flagMoreConfigurations = ProjectUrlStore.getInstance().getParamExists(
    ProjectUrlParams.tempFlag_serversTabMoreConfigurations
  );
  const query = prepareQueryResult.useQuery({ enabled: flagMoreConfigurations });

  return (
    <TabSelector
      title={"Monitors and Routers"}
      isLoading={query.isFetching}
      onRefresh={() => prepareQueryResult.invalidateWithChildrenAndParents()}
      lastLoadDate={DateTime.fromMillis(query.dataUpdatedAt)}
      subtitle={
        flagMoreConfigurations && (
          <InfoRow>
            {query.data &&
              enumValues(ServerType).map((serverType: ServerType) => {
                const collection = query.data[serverType];
                return (
                  collection && (
                    <TextTooltipStyled content={ServerMetadata[serverType].title} key={serverType}>
                      <InfoGroup>
                        <ServerTypeIconStyled type={serverType} />
                        {collection.length}
                      </InfoGroup>
                    </TextTooltipStyled>
                  )
                );
              })}
          </InfoRow>
        )
      }
      className={props.className}
    />
  );
};
