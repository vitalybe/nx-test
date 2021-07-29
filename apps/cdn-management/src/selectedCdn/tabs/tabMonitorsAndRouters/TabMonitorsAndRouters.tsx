import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ServerType } from "common/backend/trafficRoutersMonitors/_types/trafficRoutersMonitorsTypes";
import { Clickable } from "common/components/configuration/clickable/Clickable";
import { ItemsCard } from "common/components/configuration/itemsCard/ItemsCard";
import { CommonColors } from "common/styling/commonColors";
import { Icons } from "common/styling/icons";
import { useUrlArrayState, useUrlState } from "common/utils/hooks/useUrlState";
import { darken } from "polished";
import * as React from "react";
import { ServerTypeIcon } from "src/selectedCdn/tabs/tabMonitorsAndRouters/_parts/ServerTypeIcon";
import { DnsRoutersTabContainer } from "src/selectedCdn/tabs/tabMonitorsAndRouters/subTabs/dnsRoutersTab/DnsRoutersTabContainer";
import { HealthCollectorsTabContainer } from "src/selectedCdn/tabs/tabMonitorsAndRouters/subTabs/healthCollectorsTab/HealthCollectorsTabContainer";
import { HttpRouterGroupsTab } from "src/selectedCdn/tabs/tabMonitorsAndRouters/subTabs/httpRouterGroupsTab/HttpRouterGroupsTab";
import { HttpRoutersTabContainer } from "src/selectedCdn/tabs/tabMonitorsAndRouters/subTabs/httpRoutersTab/HttpRoutersTabContainer";
import { MonitorsTabContainer } from "src/selectedCdn/tabs/tabMonitorsAndRouters/subTabs/monitorsTab/MonitorsTabContainer";
import { RoutersMonitorsTab } from "src/selectedCdn/tabs/tabMonitorsAndRouters/subTabs/routersMonitorsTab/RoutersMonitorsTab";
import { ProjectUrlParams } from "src/_stores/projectUrlParams";
import { ProjectUrlStore } from "src/_stores/projectUrlStore";
import styled, { css } from "styled-components";
import { HealthProvidersTabContainer } from "src/selectedCdn/tabs/tabMonitorsAndRouters/subTabs/healthProvidersTab/HealthProvidersTabContainer";
import { useSelectedCdn } from "src/_stores/selectedCdnStore";
import { openQwiltModal } from "common/components/qwiltModal/QwiltModal";
import { EditorConfigContainer } from "src/selectedCdn/tabs/tabMonitorsAndRouters/editorConfig/EditorConfigContainer";

//region [[Styles]]
const ServerTypeIconStyled = styled(ServerTypeIcon)`
  margin-right: 0.25rem;
`;
const TabRouterMonitorManagementView = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;

  .max__menu {
    z-index: 900;
  }

  .Select.is-open {
    position: relative;
    z-index: 1000;
  }
`;

const ConfigButton = styled(Clickable)`
  cursor: pointer;
  display: flex;
  align-items: flex-start;
  font-size: 1rem;
  line-height: 1.1rem;
  white-space: nowrap;
`;

const TypeOptions = styled(ItemsCard)`
  height: auto;
  display: flex;
  margin-bottom: 10px;
`;

const TypesContainer = styled.div`
  display: flex;
  grid-gap: 0.5rem;
  align-items: center;
`;

const Content = styled.div`
  display: flex;
  justify-content: space-between;
  grid-gap: 0.5rem;
`;

const ConfigButtonIcon = styled(FontAwesomeIcon)`
  margin-left: 0.3em;
`;

const TypeButton = styled.div<{ selected: boolean; type: ServerType }>`
  background-color: ${(props) =>
    props.selected
      ? (props.type === ServerType.MONITOR && darken(0.2, CommonColors.MYSTIC_2)) || darken(0.2, CommonColors.GRAY_4)
      : "none"};
  padding: 0.3125rem;
  border-radius: 5px;
  cursor: pointer;
  display: flex;
  align-items: flex-start;
  font-size: 1rem;
  line-height: 1.1rem;
  min-width: min-content;
  flex: 0 1 0;
  white-space: nowrap;
  ${(props) =>
    !props.selected &&
    css`
      &:hover {
        background-color: ${darken(0.1, CommonColors.GRAY_2)};
        transition: background-color 0.5s ease;
      }
    `}
`;

const ButtonsSection = styled.div`
  justify-content: flex-end;
  display: flex;
  grid-gap: 0.5rem;
  align-items: center;
`;
//endregion

export interface Props {
  className?: string;
}

export const TabMonitorsAndRouters = React.memo(({ ...props }: Props) => {
  const cdn = useSelectedCdn();
  const [selectedTypes = [ServerType.MONITOR], setSelectedTypes] = useUrlArrayState(
    ProjectUrlParams.monitorRoutersType
  );
  const [filter, setFilter] = useUrlState(ProjectUrlParams.filter1);

  const cdnName = cdn?.name ?? "";
  const cdnId = cdn?.id ?? "";

  const onMonitorConfigEdit = async () => {
    await openQwiltModal((closeModalWithResult) => {
      return <EditorConfigContainer cdn={cdn} mode={"monitors"} onClose={() => closeModalWithResult()} />;
    });
  };

  const onRouterConfigEdit = async () => {
    await openQwiltModal((closeModalWithResult) => {
      return <EditorConfigContainer cdn={cdn} mode={"routers"} onClose={() => closeModalWithResult()} />;
    });
  };

  function changeDisplayedType(types: ServerType[]) {
    setSelectedTypes(types);
    setFilter("");
  }

  const flagMoreConfigurations = ProjectUrlStore.getInstance().getParamExists(
    ProjectUrlParams.tempFlag_serversTabMoreConfigurations
  );

  const flagHealthProviders = ProjectUrlStore.getInstance().getParamExists(ProjectUrlParams.tempFlag_healthProviders);

  return (
    <TabRouterMonitorManagementView className={props.className}>
      <TypeOptions title={"Type"}>
        <Content>
          <TypesContainer>
            <TypeButton
              type={ServerType.MONITOR}
              selected={selectedTypes.includes(ServerType.MONITOR)}
              onClick={() => changeDisplayedType([ServerType.MONITOR])}>
              <ServerTypeIconStyled type={ServerType.MONITOR} /> Monitors
            </TypeButton>
            <TypeButton
              type={ServerType.DNS_ROUTER}
              selected={selectedTypes.includes(ServerType.DNS_ROUTER)}
              onClick={() => changeDisplayedType([ServerType.DNS_ROUTER])}>
              <ServerTypeIconStyled type={ServerType.DNS_ROUTER} /> DNS Routers
            </TypeButton>
            <TypeButton
              type={ServerType.HTTP_ROUTER_GROUP}
              selected={selectedTypes.includes(ServerType.HTTP_ROUTER_GROUP)}
              onClick={() => changeDisplayedType([ServerType.HTTP_ROUTER_GROUP])}>
              <ServerTypeIconStyled type={ServerType.HTTP_ROUTER_GROUP} /> HTTP Router Groups
            </TypeButton>
            <TypeButton
              type={ServerType.HTTP_ROUTER}
              selected={selectedTypes.includes(ServerType.HTTP_ROUTER)}
              onClick={() => changeDisplayedType([ServerType.HTTP_ROUTER, ServerType.MANIFEST_ROUTER])}>
              <ServerTypeIconStyled type={ServerType.HTTP_ROUTER} /> HTTP Routers
            </TypeButton>
            <TypeButton
              type={ServerType.HEALTH_COLLECTOR}
              selected={selectedTypes.includes(ServerType.HEALTH_COLLECTOR)}
              onClick={() => changeDisplayedType([ServerType.HEALTH_COLLECTOR])}>
              <ServerTypeIconStyled type={ServerType.HEALTH_COLLECTOR} /> Health Collectors
            </TypeButton>
            {flagHealthProviders && (
              <TypeButton
                type={ServerType.HEALTH_PROVIDER}
                selected={selectedTypes.includes(ServerType.HEALTH_PROVIDER)}
                onClick={() => changeDisplayedType([ServerType.HEALTH_PROVIDER])}>
                <ServerTypeIconStyled type={ServerType.HEALTH_PROVIDER} /> Health Providers
              </TypeButton>
            )}
          </TypesContainer>

          <ButtonsSection>
            <ConfigButton onClick={onRouterConfigEdit}>
              <span>Router Config</span>
              <ConfigButtonIcon icon={Icons.EDIT} />
            </ConfigButton>

            <ConfigButton onClick={onMonitorConfigEdit}>
              <span>Monitor Config</span>
              <ConfigButtonIcon icon={Icons.EDIT} />
            </ConfigButton>
          </ButtonsSection>
        </Content>
      </TypeOptions>

      {(() => {
        if (selectedTypes[0] === ServerType.HTTP_ROUTER_GROUP) {
          return (
            <HttpRouterGroupsTab cdnId={cdnId} cdnName={cdnName} filter={filter ?? ""} onFilterChange={setFilter} />
          );
        } else if (!flagMoreConfigurations) {
          return (
            <RoutersMonitorsTab
              serverTypes={selectedTypes}
              cdnName={cdnName}
              filter={filter ?? ""}
              onFilterChange={setFilter}
            />
          );
        } else if (selectedTypes.includes(ServerType.DNS_ROUTER)) {
          return <DnsRoutersTabContainer cdnName={cdnName} />;
        } else if (selectedTypes.includes(ServerType.HTTP_ROUTER)) {
          return <HttpRoutersTabContainer cdnName={cdnName} />;
        } else if (selectedTypes.includes(ServerType.MONITOR)) {
          return <MonitorsTabContainer cdnName={cdnName} />;
        } else if (selectedTypes.includes(ServerType.HEALTH_COLLECTOR)) {
          return <HealthCollectorsTabContainer cdnName={cdnName} />;
        } else if (selectedTypes.includes(ServerType.HEALTH_PROVIDER)) {
          return <HealthProvidersTabContainer cdnName={cdnName} />;
        }
      })()}
    </TabRouterMonitorManagementView>
  );
});
